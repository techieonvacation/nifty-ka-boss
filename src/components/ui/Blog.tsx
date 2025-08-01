import React from 'react'



const Blog = () => {
  return (
    <div className='relative h-[500px]'>
<div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-purple-900 to-green-900">
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="blog-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0.05)"/>
          <stop offset="50%" stopColor="rgba(16, 185, 129, 0.05)"/>
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0.05)"/>
        </linearGradient>
      </defs>
      <path fill="url(#blog-grad)" fillOpacity="1" d="M0,160L48,138.7C96,117,192,75,288,64C384,53,480,75,576,101.3C672,128,768,160,864,165.3C960,171,1056,149,1152,133.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
    </svg>
  </div>
  <div className="absolute inset-0 opacity-20">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="blog-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.3)"/>
        </pattern>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#blog-dots)"/>
    </svg>
  </div>
    </div>
  )
}

export default Blog