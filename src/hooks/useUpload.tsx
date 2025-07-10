import { useState } from 'react';

export const useUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    const CLOUD_NAME = 'ddymlahvr';
    const UPLOAD_PRESET = 'questboard_profiles';

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Erro ao fazer upload');
      }

      return data.secure_url as string;
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};
