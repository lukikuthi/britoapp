import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to a specific Supabase Storage bucket.
 * @param bucketName Name of the bucket (e.g., "financeiro-anexos")
 * @param file The File object to upload
 * @param path Prefix path inside the bucket (e.g., "boletos/2026")
 * @returns The full path of the uploaded file
 */
export async function uploadFileToBucket(bucketName: string, file: File, path: string = "") {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const fullPath = path ? `${path}/${fileName}` : fileName;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fullPath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw new Error(`Erro no upload: ${error.message}`);
  }

  return data.path;
}

/**
 * Gets a public URL for a file in a public bucket.
 */
export function getPublicFileUrl(bucketName: string, path: string) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Creates a signed URL for a file in a private bucket.
 */
export async function getSignedFileUrl(bucketName: string, path: string, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(path, expiresIn);

  if (error) {
    throw new Error(`Erro ao gerar link seguro: ${error.message}`);
  }

  return data.signedUrl;
}

/**
 * Deletes a file from a bucket.
 */
export async function deleteFileFromBucket(bucketName: string, path: string) {
  const { error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) {
    throw new Error(`Erro ao deletar arquivo: ${error.message}`);
  }
}
