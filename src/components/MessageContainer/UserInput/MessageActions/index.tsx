import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useEffect, useRef, useState } from "react";
import Emoji from "../../../shared/Emoji";
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";
import SendIcon from "@mui/icons-material/Send";

export type MessageActionsProps = {
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  onEmojiClick?: (emoji: string) => void;
  hideEmoji?: boolean;
  hideSend?: boolean;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
};

const MessageActions = (props: MessageActionsProps) => {
  const [value, setValue] = useState(props.value || "");
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const ref = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    if (props.value) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleEmojiClick: MouseDownEvent = (e) => {
    const inputElement = ref.current?.children[0]
      ?.children[0] as HTMLInputElement;
    const cursorEnd = cursorPosition ?? inputElement?.selectionEnd ?? 0;
    setValue(
      (prev) => `${prev.slice(0, cursorEnd)}${e.emoji}${prev.slice(cursorEnd)}`
    );
    setCursorPosition((prev) => (prev ? prev + 2 : cursorEnd + 2));
    props.onEmojiClick?.(e.emoji);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (value.trim()) {
        props.onSend?.(value);
        setValue("");
      }
    }
  };
  return (
    <Box
      width="100%"
      display="flex"
      position="relative"
      alignItems="center"
      gap={2}
    >
      <TextField
        onFocus={() => setCursorPosition(null)}
        ref={ref}
        value={value}
        disabled={props.disabled}
        placeholder={props.placeholder}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setValue(e.target.value);
          setCursorPosition(null);
          props.onChange?.(e.target.value);
        }}
        variant="outlined"
        sx={{ width: "100%" }}
      />
      {!props.hideEmoji && (
        <Box>
          <Emoji onEmojiClick={handleEmojiClick} />
        </Box>
      )}
      {!props.hideSend && (
        <Box
          onClick={() => {
            setValue("");
            if (value.trim()) {
              props.onSend?.(value);
            }
          }}
          sx={{ cursor: "pointer" }}
        >
          <SendIcon color="primary" />
        </Box>
      )}
    </Box>
  );
};

export default MessageActions;
