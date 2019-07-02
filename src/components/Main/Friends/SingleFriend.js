import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '../Elements/Modal'
import ScrollContainer from '../Elements/ScrollContainer'
import { getUserStats } from '../../../store/actions/receiptsActions'

class SingleFriend extends Component {
  state = {
    displayModal: false,
  }

  openModal = async () => {
    await this.setState({ displayModal: true })
  }

  closeModal = async () => {
    await this.setState({ displayModal: false, person: {} })
  }

  componentDidMount = async () => {
    await this.props.getUserStats(this.props.friend.id)
  }

  render() {
    const { friend, removeFriend, backToList } = this.props
    const { displayModal } = this.state
    console.log(this.props.stats)
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

        {friend.avatarUrl && (
          <img
            alt='icon'
            src={friend.avatarUrl}
            className='icon large'
            style={{ filter: 'invert(0)', borderRadius: '50%' }}
          />
        )}
        <h3>{friend.displayName}</h3>

        <br />
        <div style={{ textAlign: 'left' }}>
          Total spendings: ${this.props.stats.totalSpending || 0}
          <br />
          <br />
        </div>
        <br />
        <div
          onClick={this.openModal}
          style={{ color: '#7f7f7f', margin: '6px 0' }}
          className='alink small'>
          Unfriend {friend.displayName}
        </div>
      </ScrollContainer>
    )
  }
}

const mapState = state => ({
  stats: state.receipts.stats,
})

const mapDispatch = dispatch => ({
  getUserStats: uid => dispatch(getUserStats(uid)),
})

export default connect(
  mapState,
  mapDispatch
)(SingleFriend)
