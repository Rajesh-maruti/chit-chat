import AttachFileIcon from "@mui/icons-material/AttachFile";
import Box from "@mui/material/Box";
import { useRef } from "react";

const FileInput = (props: { onFileChange: (files: Array<File>) => void }) => {
  const ref = useRef<null | HTMLInputElement>(null);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onFileChange(e.target.files ? Array.from(e.target.files) : []);
  };
  return (
    <Box
      onClick={() => ref.current?.click()}
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ cursor: "pointer" }}
    >
      <AttachFileIcon />
      <input
        accept="image/*"
        ref={ref}
        type="file"
        hidden
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default FileInput;
