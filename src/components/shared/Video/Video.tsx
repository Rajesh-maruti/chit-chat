import Box from "@mui/material/Box";

const Video = (props: { src: string | File }) => {
  const url =
    typeof props.src === "string" ? props.src : URL.createObjectURL(props.src);
  return (
    <Box>
      <video
        controls
        style={{ maxWidth: "100%", height: "auto", maxHeight: "200px" }}
      >
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </Box>
  );
};

export default Video;
