import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dummyUserData, dummyChats } from "../assets/assets";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const[token, setToken] = useState(localStorage.getItem('token')|| null)
  const[loadingUser, setLoading] = useState(true)
    

  

 
  const loadUserData = async () => {
   try {
     const {data} = await axios.get('/api/user/data', {headers:{Authorization:token}})
     if(data.success){
      setUser(data.user)
     }else{
      toast.error(data.message)

     }
   } catch (error) {
      toast.error(error.message)
    
   }finally{
    setLoading(false)
   }
  }

  const createNewChat = async () => {
    try {
      if(!user) return toast('login to create a new chat')
        navigate('/')
      await axios.get('/api/chat/create',{headers:{Authorization:token}})
      await loadUserChats()
    } catch (error) {
      toast.error(error.message)
    }
  }

  
  const loadUserChats = async () => {
  try {
    const {data} = await axios.get('/api/chat/get', {headers: {Authorization:token}})
      if(data.success){
        setChats(data.chats)
        //if the user has no chats,  create one
        if(data.chats.length === 0){
          await createNewChat();
         // return loadUserChats();
        }else{
          setSelectedChat(data.chats[0])
        }
      }else{
        toast.error(data.message)
      }
  } catch (error) {
    toast.error(error.message)
    
  }
    
  }
  useEffect(() => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(()=>{
    if(user){
      loadUserChats()
    }
    else{
      setChats([])
      setSelectedChat(null)
    }
  },[user])

  useEffect(()=>{
    if(token){
      loadUserData()
    }else{
      setUser(null)
      setLoading(false)
    }
    
  },[token])

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
        createNewChat,loadingUser,loadUserChats,token,setToken,axios
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);