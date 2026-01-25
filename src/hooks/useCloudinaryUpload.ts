import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const useCloudinaryUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large (max 5MB)');
      throw new Error('File too large');
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || 'ticketflow_preset',
    );

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      setUploading(false);
      return response.data.secure_url;
    } catch (error) {
      setUploading(false);
      const errorMsg = axios.isAxiosError(error)
        ? error.response?.data?.error?.message
        : 'Image upload failed';

      console.error('Cloudinary Upload Error:', error);
      toast.error(errorMsg);
      throw error;
    }
  };

  return { uploadImage, uploading };
};
