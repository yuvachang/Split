import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchPending,
  dismissConfirm,
  confirmFriendRequest,
  rejectFriendRequest,
  cancelOutgoingRequest,
} from '../../../store/actions/friendsActions'
import ScrollContainer from '../Elements/ScrollContainer'
import CardItemInnertext from '../Elements/CardItemInnertext'

class FriendsPending extends Component {
  componentDidUpdate = async prevProps => {
    if (prevProps.profilePending !== this.props.profilePending) {
      await this.props.fetchPending(this.props.currentUID)
    }
  }

  componentDidMount = async () => {
    console.log(this.props.profilePending)
    if (
      this.props.profilePending.confirmed[0] ||
      this.props.profilePending.madeRequest[0] ||
      this.props.profilePending.receivedRequest[0]
    ) {
      await this.props.fetchPending(this.props.currentUID)
    }
  }

  render() {
    const {
      pendingFriends,
      currentUID,
      dismissConfirm,
      confirmFriendRequest,
      rejectFriendRequest,
      cancelOutgoingRequest,
    } = this.props
    const nothingNew =
      !pendingFriends.receivedRequest[0] &&
      !pendingFriends.madeRequest[0] &&
      !pendingFriends.confirmed[0]

    return (
      <ScrollContainer>
        <div className='friends-pending'>
          {pendingFriends.receivedRequest[0] ? (
            <div className='pending-section'>
              Received Requests:
              {pendingFriends.receivedRequest.map(user => (
                <CardItemInnertext
                  key={user.id}
                  message1={`${user.displayName}:`}
                  message2='Accept request?'
                  leftIcon='/images/remove.svg'
                  leftTitle='Reject Request'
                  leftAction={() => rejectFriendRequest(user.id, currentUID)}
                  rightIcon='/images/check.svg'
                  rightTitle='Accept Request'
                  rightAction={() => confirmFriendRequest(user.id, currentUID)}
                />
              ))}
            </div>
          ) : null}

          <br />

          {pendingFriends.madeRequest[0] ? (
            <div className='pending-section'>
              Awaiting Confirmation:
              {pendingFriends.madeRequest.map(user => (
                <CardItemInnertext
                  key={user.id}
                  message1={`${user.displayName}:`}
                  message2='Request sent'
                  leftIcon='/images/restore.svg'
                  leftTitle='Cancel Request'
                  leftAction={() => cancelOutgoingRequest(user.id, currentUID)}
                />
              ))}
            </div>
          ) : null}

          <br />

          {pendingFriends.confirmed[0] ? (
            <div className='pending-section'>
              Confirmed Friendships:
              {pendingFriends.confirmed.map(user => (
                <CardItemInnertext
                  key={user.id}
                  message1={`${user.displayName}`}
                  message2='is now your friend!'
                  rightIcon='/images/check.svg'
                  rightTitle='Clear notification'
                  rightAction={() => dismissConfirm(user.id, currentUID)}
                />
              ))}
            </div>
          ) : null}

          {!!nothingNew && <h3>Nothing new.</h3>}
        </div>
      </ScrollContainer>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  profilePending: state.firebase.profile.pending.friends,
  pendingFriends: state.friends.pending,
})

const mapDispatch = dispatch => ({
  fetchPending: currentUID => dispatch(fetchPending(currentUID)),
  confirmFriendRequest: (friendId, currentUID) =>
    dispatch(confirmFriendRequest(friendId, currentUID)),
  rejectFriendRequest: (friendId, currentUID) =>
    dispatch(rejectFriendRequest(friendId, currentUID)),
  dismissConfirm: (friendId, currentUID) =>
    dispatch(dismissConfirm(friendId, currentUID)),
  cancelOutgoingRequest: (friendId, currentUID) =>
    dispatch(cancelOutgoingRequest(friendId, currentUID)),
})

export default connect(
  mapState,
  mapDispatch
)(FriendsPending)
