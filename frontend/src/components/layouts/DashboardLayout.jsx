import React, { useContext, useState } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashboardLayout = ({children, activeMenu }) => {
    const { user } = useContext(UserContext)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)


  return (
    <div className=''>
        <Navbar activeMenu={activeMenu} isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {user && (
            <div className='flex '>
                <div className=''>
                    <SideMenu activeMenu={activeMenu} isOpen={isSidebarOpen} />
                </div>

                <div className='grow mx-5'>{children}</div>
            </div>
        )}
    </div>
  )
}

export default DashboardLayout