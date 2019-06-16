import React, { Component } from 'react'
import Modal from '../Elements/Modal'
import ScrollContainer from '../Elements/ScrollContainer'

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
      <ScrollContainer>
        <Modal
          display={displayModal}
          message={`Remove ${friend.displayName} from friends?`}
          yesAction={async () => {
            await removeFriend()
            this.closeModal()
            backToList()
          }}
          noAction={this.closeModal}
        />

        <div className='profile'>
          <img
            src={friend.avatarUrl ? friend.avatarUrl : './images/person.svg'}
            className='icon large'
            style={{filter: 'invert(0)', borderRadius: '50%'}}
          />
          <img
            src='./images/down-arrow.svg'
            className={showDropdown ? 'icon upsidedown grey' : 'icon grey'}
            onClick={this.toggleDropdown}
          />
        </div>

        <div className={showDropdown ? 'profile-menu' : 'profile-menu hidden'}>
          <img
            src='./images/poke.png'
            className='icon grey'
            style={{ transform: 'rotate(90deg)' }}
          />
          <img
            src='./images/dislike.svg'
            className='icon grey'
            onClick={this.openModal}
          />
        </div>


        {friend.displayName}:
        <br />
        <br />
        <div>friend iou's here and stats here</div>
        <br />
        <div className='button card' onClick={backToList}>
          Back to list
        </div>
      </ScrollContainer>
    )
  }
}

export default SingleFriend
