import React from 'react'

const CardItemInnertext = ({
  message1,
  message2,
  onClick,
  leftIcon,
  leftTitle,
  leftAction,
  rightIcon,
  rightTitle,
  rightAction,
}) => (
  <div className='button card blue' onClick={onClick ? onClick : null}>
    {leftIcon && (
      <img
        src={leftIcon}
        title={leftTitle ? leftTitle : ''}
        className='icon left'
        onClick={leftAction ? leftAction : () => null}
      />
    )}
    <div className='innertext small'>
      {message1 && <div>{message1}</div>}
      {message2 && <div>{message2}</div>}
    </div>
    {rightIcon && (
      <img
        src={rightIcon}
        title={rightTitle ? rightTitle : ''}
        className='icon right'
        onClick={rightAction ? rightAction : null}
      />
    )}
  </div>
)

export default CardItemInnertext
