import React, { useContext, useState } from 'react'
import AuthLayout from './../../components/layouts/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPath';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const { updateUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogin = async (e) =>{
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
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      })

      const { token, role } = response.data

      if(token){
        localStorage.setItem("token", token)
        updateUser(response.data)

        if(role === "admin"){
          navigate("/admin/dashboard")
        } else {
          navigate("/user/dashboard")
        }
      }
    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      } else{
        setError("Something went wrong, please try again later.")
      }
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