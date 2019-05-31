import React from 'react'

const RowItem = ({ row, startEdit, rowIdx }) => (
  <div className='grid-container'>
    <div className='editbutton'>
      {row.edit ? (
        row.edit
      ) : row.isEdit ? (
        <img src='/images/pulse.svg' className='icon' />
      ) : (
        <img
          src='/images/edit.svg'
          className='icon'
          onClick={() => startEdit(rowIdx)}
        />
      )}
    </div>
    <div className='item'>{row.item}</div>
    <div className='cost'>{row.cost}</div>
    <div className='users'>
      {!Array.isArray(row.users) ? (
        row.users
      ) : row.users[0] ? (
        <ul className='comma-list'>
          {row.users.map(user => (
            <li>{user.name}</li>
          ))}
        </ul>
      ): ('No one yet.')}
    </div>
    <div className='deletebutton'>
      {/* {row.delete ? (
        row.delete
      ) : (
        <img src='/images/trash.svg' className='icon' />
      )} */}
    </div>
  </div>
)

export default RowItem
