import Avatar from "@mui/material/Avatar";
import { randomRgbColor } from "../../../functions/randomColor";
import { useMemo } from "react";

const UserAvatar = (props: {
  image?: string;
  name: string;
  randomBg?: boolean;
}) => {
  const bg = useMemo(() => {
    return props.randomBg ? randomRgbColor() : undefined;
  }, [props.randomBg]);

  if (!props.image)
    return (
      <Avatar sx={props.randomBg ? { backgroundColor: bg } : {}}>
        {props?.name?.charAt(0) === "+" ? undefined : props?.name?.charAt(0)}
      </Avatar>
    );
  return <Avatar src={props.image} alt={props.name} />;
};

export default UserAvatar;
