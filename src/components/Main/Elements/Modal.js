import React from 'react'

const Modal = ({ display, header, message, yesMsg, yesAction, noAction, noMsg }) => {
  if (display) {
    return (
      <div id='modal' onClick={noAction}>
        <div className='modal-container'>
          <div className='modal-header'>{header}</div>
          <hr />
          <div className='modal-message'>{message}</div>
          <div className='modal-buttons'>
            {yesMsg && (
              <div className='button' onClick={yesAction}>
                {yesMsg}
              </div>
            )}
            {noMsg && (
              <div className='button cancel' onClick={noAction}>
                {noMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default Modal
