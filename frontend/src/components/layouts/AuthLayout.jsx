import React from 'react'
import UI_IMG from "../../assets/images/UI_IMG.png"

const AuthLayout = ({children}) => {
  return <div className="flex flex-col md:flex-row min-h-screen">
        <div className="w-full md:w-[60vw] min-h-screen md:h-screen px-6 md:px-12 pt-8 pb-12">
            <h2 className='text-3xl font-bold text-black'>Orbit</h2>
            {children}
        </div>

        <div className='hidden md:flex md:w-[40vw] md:h-screen items-center justify-center bg-[#273f4f] bg-[url("/bg-img.png")] bg-cover bg-no-repeat bg-center overflow-hidden p-8'>
            <img src={UI_IMG} className='w-64 lg:w-[90%] max-w-full' alt="UI preview"/>
        </div>
    </div>
}

export default AuthLayout