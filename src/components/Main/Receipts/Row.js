import React from 'react'

const Row = ({ row, startEdit, rowIdx, deleted, undelete, deleteRow }) => (
  <tr className={deleted ? 'deleted-row' : ''}>
    <td className='editbutton'>
      {row.edit ? (
        row.edit
      ) : deleted ? (
        <img
          src='/images/trash.svg'
          className='icon'
          onClick={() => deleteRow(rowIdx)}
        />
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
      {deleted ? (
        <img
          src='/images/restore.svg'
          className='icon'
          onClick={undelete ? undelete : null}
        />
      ) : null}
    </td>
  </tr>
)

export default Row
