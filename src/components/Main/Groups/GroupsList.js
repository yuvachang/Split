import React, { Component } from 'react'
import Modal from '../Elements/Modal'

class GroupsList extends Component {
  state = {
    displayModal: false,
  }

  closeModal = async () => {
    await this.setState({ displayModal: false, person: {} })
  }

  render() {
    const { groups, fetchGroups } = this.props
    const { displayModal } = this.state
    return (
      <div id='groups-list'>
        <Modal
          display={displayModal}
          header='Confirm Add Friend'
          message={'friend details here'}
          yes='Yes'
          yesAction={async () => {}}
          cancel={this.closeModal}
        />
        <div>Your groups:</div>
        {groups[0] ? (
          <ul>
            {groups.map(friend => {
              return (
                <li className='button' key={friend.email}>
                  {friend.avatarURL ? (
                    <img src={friend.avatarURL} className='icon left' />
                  ) : (
                    <img src='./images/person.svg' className='icon left' />
                  )}
                  {friend.displayName}
                </li>
              )
            })}
          </ul>
        ) : (
          <ul>
            <li className='button error-msg'>
              You have no groups.
            </li>
          </ul>
        )}
      </div>
    )
  }
}

export default GroupsList
