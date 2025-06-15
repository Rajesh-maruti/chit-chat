import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import { getDatabase, onDisconnect, ref, set } from "firebase/database";

const useUpdateOnlineStatus = () => {
  const phoneNumber = useSelector(
    (state: RootState) => state.account.value?.phoneNumber
  );

  const db = getDatabase();
  const presenceRef = ref(db, "onlineStatus" + phoneNumber);
  useEffect(() => {
    set(presenceRef, { online: true });
  }, [presenceRef]);
  // Write a string when this client loses connection
  onDisconnect(presenceRef).set({ online: false });
};

export default useUpdateOnlineStatus;
