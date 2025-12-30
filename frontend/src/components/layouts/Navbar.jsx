import React, { useState } from 'react'
import SideMenu from './SideMenu'
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false)
  return (
    <div className='flex bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-50'>
        <button
            className='block lg:hidden text-black'
            onClick={()=>{
                setOpenSideMenu(!setOpenSideMenu)
            }}
        >
            {openSideMenu ? (
                <HiOutlineX className="text-2xl" />
            ) : (
                <HiOutlineMenu className="text-2xl" />
            )}
        </button>

        <h2 className='text-lg font-medium text-black'>Orbit</h2>

        {openSideMenu && (
            <div className='fixed top-[61px] -ml-4 bg-white'>
                <SideMenu activeMenu={activeMenu} />
            </div>
        )}
    </div>
  )
}

export default Navbar