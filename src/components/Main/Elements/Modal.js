import React from 'react'

const Modal = ({ display, message, yesAction, noAction }) => {
  if (display) {
    return (
      <div id='modal' onClick={noAction}>
        <div className='modal-container'>
          <div className='modal-message'>{message}</div>
          <div className='modal-buttons'>
            <div className='button card short grey-hover' onClick={noAction}>
              No
            </div>
            <div className='button card short red' onClick={yesAction}>
              Yes
            </div>
          </div>
        </div>
      </div>
    )
  } else {
    return null
  }
}

export default Modal
