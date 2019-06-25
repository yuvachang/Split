import React from 'react'

const AddedUser = ({ user, removeUser }) => {
  return (
    <div className='user-row-container'>
      <div className='added-user-row'>{user.displayName || user.name}</div>

      <div className='round-icon-button red' onClick={() => removeUser(user)}>
        <img src='/images/remove.svg' className='icon' />
      </div>
    </div>
  )
}

export default AddedUser
