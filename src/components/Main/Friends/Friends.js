import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchFriends,
  addFriend,
  findPerson,
  removeFriend,
} from '../../../store/actions/friendsActions'
import FindFriends from './FindFriends'
import ListPage from '../Elements/ListPage'
import SingleFriend from './SingleFriend'

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
      addFriend,
      findPerson,
      currentEmail,
      currentUID,
      fetchFriends,
      loading,
      searchResults,
      removeFriend,
    } = this.props
    const { view, singleFriend } = this.state

    return (
      <div id='friends'>
        <div className='views'>
          <div
            className={
              view === 'list' ? 'button-icon selected' : 'button-icon'
            }>
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
  error: state.friends.error,
  friends: state.friends.friends,
  loading: state.friends.loading,
})

const mapDispatch = dispatch => ({
  fetchFriends: uid => dispatch(fetchFriends(uid)),
  addFriend: (email, uid) => dispatch(addFriend(email, uid)),
  findPerson: (input, email, friends) =>
    dispatch(findPerson(input, email, friends)),
  removeFriend: (email, uid) => dispatch(removeFriend(email, uid)),
})

export default connect(
  mapState,
  mapDispatch
)(Friends)
