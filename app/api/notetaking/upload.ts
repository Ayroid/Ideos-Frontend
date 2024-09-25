import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { IncomingForm, Fields, Files } from 'formidable';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

type Handler = (req: NextApiRequest, res: NextApiResponse) => void | Promise<void>;

const uploadFileToCloudinary = async (file: formidable.File): Promise<UploadApiResponse | undefined> => {
  try {
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'workspace-logos',
      public_id: file.newFilename,
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return undefined;
  }
};

const handler: Handler = async (req, res) => {
  const form = new IncomingForm();

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      console.error('Form parsing error:', err);
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const fileArray = files.logo as formidable.File[] | formidable.File;

    const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await uploadFileToCloudinary(file);

    if (result?.secure_url) {
      res.status(200).json({ url: result.secure_url });
    } else {
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });
};

export default handler;
