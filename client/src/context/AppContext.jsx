import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData, dummyChats } from "../assets/assets";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // 1. Fixed: Set USER data to User state, not chats state
  const loadUserData = async () => {
    setUser(dummyUserData);
  }

  
  const loadUserChats = async () => {
    setChats(dummyChats);
      setSelectedChat(dummyChats); 
    
  }

  
  useEffect(() => {
    loadUserData();
    loadUserChats();
  }, []);

  
  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser, 
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);