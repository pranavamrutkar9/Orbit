import React from 'react'
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const Navbar = ({ activeMenu, isOpen, toggleSidebar }) => {
  return (
    <div className='flex bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-50'>
        <button
            className='block md:hidden text-black'
            onClick={toggleSidebar}
        >
            {isOpen ? (
                <HiOutlineX className="text-2xl" />
            ) : (
                <HiOutlineMenu className="text-2xl" />
            )}
        </button>

        <h2 className='text-lg font-medium text-black'>Orbit</h2>
    </div>
  )
}

export default Navbar