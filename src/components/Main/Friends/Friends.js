import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchFriends,
  addFriend,
  findPerson,
} from '../../../store/actions/friendsActions'
import FriendsList from './FriendsList'
import FindFriends from './FindFriends'

class Friends extends Component {
  state = {
    view: 'friends',
  }

  switchView = view => {
    this.setState({ view })
  }

  componentDidMount = async () => {
    await this.props.fetchFriends(this.props.currentUID)
  }

  render() {
    const {
      friends,
      addFriend,
      findPerson,
      currentEmail,
      currentUID,
      fetchFriends,
      loading,
      searchResults,
    } = this.props
    const { view } = this.state

    return (
      <div id='friends'>
        <div className='views'>
          <div
            className={
              view === 'friends' ? 'button-icon selected' : 'button-icon'
            }>
            <img
              src='./images/people.svg'
              className='icon large'
              onClick={() => {
                fetchFriends(currentUID)
                this.switchView('friends')
              }}
            />
          </div>
          <div
            className={
              view === 'search' ? 'button-icon selected' : 'button-icon'
            }>
            <img
              src='./images/search.svg'
              className='icon large'
              onClick={() => this.switchView('search')}
            />
          </div>
        </div>
        <hr />
        <br />
        {view === 'search' && (
          <FindFriends
            friends={friends}
            addFriend={addFriend}
            findPerson={findPerson}
            fetchFriends={fetchFriends}
            currentUID={currentUID}
            currentEmail={currentEmail}
            loading={loading}
            searchResults={searchResults}
          />
        )}
        {view === 'friends' && (
          <FriendsList friends={friends} fetchFriends={fetchFriends} />
        )}
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  currentEmail: state.firebase.auth.email,
  searchResults: state.friends.searchResults,
  selected: state.friends.selected,
  error: state.friends.error,
  friends: state.friends.friends,
  loading: state.friends.loading,
})

const mapDispatch = dispatch => ({
  fetchFriends: uid => dispatch(fetchFriends(uid)),
  addFriend: (email, uid) => dispatch(addFriend(email, uid)),
  findPerson: (input, email, friends) =>
    dispatch(findPerson(input, email, friends)),
})

export default connect(
  mapState,
  mapDispatch
)(Friends)
