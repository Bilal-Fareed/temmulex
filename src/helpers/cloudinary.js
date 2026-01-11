import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadPdf(file, folder) {
  if (!file) return null;

  const result = await cloudinary.uploader.upload(file.path, {
    resource_type: "raw",
    folder,
  });

  return result.secure_url;
}
