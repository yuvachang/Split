import React from 'react'

const CardItemInnertext = ({
  message,
  onClick,
  leftIcon,
  leftAction,
  rightIcon,
  rightAction,
}) => (
  <div
    className='button card blue'
    onClick={onClick ? onClick : null}>
    {leftIcon && (
      <img
        src={leftIcon}
        className='icon left'
        onClick={leftAction ? leftAction : () => null}
      />
    )}
    <div className='innertext small'>
      {message}
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

export default CardItemInnertext
