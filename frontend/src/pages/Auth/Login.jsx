import React, { useState } from 'react'
import AuthLayout from './../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleLogin = (e) =>{
    e.preventDefault()

    if(!validateEmail(email)){
      setError("Please enter a valid email address")
      return
    }
    if(!password){
      setError("Please enter a password")
      return
    }
    setError("")

    //login api call
    try {
      
    } catch (error) {
      
    }
  }
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Welcome Back!</h3>
        <p className='text-xs text-[#273f4f] mt-1.25 mb-6'>Please Enter Your Details</p>

        <form onSubmit={handleLogin}>
          <Input
            type='email'
            value={email}
            onChange={(e)=> setEmail(e.target.value)}
            label='Email Address'
            placeholder='dave@example.com'
          />
          
          <Input
            type='password'
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            label='Password'
            placeholder='****'
          />

          {error && <p className='text-red-500 text-xs mt-1.5'>{error}</p>}
          <button type="submit" className='btn-primary'>
            Login
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link className='font-medium text-primary underline' to="/signup">SignUp</Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default Login