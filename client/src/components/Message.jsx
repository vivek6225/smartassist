import React from 'react'
import { assets } from '../assets/assets'

const Message = ({ message }) => {
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className='w-full flex flex-col'>
      {message.role === "user" ? (
        <div className='flex items-start justify-end my-4 gap-3 px-2 ml-auto max-w-[80%]'>
          <div className='flex flex-col gap-1 p-3 bg-slate-100 dark:bg-[#57317C]/30 border border-[#80609F]/30 rounded-lg'>
            <p className='text-sm text-black dark:text-white'>{message.content}</p>
            <span className='text-[10px] text-gray-500 font-bold self-end'>{formatTime(message.timestamp)}</span>
          </div>
          <img src={assets.user_icon} alt="" className='w-8 h-8 rounded-full shadow-sm' />
        </div>
      ) : (
        <div className='flex items-start justify-start my-4 gap-3 px-2 mr-auto max-w-[80%]'>
          <img src={assets.logo_icon} alt="" className='w-8 h-8 rounded-full shadow-sm' />
          <div className='flex flex-col gap-1 p-3 bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-white/5 rounded-lg shadow-sm'>
            {message.isImage ? (
                <img src={message.content} alt="" className='max-w-xs rounded-md mb-2' />
            ) : (
                <p className='text-sm text-black dark:text-white leading-relaxed'>{message.content}</p>
            )}
            <span className='text-[10px] text-gray-400 font-bold'>{formatTime(message.timestamp)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Message