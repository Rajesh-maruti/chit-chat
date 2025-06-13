import Box from "@mui/material/Box";

const Image = (props: { image: string | File }) => {

  const handleObjectUrl = (image: File) => {
    try {
      return URL.createObjectURL(image);
    } catch {
      return null;
    }
  };
  const url =
    typeof props.image === "string"
      ? props.image
      : handleObjectUrl(props.image);
  if (!url) return <></>;
  return (
    <Box>
      <img
        src={url}
        alt="message-image"
        style={{ maxWidth: "100%", height: "auto", maxHeight: "200px" }}
      />
    </Box>
  );
};

export default Image;
