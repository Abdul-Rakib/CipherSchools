import { createContext, useState, useLayoutEffect } from "react";

export const GlobalContext = createContext({});
export const GlobalProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);

  useLayoutEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);


  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn, setIsLoggedIn, user, setUser, loading, phoneNumber, setPhoneNumber, selectedVendor, setSelectedVendor
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}
