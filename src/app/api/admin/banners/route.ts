import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { put, del } from '@vercel/blob';

export const dynamic = 'force-dynamic';

const FORBIDDEN = () => NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 });

// 관리자용: 모든 배너 조회 (비활성 포함)
export async function GET() {
  if (!(await requireAdmin())) return FORBIDDEN();

  const banners = await prisma.banner.findMany({ orderBy: { order: 'asc' } });
  return NextResponse.json(banners);
}

// 배너 생성 (파일 업로드)
export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return FORBIDDEN();

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const linkUrl = (formData.get('linkUrl') as string) || '';

    if (!file) {
      return NextResponse.json({ error: '이미지 파일을 선택해주세요.' }, { status: 400 });
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: '파일 크기는 10MB 이하만 가능합니다.' }, { status: 400 });
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'JPG, PNG, WebP, GIF 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    // Vercel Blob에 업로드
    const blob = await put(`banners/${Date.now()}-${file.name}`, file, { access: 'public' });

    // 현재 최대 order 값 조회
    const maxOrder = await prisma.banner.aggregate({ _max: { order: true } });
    const nextOrder = (maxOrder._max.order ?? -1) + 1;

    const banner = await prisma.banner.create({
      data: {
        imageUrl: blob.url,
        title: title || null,
        linkUrl: linkUrl || null,
        order: nextOrder,
        active: true,
      },
    });

    return NextResponse.json(banner);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '배너 생성에 실패했습니다.' }, { status: 500 });
  }
}

// 배너 순서/활성 일괄 업데이트
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return FORBIDDEN();

  try {
    const { banners } = await req.json() as {
      banners: { id: string; order: number; active: boolean }[];
    };

    await prisma.$transaction(
      banners.map((b) =>
        prisma.banner.update({
          where: { id: b.id },
          data: { order: b.order, active: b.active },
        })
      )
    );

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '업데이트에 실패했습니다.' }, { status: 500 });
  }
}

// 배너 삭제
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return FORBIDDEN();

  try {
    const { id } = await req.json() as { id: string };

    const banner = await prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      return NextResponse.json({ error: '배너를 찾을 수 없습니다.' }, { status: 404 });
    }

    // Blob에서 이미지 삭제
    try {
      await del(banner.imageUrl);
    } catch {
      // Blob 삭제 실패해도 DB 삭제는 진행
    }

    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: '삭제에 실패했습니다.' }, { status: 500 });
  }
}
