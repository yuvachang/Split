import React from 'react'

const Row = ({ row, startEdit, rowIdx }) => (
  <tr>
    <td className='editbutton'>
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
    </td>
    <td className='item'>{row.item}</td>
    <td className='cost'>{row.cost}</td>
    <td className='users'>
      {!Array.isArray(row.users) ? (
        row.users
      ) : row.users[0] ? (
        <ul className='comma-list'>
          {row.users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      ) : (
        'No one yet.'
      )}
    </td>
    <td className='deletebutton'>
      {/* {row.delete ? (
        row.delete
      ) : (
        <img src='/images/trash.svg' className='icon' />
      )} */}
    </td>
  </tr>
)

export default Row
