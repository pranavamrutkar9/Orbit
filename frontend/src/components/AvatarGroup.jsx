import React from 'react'

const AvatarGroup = ({ avatars, maxVisible}) => {
  return (
    <div className='flex items-center'>
        {avatars.slice(0, maxVisible).map((avatar, index) =>(
            <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className='w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover object-center'
            />
        ))}
        {avatars.length > maxVisible && (
            <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm rounded-full font-medium border-2 border-white -ml-3">
                +{avatars.length - maxVisible}
            </div>
        )}
    </div>
  )
}

export default AvatarGroup