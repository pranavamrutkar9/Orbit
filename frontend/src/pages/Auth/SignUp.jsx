import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { validateEmail } from '../../utils/helper'
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector'
import Input from '../../components/Inputs/Input'
import { Link } from 'react-router-dom'

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [adminInviteToken, setAdminInviteToken] = useState("")
  const [error, setError] = useState("")

  const handleSignUp = (e) => {
    e.preventDefault()

    if (!fullName) {
      setError("Please enter your name")
      return
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    if (!password) {
      setError("Please enter a password")
      return
    }
    setError("")

    //sign up api call

  }

  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create Account!</h3>
        <p className='text-xs text-[#273f4f] mt-1.25 mb-6'>Please Enter Your Details</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector
            image={profilePic}
            setImage={setProfilePic}
          />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              type='text'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              label='Full Name'
              placeholder='John Doe'
            />
            <Input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label='Email Address'
              placeholder='dave@example.com'
            />

            <Input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label='Password'
              placeholder="Min 8 characters"
            />
            <Input
              type='text'
              value={adminInviteToken}
              onChange={(e) => setAdminInviteToken(e.target.value)}
              label='Admin Invite Token'
              placeholder='6 digit code'
            />
          </div>

            {error && <p className='text-red-500 text-xs mt-1.5'>{error}</p>}
            <button type="submit" className='btn-primary'>
              Register
            </button>

            <p className='text-[13px] text-slate-800 mt-3'>
              Already have an account?{" "}
              <Link className='font-medium text-primary underline' to="/signup">SignUp</Link>
            </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp