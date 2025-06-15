import { DatabaseReference, get, query } from "firebase/database";
import { useCallback, useRef } from "react";

const usePagination = () => {
  const lastDataKey = useRef<string | number | null>(null);

  const getPreviousData = useCallback(async (ref: DatabaseReference) => {
    // To add pagination
    // const chatsQuery = lastDataKey?.current
    //   ? query(ref, startAt(lastDataKey?.current), limitToLast(20))
    //   : query(ref, limitToLast(20));
    const chatsQuery = lastDataKey?.current ? query(ref) : query(ref);
    const chats = await get(chatsQuery);
    if (chats.exists()) {
      const data: Array<any> = [];
      chats.forEach((each) => {
        data.push(each.val());
      });
      lastDataKey.current = data.at(-1).key;

      return data;
    }

    return [];
  }, []);

  return { getPreviousData };
};

export default usePagination;
