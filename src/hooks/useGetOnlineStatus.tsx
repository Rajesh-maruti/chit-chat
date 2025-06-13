import {
  get,
  getDatabase,
  onChildAdded,
  onChildChanged,
  ref,
} from "firebase/database";
import { useCallback } from "react";

const useGetOnlineStatus = () => {
  const OnStatusChange = useCallback(
    async (phoneNumber: string, onStatusChange: (data: any) => void) => {
      const db = getDatabase();
      const presenceRef = ref(db, "onlineStatus" + phoneNumber);
      onChildChanged(presenceRef, (data) => {
        onStatusChange(data.val());
      });
    },
    []
  );

  const getUserStatus = useCallback(async (phoneNumber: string) => {
    const db = getDatabase();
    const presenceRef = ref(db, "onlineStatus" + phoneNumber);
    const data = await get(presenceRef);
    return data.val();
  }, []);

  return { getUserStatus, OnStatusChange };
};

export default useGetOnlineStatus;
