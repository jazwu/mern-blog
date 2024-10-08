import React from 'react'

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font-semibold text-center my-7'>About Jasmine's Blog</h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to Jasmine's Blog! This is a full-stack web application built with the MERN stack (MongoDB, Express, React, Node.js).
            </p>
            <p>
              This app was created by Jasmine, an aspiring frontend engineer studying at NYU. 
              Her passion for frontend development ignited in 2022 during an internship at PwC Shanghai, and it continued to grow during her 1-year full-time role at a Fintech startup in Hong Kong, where she built a BtoB loan platform.
            </p>
            <p>
            Jasmine continues to learn and grow at NYU. She worked on a group project using Django, where she experienced the full web development cycle—from product design, development to CI/CD and deployment. She also completed this blog as a solo project.
            </p>
            <p>
              Please leave comments on posts and share your thoughts. I would love to hear from you!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
