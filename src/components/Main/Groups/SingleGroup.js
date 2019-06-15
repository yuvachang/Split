import React, { Component } from 'react'
import Modal from '../Elements/Modal'
import ScrollContainer from '../Elements/ScrollContainer'

class SingleGroup extends Component {
  state = {
    displayModal: false,
    showDropdown: false,
  }

  openModal = async () => {
    await this.setState({ displayModal: true })
  }

  closeModal = async () => {
    await this.setState({ displayModal: false, group: {} })
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  render() {
    const { group, deleteGroup, backToList, loading } = this.props
    const { displayModal, showDropdown } = this.state
    return (
      <ScrollContainer>
        <Modal
          display={displayModal}
          header='Delete Group'
          message={`Delete ${group.groupName} forever?`}
          yesMsg={'Yes'}
          yesAction={async () => {
            await deleteGroup(group.id)
            this.closeModal()
            backToList()
          }}
          noMsg={'No'}
          noAction={this.closeModal}
        />

        {/* <img
          src='./images/down-arrow.svg'
          className={`icon grey ${showDropdown && 'upsidedown'}`}
          onClick={this.toggleDropdown}
        />
        <div className={showDropdown ? 'profile-menu' : 'profile-menu hidden'}>
          <img
            src='./images/trash.svg'
            className='icon grey'
            onClick={this.openModal}
          />
        </div> */}

        <div>
          <h3>{group.groupName}:</h3>

          <div>
            group receipts
            <br />
            group spendings
          </div>
          <br />
          <div>Group members:</div>
          <ul className='comma-list'>
            {group.members[0]
              ? group.members.map(member => <li key={member.id}>{member.displayName}</li>)
              : null}
          </ul>
        </div>

        <div className='button card' onClick={backToList}>
          Back to list
        </div>
        <div className='button card' onClick={this.toggleDropdown}>
          {showDropdown ? 'Cancel' : 'Delete group'}
        </div>
        <button
          className={`card red ${!showDropdown && 'collapsed'}`}
          onClick={async () => {
            await deleteGroup(group.id)
            this.closeModal()
            backToList()
          }}>
          Delete group forever
        </button>
      </ScrollContainer>
    )
  }
}

export default SingleGroup
