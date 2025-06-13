import Box from "@mui/material/Box";
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { ClickAwayListener } from "@mui/material";
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";

const Emoji = (props: { onEmojiClick: MouseDownEvent }) => {
  const [open, setOpen] = useState(false);
  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box>
        <EmojiEmotionsIcon
          onClick={() => setOpen(!open)}
          sx={{ cursor: "pointer" }}
          color="primary"
        />
        <Box position="absolute" bottom={0} right={0} zIndex={100}>
          <EmojiPicker open={open} onEmojiClick={props.onEmojiClick} />
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default Emoji;
