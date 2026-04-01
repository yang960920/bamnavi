import { put } from '@vercel/blob';

export async function uploadImage(file: File, folder = 'posts'): Promise<string> {
  const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}
