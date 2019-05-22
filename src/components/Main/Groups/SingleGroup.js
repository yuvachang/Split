import React, { Component } from 'react'
import Modal from '../Elements/Modal'
import ListItem from '../Elements/ListItem'

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
      <div className='scroll-div'>
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

        {loading && <h3>Deleting...</h3>}
        <div className='profile'>
          <img
            src={group.avatarURL ? group.avatarURL : './images/people.svg'}
            className='icon large'
          />
          <img
            src='./images/down-arrow.svg'
            className={showDropdown ? 'icon upsidedown' : 'icon'}
            onClick={this.toggleDropdown}
          />
        </div>
        <div className={showDropdown ? 'profile-menu' : 'profile-menu hidden'}>
          <img
            src='./images/poke.png'
            className='icon'
            style={{ transform: 'rotate(90deg)' }}
          />
          <img
            src='./images/dislike.svg'
            className='icon'
            onClick={this.openModal}
          />
        </div>
        <div>
          <h3>{group.groupName}:</h3>

          <div>group receipts, group spendings</div>
          <br />
          <div>Group members:</div>
          <div>
            {/* {group.members[0]
              ? group.members.map(member => (
                  <ListItem
                    key={member.email}
                    success={true}
                    content={member}
                    clickAction={() => null}
                    leftIcon={
                      member.avatarURL
                        ? member.avatarURL
                        : './images/person.svg'
                    }
                    rightIcon='./images/remove.svg'
                  />
                ))
              : null} */}

            {group.members[0]
              ? group.members.map(member => <route>{member.displayName}</p>)
              : null}
          </div>
        </div>
        <br />
        <div className='button' onClick={backToList}>
          Back to list
        </div>
      </div>
    )
  }
}

export default SingleGroup
