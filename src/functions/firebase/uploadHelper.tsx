import { StorageError, UploadTask } from "firebase/storage";
import toast from "../toast";

const uploadHelper = (props: {
  uploadTask: UploadTask;
  onProgressChange?: (progress: number) => void;
  onPaused?: () => void;
  onResume?: () => void;
  onUploadError?: (error: StorageError) => void;
  onUpload: () => void;
}) => {
  props.uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (progress === 100) {
        props.onUpload();
      }
      props.onProgressChange?.(progress);
      switch (snapshot.state) {
        case "paused":
          props.onPaused?.();
          break;
        case "running":
          props.onResume?.();
          break;
      }
    },
    (error) => {
      props.onUploadError?.(error);
      toast.error("upload errro. " + error.message);
    }
  );
};

export default uploadHelper;
