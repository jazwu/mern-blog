import { Button, Label, TextInput } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link
            to='/'
            className='font-bold dark:text-white text-4xl'
          >
            <span
              className='px-2 py-1 bg-gradient-to-r from-indigo-500 
              via-purple-500 to-pink-500 rounded-lg text-white'
            >
              Jasmine's
            </span>
            Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a blog app. You can sign up with your email and password or with Google to create a new account.
          </p>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form  className='flex flex-col gap-4'>
          <div>
              <Label value='Your username' />
              <TextInput type='text' id='username' placeholder='Username'/>
            </div>
            <div>
              <Label value='Your email' />
              <TextInput type='email' id='email' placeholder='name@company.com'/>
            </div>
            <div>
              <Label value='Your password' />
              <TextInput type='password' id='password' placeholder='Password'/>
            </div>
            <Button gradientDuoTone='purpleToBlue' type='submit'>
              Sign Up
            </Button>
          </form>
          <p className='text-sm mt-5'>
            Already have an account? <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
