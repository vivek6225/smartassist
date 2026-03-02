import React, { useState, useEffect, useRef } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import Message from './Message';
import toast from 'react-hot-toast';

const ChatBox = () => {

  const containerRef = useRef(null)
  const { selectedChat,theme, user , axios, token, setUser } = useAppContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState('text');
  const [isPublished, setIsPublished] = useState(false);

  const onSubmit = async (e) => {
    try {
       e.preventDefault();
       if(!user) return toast('Login to send message')
        setLoading(true)
      const promptCopy = prompt;
      setPrompt('')
      setMessages(prev => [...prev, {role : 'user', content: prompt, timestamp: Date.now(), isImage : false}])
      const {data} = await axios.post(`/api/message/${mode}`, {chatId : selectedChat._id, prompt, isPublished}, {headers : {'Authorization' : token}})

      if(data.success){
        setMessages(prev => [...prev, data.reply])
        //decrease credits
        if(mode == 'image'){
          setUser(prev => ({...prev, credits: prev.credits -2}))
        }else{
          setUser(prev => ({...prev, credits: prev.credits - 1}))
        }

      }else{
        toast.error(data.message)
        setPrompt(promptCopy)
      }
    } catch (error) {
      toast.error(error.message)      
    }finally{
      setPrompt('')
      setLoading(false)

    }
   
  }
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages);
    } 
    
  }, [selectedChat]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, loading]); 

  return (
    <div className='flex-1 flex flex-col justify-between m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40 h-[90vh]'>

      {/* Chat message */}
      <div ref={containerRef} className='flex-1 mb-5 overflow-y-scroll scrollbar-hide'>

        {messages.length === 0 ? (
          <div className='h-full flex flex-col items-center justify-center'>
            <div className='flex items-center gap-4 mb-8'>
              <img src={assets.logo} alt="Logo" className='w-12 h-12' />
              <div className='text-left'>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white leading-none'>SmartAssist</h2>
                <p className='text-[15px] font-bold text-violet-600 mt-1'> Smart AI Assistant</p>
              </div>
            </div>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-zinc-600'>Ask me anything.</h1>
          </div>
        ) : (
          <div className='flex flex-col items-start w-full pt-10'>
            {messages.map((msg, index) =>
              <Message key={index} message={msg} />
            )}

            {loading && (
              <div className='loader flex items-center gap-1 pl-10 my-2'>
                <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
                <div className='w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-white animate-bounce'></div>
              </div>
            )}
          </div>
        )}
      </div>

      {mode === 'image' && (
        <label className='inline-flex items-center gap-2 mb-3 text-sm mx-auto dark:text-white'>
          <p className='text-xs'>Publish Generated Image to Community</p>
          <input type="checkbox" className='cursor-pointer' checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)} />
        </label>
      )}

      {/* prompt Input message  */}
      <form onSubmit={onSubmit} className='bg-white dark:bg-[#2c1a3a] border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-2 pl-4 mx-auto flex gap-4 items-center shadow-md'>
        <select 
          onChange={(e) => setMode(e.target.value)} 
          value={mode} 
          className='text-sm pl-3 pr-2 outline-none bg-transparent dark:text-white cursor-pointer'
        >
          <option value="text" className='text-black'>Text</option>
          <option value="image" className='text-black'>Image</option>
        </select>

        <input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          type="text"
          placeholder='Type your prompt here..'
          className='flex-1 w-full text-sm outline-none bg-transparent dark:text-white'
          required
        />

        <button type="submit" disabled={loading} className='flex-shrink-0'>
        
          <img src={loading ? assets.stop_icon : assets.send_icon} className={`w-8 cursor-pointer ${!loading && 'dark:invert'}`} alt="" />
        </button>
      </form>

    </div>
  )
}

export default ChatBox