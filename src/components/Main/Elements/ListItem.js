import React from 'react'

const ListItem = ({
  content,
  error,
  clickAction,
  leftIcon,
  rightIcon,
  success,
}) =>
  error ? (
    <div className='button error-msg'>{content.error}</div>
  ) : (
    <div
      className={success ? 'button success' : 'button'}
      onClick={() => clickAction(content)}>
      {leftIcon && <img src={leftIcon} className='icon left' />}
      {content.displayName || content.groupName}
      {rightIcon && <img src={rightIcon} className='icon right' />}
    </div>
  )

export default ListItem
