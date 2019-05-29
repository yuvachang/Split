import React from 'react'

const RowItem = ({ row, startEdit, rowIdx }) => (
  <div className={row.isEdit ? 'grid-container isEdit' : 'grid-container'}>
    <div className='editbutton'>
      {row.edit ? (
        row.edit
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
      ) : (
        <ul className='comma-list'>
          {row.users.map(user => (
            <li>{user.displayName}</li>
          ))}
        </ul>
      )}
    </div>
    <div className='deletebutton'>
      {row.delete ? (
        row.delete
      ) : (
        <img src='/images/trash.svg' className='icon' />
      )}
    </div>
  </div>
)

export default RowItem
