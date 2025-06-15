import Box from "@mui/material/Box";
import User from "./User";

export type UserDataType = {
  name: string;
  image: string;
  phoneNumber: string;
  id: string;
};

const UserList = (props: { data: UserDataType[] }) => {
  return (
    <Box>
      {props.data?.map((user) => (
        <User user={user} />
      ))}
    </Box>
  );
};

export default UserList;
