import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data'

const SideMenu = ({ activeMenu, isOpen }) => {
    const { user, clearUser } = useContext(UserContext)
    const [sideMenuData, setSideMenuData] = useState([])

    const navigate = useNavigate()

    const handleClick = (route) => {
        if(route === 'logout'){
            handleLogout()
            return;
        }
        navigate(route)
    }

    const handleLogout = () => {
        localStorage.clear()
        clearUser()
        navigate('/login')
    }

    useEffect(() => {
      if(user){
        setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
      }
      return () => {}
    }, [user])
    
  return (
    <div className={`w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 z-20 shrink-0 md:block md:sticky md:top-15.25 ${isOpen ? 'block fixed left-0 top-15.25' : 'hidden'}`}>
        <div className="flex flex-col mb-7 pt-5 items-center justify-center ">
            <div className="relative">
                <img 
                    src={user?.profileImageUrl || null}
                    alt='Profile Image'
                    className='w-20 h-20 bg-slate-400 rounded-full object-cover object-center'
                />
            </div>

            {user?.role === 'admin' && (
                <div className='text-[10px] font-medium text-white bg-primary px-3 rounded mt-1 pt-1 '>
                    Admin
                </div>
            )}

            <h5 className='text-gray-950 font-medium leading-6 mt-3 w-full text-center'>
                {user?.name || ''}
            </h5>
            <p className='text-[12px] text-gray-500 w-full text-center'> {user?.email || ''}</p>

            <div className='w-full px-4 mt-6'>
                {sideMenuData.map((item, index) => (
                    <button
                        key={`menu_${index}`}
                        className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 mb-3 cursor-pointer rounded ${
                            activeMenu === item.label
                            ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-4 border-primary"
                            : "text-slate-500"
                        }`}
                        onClick={() => handleClick(item.path)}
                    >
                        <item.icon className="text-xl"/>
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    </div>
  )
}

export default SideMenu