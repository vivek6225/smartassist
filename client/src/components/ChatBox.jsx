import React, { useState, useEffect } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import Message from './Message';

const ChatBox = () => {
    const { selectedChat } = useAppContext();
    const [messages, setMessages] = useState([])

    useEffect(() => {
        // Debugging ke liye: console mein check karein data aa raha hai ya nahi
        console.log("Selected Chat Data:", selectedChat);
        if (selectedChat && selectedChat.messages) {
            setMessages(selectedChat.messages)
        } else {
            setMessages([])
        }
    }, [selectedChat])

    return (
        <div className='flex-1 flex flex-col m-5 md:m-10 xl:mx-30 max-md:mt-14 2xl:pr-40 h-[90vh]'>
            
            <div className='flex-1 overflow-y-auto scrollbar-hide'>
                {/* Landing Page logic - Ternary Operator */}
                {messages.length === 0 ? (
                    <div className='h-full flex flex-col items-center justify-center'>
                        <div className='flex items-center gap-4 mb-8'>
                            <img src={assets.logo} alt="Logo" className='w-12 h-12' /> 
                            <div className='text-left'>
                                <h2 className='text-3xl font-bold text-gray-900 dark:text-white leading-none'>SmartAssist</h2>
                                <p className='text-[11px] font-bold uppercase text-violet-600 mt-1'> Smart AI Assistant</p>
                            </div>
                        </div>
                        <h1 className='text-4xl md:text-6xl font-bold text-gray-400 dark:text-white'>Ask me anything.</h1>
                    </div>
                ) : (
                    
                    <div className='flex flex-col items-start w-full pt-10'>
                        {messages.map((msg, index) => (
                            <Message key={index} message={msg} />
                        ))}
                    </div>
                )}
            </div>

            {/* Input Form - bottom par fixed rahega */}
            <form className='mt-5 relative w-full max-w-4xl mx-auto flex items-center bg-gray-100 dark:bg-zinc-900 rounded-xl px-4 py-3'>
                <input 
                    type="text" 
                    placeholder='Ask me anything...' 
                    className='flex-1 bg-transparent outline-none dark:text-white text-sm'
                />
                <div className='flex items-center gap-3 ml-2'>
                    <img src={assets.gallery_icon} className='w-5 cursor-pointer dark:invert opacity-60' alt="" />
                    <button type="submit">
                        <img src={assets.send_icon} className='w-5 dark:invert' alt="" />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ChatBox