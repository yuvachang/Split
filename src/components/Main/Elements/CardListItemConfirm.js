import React from 'react'

const CardListItemConfirm = ({
  item,
  onClick,
  showConfirm,
  leftIcon,
  leftAction,
  rightAction,
}) => (
  <div
    className={`button card ${showConfirm && 'blue'} grey-hover`}
    onClick={showConfirm ? () => null : onClick}>
    {showConfirm && (
      <img
        src='/images/remove.svg'
        className='icon left'
        onClick={leftAction ? leftAction : () => null}
      />
    )}
    <div className={showConfirm ? '' : 'innertext'}>
      {showConfirm
        ? `Send friend request`
        : item.error
        ? item.error
        : item.displayName}
    </div>
    {showConfirm && (
      <img
        src='/images/check.svg'
        className='icon right'
        onClick={rightAction ? rightAction : null}
      />
    )}
  </div>
)

export default CardListItemConfirm
