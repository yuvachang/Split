import React from 'react'

const RowDeleted = ({
  row,
  error,
  clickAction,
  leftIcon,
  rightIcon,
  leftAction,
  rightAction,
}) => (
  <div
    className='row-item'
    onClick={clickAction ? () => clickAction(row) : null}>
    {leftIcon && (
      <img
        src={leftIcon}
        className='icon left'
        onClick={leftAction ? leftAction : () => null}
      />
    )}
    <div
      className='innertext'
      style={{ fontWeight: 'lighter', display: 'inline' }}>
      {row.item ? row.item : 'Item'} || {row.cost ? row.cost : 'Cost'}
    </div>
    {rightIcon && (
      <img
        src={rightIcon}
        className='icon right'
        onClick={rightAction ? rightAction : () => null}
      />
    )}
  </div>
)

export default RowDeleted
