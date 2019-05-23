import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchPending,
  dismissConfirm,
  confirmFriendRequest,
  rejectFriendRequest,
  cancelOutgoingRequest,
} from '../../../store/actions/friendsActions'
import ListItem from '../Elements/ListItem'
import FadingScroll from '../Elements/FadingScroll'

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
      <FadingScroll>
        <div className='friends-pending'>
          {pendingFriends.receivedRequest[0] ? (
            <div>
              Received Requests:
              {pendingFriends.receivedRequest.map(user => (
                <ListItem
                  key={user.email}
                  success={true}
                  content={user}
                  leftAction={() => rejectFriendRequest(user.id, currentUID)}
                  leftIcon='./images/remove.svg'
                  rightAction={() => confirmFriendRequest(user.id, currentUID)}
                  rightIcon='./images/check.svg'
                />
              ))}
            </div>
          ) : null}

          {pendingFriends.madeRequest[0] ? (
            <div>
              Awaiting Confirmation:
              {pendingFriends.madeRequest.map(user => (
                <ListItem
                  key={user.email}
                  success={true}
                  content={user}
                  rightAction={() => cancelOutgoingRequest(user.id, currentUID)}
                  rightIcon='./images/trash.svg'
                />
              ))}
            </div>
          ) : null}

          {pendingFriends.confirmed[0] ? (
            <div>
              Confirmed Friendships:
              {pendingFriends.confirmed.map(user => (
                <ListItem
                  key={user.email}
                  success={true}
                  content={user}
                  clickAction={() => null}
                  rightAction={() => dismissConfirm(user.id, currentUID)}
                  rightIcon='./images/check.svg'
                />
              ))}
            </div>
          ) : null}

          {!!nothingNew && <h3>Nothing new.</h3>}
        </div>
      </FadingScroll>
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
