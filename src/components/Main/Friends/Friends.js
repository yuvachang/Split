import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchFriends,
  makeFriendRequest,
  findPerson,
  removeFriend,
} from '../../../store/actions/friendsActions'
import FindFriends from './FindFriends'
import ListPage from '../Elements/ListPage'
import SingleFriend from './SingleFriend'
import FriendsPending from './FriendsPending'

class Friends extends Component {
  state = {
    view: 'list',
    singleFriend: {},
  }

  switchView = (view, friend) => {
    if (friend) {
      this.setState({
        singleFriend: friend,
        view: 'singleView',
      })
    } else {
      this.setState({ view })
    }
  }

  render() {
    const {
      friends,
      makeFriendRequest,
      findPerson,
      currentEmail,
      currentUID,
      fetchFriends,
      loading,
      searchResults,
      removeFriend,
      receivedRequest,
    } = this.props
    const { view, singleFriend } = this.state

    return (
      <div id='friends'>
        <div className='menu'>


          <div className='search-div'>
            {/* <label>Last Name:</label> */}
            <img src='./images/search.svg' className='icon' />
            <input
              placeholder='Search your friends...'
              type='text'
              name='lastName'
              // value={lastName}
              // onChange={handleChange}
              // required={authType === 'signup' ? true : false}
            />
          </div>

          
        </div>

        {view === 'search' && (
          <FindFriends
            friends={friends}
            makeFriendRequest={makeFriendRequest}
            findPerson={findPerson}
            fetchFriends={fetchFriends}
            currentUID={currentUID}
            currentEmail={currentEmail}
            loading={loading}
            searchResults={searchResults}
          />
        )}

        {view === 'notifs' && <FriendsPending />}

        {view === 'list' && (
          <ListPage
            friends={friends}
            fetchFriends={() => fetchFriends(currentUID)}
            viewItem={this.switchView}
          />
        )}

        {view === 'singleView' && (
          <div id='groups-list'>
            <SingleFriend
              backToList={() => this.switchView('list')}
              friend={singleFriend}
              removeFriend={() => removeFriend(singleFriend.email, currentUID)}
              loading={loading}
            />
          </div>
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
  friends: state.friends.friends,
  loading: state.friends.loading,
  receivedRequest: state.firebase.profile.pending.friends.receivedRequest,
})

const mapDispatch = dispatch => ({
  fetchFriends: uid => dispatch(fetchFriends(uid)),
  makeFriendRequest: (email, uid) => dispatch(makeFriendRequest(email, uid)),
  findPerson: (input, email, friends) =>
    dispatch(findPerson(input, email, friends)),
  removeFriend: (email, uid) => dispatch(removeFriend(email, uid)),
})

export default connect(
  mapState,
  mapDispatch
)(Friends)


{/* <div className={view === 'list' ? 'icon selected' : 'icon'}>
            <img
              src='./images/people.svg'
              className='icon large'
              onClick={() => {
                this.switchView('list')
              }}
            />
          </div>

          <div
            className={
              view === 'notifs'
                ? receivedRequest[0]
                  ? 'button-icon notify selected'
                  : 'button-icon selected'
                : receivedRequest[0]
                ? 'button-icon notify'
                : 'button-icon'
            }>
            <img
              src='./images/bell.svg'
              className='icon large'
              onClick={() => this.switchView('notifs')}
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
          </div> */}