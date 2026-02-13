import React, { useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import moment from "moment";
import {toast} from "react-hot-toast"

const Sidebar = ({ isMenuOpen, setIsMenuOpen }) => {
  const {
    chats,
    selectedChat,
    setSelectedChat,
    navigate,
    theme,
    user,
    setTheme,
    createNewChat,
    axios,
    setChats,
    //fetchUserChats,
    loadUserChats,
    setToken,
    token
  } = useAppContext();

  const [search, setSearch] = useState("");
  
  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    toast.success('Logged out successfully')
  }
  
  const  deleteChat = async (e, chatId) => {
    try {
      e.stopPropagation()
      
       const confirm = window.confirm('Are you sure you want to delete this chat ?')
       if(!confirm) return
       const {data} = await axios.post('/api/chat/delete', {chatId}, {
        headers : {Authorization: token}   })
     if(data.success){
      setChats(prev => prev.filter(chat =>chat._id != chatId))
      await loadUserChats()
      toast.success(data.message)
     }
    } catch (error) {
       toast.error(error.message)
      
    }

  }
    
  return (
    <aside 
      className={`flex flex-col h-screen min-w-72 p-5 bg-white dark:bg-[#181818] border-r border-gray-200 dark:border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 
      max-md:fixed top-0 left-0 z-50 
      ${!isMenuOpen ? "max-md:-translate-x-full" : "max-md:translate-x-0"}`}
    >
      
      {/* Close Sidebar Icon (Mobile Only) */}
      <img 
        onClick={() => setIsMenuOpen(false)} 
        src={assets.close_icon} 
        className="absolute top-5 right-5 w-5 h-5 cursor-pointer md:hidden invert dark:invert-0" 
        alt="close"
      />

      {/* ===== HEADER ===== */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          <img src={assets.logo} alt="logo" className="w-7 h-7" />
          <div>
            <h1 className="text-[15px] font-semibold text-gray-900 dark:text-gray-100">
              SmartAssist
            </h1>
            <p className="text-xs font-medium bg-gradient-to-r from-purple-700 to-violet-500 bg-clip-text text-transparent">
              Smart AI Assistant
            </p>
          </div>
        </div>

         {/*new chat Button */}
        <button onClick={createNewChat} className="flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] test-sm rounded-md cursor-pointer">
         
         <span className="mr-2 text-xl">+</span> New Chat
        </button>

        {/*Search conversion*/}
        <div className="mt-3 flex items-center h-9 px-3 gap-2 border border-gray-300 dark:border-white/20 rounded-md bg-gray-50 dark:bg-[#2a2a2a]">
          <img
            src={assets.search_icon}
            className="w-3.5 opacity-60 invert dark:invert-0" 
            alt="search"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="text-xs w-full outline-none bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* ===== RECENT CHATS ===== */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-2">
        <p className="px-2 mb-2 text-[11px] font-semibold text-gray-400 uppercase">
          Recent Chats
        </p>

        {chats.length > 0 && [...chats]
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .filter(chat =>
            chat.messages.length > 0
              ? chat.messages[0].content.toLowerCase().includes(search.toLowerCase())
              : chat.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((chat) => {
            const active = selectedChat?._id === chat._id;
            return (
              <div 
                key={chat._id}
                onClick={() => { navigate('/'); setSelectedChat(chat); setIsMenuOpen(false); }}
                className={`p-3 px-4 border rounded-md cursor-pointer flex justify-between items-center group transition-all ${
                  active 
                  ? "bg-violet-50 border-violet-200 dark:bg-[#57317C]/20 dark:border-[#80609F]/40" 
                  : "border-gray-200 dark:border-[#80609F]/15 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm text-gray-800 dark:text-gray-200">
                    {chat.messages.length > 0 ? chat.messages[0].content.slice(0, 32) : chat.name}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-[#B1A6C0]">{moment(chat.updatedAt).fromNow()}</p>
                </div>
                <img
                  src={assets.bin_icon} className="w-3 opacity-0 group-hover:opacity-60 transition invert dark:invert-0" alt="" 
                  onClick={e=> toast.promise(deleteChat(e, chat._id), {loading: 'deleting...'})}  />
              </div>
            );
          })}
      </div>

      {/* ===== BOTTOM SECTION ===== */}
      <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-white/10">
        
        <div
          onClick={() => { navigate("/community"); setIsMenuOpen(false); }} 
          className="flex items-center gap-2 h-9 px-3 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
        >
          <img src={assets.gallery_icon} className="w-4 opacity-60 invert dark:invert-0" alt="gallery" />
          <p className="text-sm text-gray-700 dark:text-gray-200">Community Images</p>
        </div>

        {/* Premium Credits Badge */}
        <div 
          onClick={() => { navigate('/credits'); setIsMenuOpen(false); }}
          className="flex items-center gap-3 p-3 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer hover:scale-[1.02] transition-all bg-gradient-to-r from-violet-500/10 to-transparent"
        >
          <img src={assets.diamond_icon} className="w-5 dark:invert" alt="credits" />
          <div className="flex flex-col">
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Credits : {user?.credits}</p>
            <p className="text-[10px] text-gray-500">Purchase to use SmartAssist</p>
          </div>
        </div>

        {/* ===== Dark Mode ===== */}
        <div className="flex items-center justify-between gap-2 p-2 border border-gray-300 dark:border-white/20 rounded-md">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <img src={assets.theme_icon} className="w-4 invert dark:invert-0" alt="theme" />
            <p>Dark Mode</p>
          </div>
          <label className="relative inline-flex cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={theme === "dark"}
              onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
            />
            <div className="w-9 h-5 bg-gray-400 rounded-full peer-checked:bg-violet-600 transition-all"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
          </label>
        </div>

        {/* ===== User Account ===== */}
        <div className="flex items-center gap-3 p-3 border border-gray-300 dark:border-white/15 rounded-md cursor-pointer group hover:bg-gray-50 dark:hover:bg-white/5">
          <img src={assets.user_icon} className="w-7 rounded-full" alt="user" />
          <p className="flex-1 text-sm text-gray-700 dark:text-gray-100 truncate">
            {user ? user.name : 'Login your account'}
          </p>
          {user && (
            <img  onClick={logout}
              src={assets.logout_icon} 
              className="h-5 cursor-pointer hidden group-hover:block invert dark:invert-0 opacity-60 hover:opacity-100" 
              alt="logout" 
            />
          )}
        </div>

        <img onClick={() => setIsMenuOpen(false)} src={assets.close_icon}
        className="absolute top-3 right-5 w-3 h-5 cursor-pointer md:hidden not_dark:invert" alt=""/>
      </div>
    </aside>
  );
};

export default Sidebar;