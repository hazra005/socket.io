import React from 'react'

const page = () => {
  return (
    <div className='flex items-center justify-center h-screen gap-8 p-12 bg-gradient-to-r from-blue-500 to-purple-700 backdrop-blur-sm'>
      <iframe src="/Socket" className='w-full h-full border-2 border-green-500 rounded-md box-shadow-lg shadow-lg bg-white/40 backdrop-blur-sm' />
      <iframe src="/Socket" className='w-full h-full border-2 border-green-500 rounded-md box-shadow-lg shadow-lg bg-white/40 backdrop-blur-sm'/>
    </div>
  )
}

export default page
