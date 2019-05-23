import React from 'react'

const ListItem = ({
  content,
  error,
  clickAction,
  leftIcon,
  rightIcon,
  success,
  leftAction,
  rightAction,
}) =>
  error ? (
    <div className='button error-msg'>{content.error}</div>
  ) : clickAction ? (
    <div
      className={success ? 'button success' : 'button'}
      onClick={() => clickAction(content)}>
      {leftIcon && (
        <img
          src={leftIcon}
          className='icon left'
          onClick={leftAction ? leftAction : () => null}
        />
      )}
      <div className='innertext'>
        {content.displayName || content.groupName}
      </div>
      {rightIcon && (
        <img
          src={rightIcon}
          className='icon right'
          onClick={rightAction ? rightAction : () => null}
        />
      )}
    </div>
  ) : (
    <div className={success ? 'button success' : 'button'}>
      {leftIcon && (
        <img
          src={leftIcon}
          className='icon left'
          onClick={leftAction ? leftAction : () => null}
        />
      )}
      <div className='innertext'>
        {content.displayName || content.groupName}
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

export default ListItem
