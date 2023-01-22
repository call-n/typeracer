import { useEffect, createContext, useContext, useReducer } from "react";

import reducer from "./reducer";
const PreferenceContext = createContext({});

export function PreferenceProvider({ children }) {
  const [preferences, dispatch] = useReducer(reducer, {
    isOpen: false,
    type: "words",
    time: "15",
  });

  useEffect(() => {
    if (typeof window !== undefined) {
      const type = window.localStorage.getItem("type");
      const time = window.localStorage.getItem("time");
      if (type) dispatch({ type: "SET_TYPE", payload: type });
      if (time) dispatch({ type: "SET_TIME", payload: time });
    }
  }, []);

  return (
    <PreferenceContext.Provider value={{ preferences, dispatch }}>
      {children}
    </PreferenceContext.Provider>
  );
}

export const usePreferenceContext = () => useContext(PreferenceContext);
