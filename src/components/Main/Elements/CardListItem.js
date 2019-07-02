import React from 'react'

const CardListItem = ({
  item,
  onClick,
  leftIcon,
  leftAction,
  rightIcon,
  rightAction,
}) => (
  <div
    className='button card'
    onClick={onClick ? (item.error ? null : onClick) : null}>
    {leftIcon && (
      <img
        alt='icon'
        src={leftIcon}
        className='icon left'
        onClick={leftAction ? leftAction : () => null}
      />
    )}
    <div className='innertext bold'>
      {item.error
        ? item.error
        : item.displayName || item.groupName || item.receiptName}
    </div>
    {rightIcon && (
      <img
        alt='icon'
        src={rightIcon}
        className='icon right'
        onClick={rightAction ? rightAction : null}
      />
    )}
  </div>
)

export default CardListItem
