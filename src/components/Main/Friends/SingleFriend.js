import React, { Component } from 'react'
import Modal from '../Elements/Modal'

class SingleFriend extends Component {
  state = {
    displayModal: false,
    showDropdown: false,
  }

  openModal = async () => {
    await this.setState({ displayModal: true })
  }

  closeModal = async () => {
    await this.setState({ displayModal: false, person: {} })
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  render() {
    const { friend, removeFriend, backToList, loading } = this.props
    const { displayModal, showDropdown } = this.state
    return (
      <div>
        <Modal
          display={displayModal}
          header='Unfriend'
          message={`Remove ${friend.displayName} from friends?`}
          yesMsg={'Yes'}
          yesAction={async () => {
            await removeFriend()
            this.closeModal()
            backToList()
          }}
          noMsg={'No'}
          noAction={this.closeModal}
        />
        {loading && <h3>Deleting...</h3>}
        <div className='profile'>
          <img
            src={friend.avatarUrl ? friend.avatarUrl : './images/person.svg'}
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
        {friend.displayName}:
        <br />
        <br />
        <div>friend iou's here and stats here</div>
        <br />
        <div className='button' onClick={backToList}>
          Back to list
        </div>
      </div>
    )
  }
}

export default SingleFriend
