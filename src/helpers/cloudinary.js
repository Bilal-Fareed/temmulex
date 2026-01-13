import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadFile(file, folder) {
	if (!file) return null;

	const { name } = path.parse(file.originalname);

	const result = await new Promise((resolve, reject) => {
		const stream = cloudinary.uploader.upload_stream({
			folder,
			public_id: name,
			resource_type: "auto",
			use_filename: true,
			unique_filename: false,
			overwrite: true,
		}, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});

		stream.end(file.buffer);
	});

	return result.secure_url;
}