import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchFriends,
  makeFriendRequest,
  findPerson,
  removeFriend,
  fetchPending,
} from '../../../store/actions/friendsActions'
import FindFriends from './FindFriends'
import SingleFriend from './SingleFriend'
import TopMenu from '../Elements/TopMenu'
import CardList from '../Elements/CardList'

class Friends extends Component {
  state = {
    view: 'list',
    searchInput: '',
    friends: [],
    singleFriend: {},
  }

  switchView = async (view, friend) => {
    if (friend) {
      await this.setState({
        singleFriend: friend,
        view: 'singleView',
      })
    } else {
      await this.setState({ view })
    }
  }

  filterFriends = (input, friendsDataArr) =>
    friendsDataArr.filter(friend =>
      friend.displayName.toLowerCase().includes(input.toLowerCase())
    )

  search = async e => {
    if (e.target.value.length > 0) {
      const results = this.filterFriends(e.target.value, this.props.friends)
      await this.setState({ friends: results, searchInput: e.target.value })
    } else {
      await this.setState({ friends: this.props.friends, searchInput: '' })
    }
  }

  componentDidUpdate = async prevProps => {
    if (prevProps.fbfriends !== this.props.fbfriends) {
      // console.log('friends componentdidupdate: fetch friends')
      await this.props.fetchFriends(this.props.currentUID)
      await this.setState({
        friends: this.props.friends,
      })
    }
    // Object.entries(this.props).forEach(
    //   ([key, val]) =>
    //     prevProps[key] !== val && console.log(`Prop '${key}' changed`)
    // )
  }

  componentDidMount = async () => {
    await this.props.fetchFriends(this.props.currentUID)
    await this.props.fetchPending(this.props.currentUID)

    await this.setState({
      friends: this.props.friends,
    })
  }

  render() {
    const { currentUID, removeFriend } = this.props
    const { view, singleFriend, friends, searchInput } = this.state

    return (
      <div id='friends'>
        <TopMenu
          view={view}
          searchPlaceholder='Find existing friend...'
          search={this.search}
          b1Src='/images/list.svg'
          b1Click={() => this.switchView('list')}
          b2Src='/images/add.svg'
          b2Click={() => this.switchView('add')}
        />

        {view === 'list' && (
          <div>
            <br />
            {searchInput ? `Searching for '${searchInput}':` : 'Your friends:'}
          </div>
        )}

        {view === 'list' &&
          (friends[0] ? (
            <CardList list={friends} onClick={this.switchView} />
          ) : (
            'Nobody here...'
          ))}

        {view === 'add' && <FindFriends />}

        {/* {view === 'notif' && <FriendsPending />} */}

        {view === 'singleView' && (
          <div id='groups-list'>
            <SingleFriend
              backToList={() => this.switchView('list')}
              friend={singleFriend}
              removeFriend={() => removeFriend(singleFriend.email, currentUID)}
            />
          </div>
        )}
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  friends: state.friends.friends,
  receivedRequest: state.firebase.profile.pending.friends.receivedRequest,

  pending: state.firebase.profile.pending.friends,
  fbfriends: state.firebase.profile.friends,
})

const mapDispatch = dispatch => ({
  fetchFriends: uid => dispatch(fetchFriends(uid)),
  makeFriendRequest: (email, uid) => dispatch(makeFriendRequest(email, uid)),
  findPerson: (input, email, friends) =>
    dispatch(findPerson(input, email, friends)),
  removeFriend: (email, uid) => dispatch(removeFriend(email, uid)),
  fetchPending: currentUID => dispatch(fetchPending(currentUID)),
})

export default connect(
  mapState,
  mapDispatch
)(Friends)
