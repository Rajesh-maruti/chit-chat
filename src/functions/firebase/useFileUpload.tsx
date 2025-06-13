import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
  StorageError,
} from "firebase/storage";
import uploadHelper from "./uploadHelper";

const useFileUpload = (props: {
  onProgressChange?: (number: number) => void;
  onUploadError?: () => void;
}) => {
  const storage = getStorage();

  const uploadImage = (file: File, onUpload: () => void) => {
    const storageRef = ref(storage, "images/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadHelper({ uploadTask, onUpload, ...props });
    return uploadTask;
  };

  const uploadVideo = (file: File, onUpload: () => void) => {
    const storageRef = ref(storage, "videos/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadHelper({ uploadTask, onUpload, ...props });
    return uploadTask;
  };

  const getDownLoadUrl = (ref: StorageReference) => {
    // Upload completed successfully, now we can get the download URL
    return getDownloadURL(ref).then((downloadURL) => {
      return downloadURL;
    });
  };

  return { getDownLoadUrl, uploadImage, uploadVideo };
  // Listen for state changes, errors, and completion of the upload.
};

export default useFileUpload;
