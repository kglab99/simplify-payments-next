import { useState, useEffect } from "react";

const useLocalStorage = (key, initialValue, exampleValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }

    if (exampleValue) {
      localStorage.setItem(key, JSON.stringify(exampleValue));
      return exampleValue;
    }
    return initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
