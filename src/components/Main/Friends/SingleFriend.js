import React, { Component } from 'react'
import Modal from '../Elements/Modal'
import {removeFriend} from '../../../store/actions/friendsActions'
import { connect } from 'react-redux'

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
    const { friend, removeFriend, currentUID, backToList } = this.props
    const { displayModal, showDropdown } = this.state
    return (
      <div>
        <Modal
          display={displayModal}
          header='Unfriend'
          message={`Remove ${friend.displayName} from friends?`}
          yesMsg={'Yes'}
          yesAction={async () => {
            await removeFriend(friend.email, currentUID)
            this.closeModal()
            backToList()
          }}
          noMsg={'No'}
          noAction={this.closeModal}
        />
        <div className='profile'>
          <img
            src={friend.avatarURL ? friend.avatarURL : './images/person.svg'}
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
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
})

const mapDispatch = dispatch => ({
  removeFriend: (email, uid) => dispatch(removeFriend(email, uid))
})

export default connect(mapState, mapDispatch)(SingleFriend)
