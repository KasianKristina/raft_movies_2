import { supabase } from '$lib/server/db/supabase';
import { AppError } from '$lib/errors/errors';

const BUCKET_NAME = 'movies';

export async function uploadImage(file: File, folder: string): Promise<string> {
	const fileExtension = file.name.split('.').pop();
	const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
	const filePath = `${folder}/${uniqueFileName}`;

	const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file);

	if (error) throw new AppError('IMAGE_UPLOAD_FAILED');

	const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

	return data.publicUrl;
}
