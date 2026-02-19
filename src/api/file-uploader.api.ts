import type User from "@/types/User";
import { uploadFileInChunks } from "@/utils/chunk-uploader";
import axios from "axios";
import toast from "react-hot-toast";

export const FILE_UPLOADER_API_URL = import.meta.env.FILE_UPLOADER_API_URL;

export const extractUrlParam = (
  url: string | null | undefined,
  param: string,
): string => {
  try {
    if (!url) throw new Error();
    const selectedUrl = new URL(url);
    return selectedUrl.searchParams.get(param) || "";
  } catch {
    return "";
  }
};

export const deleteImage = async (
  filename: string,
  folder: string,
): Promise<string> => {
  const response = await axios.delete(
    `${FILE_UPLOADER_API_URL}/delete?folder=${encodeURI(folder)}&filename=${filename}`,
  );
  return response.data;
};

export const uploadImage = async (
  fileInputRef: HTMLInputElement | null,
): Promise<string | null> => {
  if (!fileInputRef || !fileInputRef.files || fileInputRef.files.length === 0) {
    return null;
  }
  const randomFolderName = `do-it-list-${crypto.randomUUID()}`;
  const file = fileInputRef.files[0];
  return encodeURI(
    (await uploadFileInChunks(file, randomFolderName)) as string,
  );
};

export const handleImageUpload = async (
  fileInput: HTMLInputElement | null,
  setUploading: (bl: boolean) => void,
  setChangeImageModalOpen: (bl: boolean) => void,
  user: User | null,
  updateUser: (user: object) => Promise<boolean>,
) => {
  if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
    toast.error("Please select a file");
    return;
  }

  const file = fileInput.files[0];

  try {
    setUploading(true);

    if (user?.imageUrl) {
      const fileNameFromUrl = extractUrlParam(user?.imageUrl, "filename");
      const folderNameFromUrl = extractUrlParam(user?.imageUrl, "folder");
      deleteImage(fileNameFromUrl, folderNameFromUrl);
    }

    const randomFolderName = `do-it-list-${crypto.randomUUID()}`;

    const uploadedImageUrl = encodeURI(
      (await uploadFileInChunks(file, randomFolderName)) as string,
    );

    const success = await updateUser({
      imageUrl: uploadedImageUrl,
    });

    if (success) {
      setChangeImageModalOpen(false);
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile picture");
  } finally {
    setUploading(false);
  }
};
