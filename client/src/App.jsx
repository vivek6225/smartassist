import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import { Route, Routes, useLocation } from 'react-router-dom'
import ChatBox from './components/ChatBox'
import Credits from './pages/Credits'
import Community from './pages/Community'
import { assets } from './assets/assets'
import './assets/prism.css'
import Loading from './pages/Loading'
import Login from './pages/Login'
import { useAppContext } from './context/AppContext'
import {Toaster} from 'react-hot-toast'

const App = () => {

  
    const {user, loadingUser} = useAppContext()
  

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const {pathname} = useLocation()

  if(pathname === '/loading' || loadingUser) return < Loading/>

  return (

          <>
      <Toaster />

    <div className="relative dark:bg-gradient-to-b from-[#242124] to-[#000000] dark:text-white">
      
      {/* Menu Icon for Mobile */}
      {!isMenuOpen && (
        <img 
          src={assets.menu_icon} 
         
          className='absolute top-4 left-4 w-7 h-7 cursor-pointer md:hidden invert dark:invert-0 z-50' 
          onClick={() => setIsMenuOpen(true)}
          alt="menu"
        />
      )}

        {user ? (
        <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<ChatBox />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/community" element={<Community />} />
          </Routes>
        </div>
      </div>
        ) : (
          <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
            <Login />
          </div>
        )}
    
    </div>
    </>
  )
}

export default App