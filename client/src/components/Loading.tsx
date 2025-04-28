import { Loader } from 'lucide-react'
import React from 'react'

const Loading = () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-bg-lightGreen '>
      <Loader className='animate-spin w-16 h-16 text-white'/>
    </div>
  )
}

export default Loading
