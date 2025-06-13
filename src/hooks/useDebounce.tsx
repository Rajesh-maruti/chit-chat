import { useEffect, useState } from "react";

const useDeboubnce = (value: string, delay: number) => {
  const [debouncevalue, setDebounceValue] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => {
      return clearTimeout(timeout);
    };
  }, [value, delay]);

  return debouncevalue;
};
export default useDeboubnce;
