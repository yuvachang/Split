import React from 'react'

const CardListItem = ({
  item,
  onClick,
  leftIcon,
  leftAction,
  rightIcon,
  rightAction,
}) => (
  <div className='button card' onClick={onClick}>
    {leftIcon && (
      <img
        src={leftIcon}
        className='icon left'
        onClick={leftAction ? leftAction : () => null}
      />
    )}
    <div className='innertext'>
      {item.displayName || item.groupName || item.receiptName}
    </div>
    {rightIcon && (
      <img
        src={rightIcon}
        className='icon right'
        onClick={rightAction ? rightAction : null}
      />
    )}
  </div>
)

export default CardListItem
