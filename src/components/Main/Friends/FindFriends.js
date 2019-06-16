import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  makeFriendRequest,
  findPerson,
  confirmFriendRequest,
  rejectFriendRequest,
  cancelOutgoingRequest,
} from '../../../store/actions/friendsActions'
import ScrollContainer from '../Elements/ScrollContainer'
import CardListItemConfirm from '../Elements/CardListItemConfirm'
import CardItemInnertext from '../Elements/CardItemInnertext'

let searchTimeout

// needs to be class component to have ref on input node
class FindFriends extends Component {
  state = {
    showConfirmPerson: {},
    enableSearch: true,
    searchResults: [],
    madeRequestEmails: [],
    receivedRequestEmails: [],

    madeRequestIds: [],
    receivedRequestIds: [],
  }

  search = async () => {
    const { currentEmail, findPerson } = this.props

    if (this.searchInput.value.length > 1 && !!this.state.enableSearch) {
      await this.setState({ enableSearch: false })
      searchTimeout = setTimeout(async () => {
        const results = await findPerson(
          this.searchInput.value,
          currentEmail,
          this.props.friends
        )
        await this.setState({
          showConfirmPerson: {},
          searchResults: results,
          enableSearch: true,
        })
      }, 800)
    }
    if (!this.searchInput.value.length) {
      clearTimeout(searchTimeout)
      await this.setState({
        showConfirmPerson: {},
        searchResults: [],
        enableSearch: true,
      })
      return
    }
  }

  handleAdd = async person => {
    const { makeFriendRequest, currentUID } = this.props
    await makeFriendRequest(person.id, currentUID)

    await this.setState({
      showConfirmPerson: {},
      madeRequestIds: [...this.state.madeRequestIds, person.id],
    })
  }

  showConfirmAddPerson = async person => {
    await this.setState({
      showConfirmPerson: person,
    })
  }

  clearConfirmPerson = async () => {
    await this.setState({
      showConfirmPerson: {},
    })
  }

  cancelRequest = async person => {
    const { cancelOutgoingRequest, currentUID } = this.props
    await cancelOutgoingRequest(person.id, currentUID)

    await this.setState({
      madeRequestIds: this.state.madeRequestIds.filter(id => id !== person.id),
    })
  }

  handleIncomingRequest = async (person, accept) => {
    if (accept) {
      const { confirmFriendRequest, currentUID } = this.props
      await confirmFriendRequest(person.id, currentUID)
      this.search()
    } else {
      const { rejectFriendRequest, currentUID } = this.props
      await rejectFriendRequest(person.id, currentUID)
    }

    await this.setState({
      receivedRequestEmails: this.state.receivedRequestEmails.filter(
        id => id !== person.id
      ),
    })
  }

  mapPendingIds = async () => {
    await this.setState({
      madeRequestIds: this.props.pending.madeRequest.map(ref => ref.id),
      receivedRequestIds: this.props.pending.receivedRequest.map(ref => ref.id),
    })
  }

  componentDidUpdate = async prevProps => {
    if (prevProps.pending !== this.props.pending) {
      // console.log('findfriends componentdidupdate')

      // Object.entries(this.props).forEach(
      //   ([key, val]) =>
      //     prevProps[key] !== val &&
      //     console.log(`findfriends Prop '${key}' changed`)
      // )
      await this.mapPendingIds()
    }
    if (prevProps.friends.length !== this.props.friends.length) {
      this.search()
    }
  }

  componentDidMount = async () => {
    await this.mapPendingIds()
  }

  componentWillUnmount = () => {
    clearTimeout(searchTimeout)
  }

  render() {
    const {
      searchResults,
      showConfirmPerson,
      madeRequestIds,
      receivedRequestIds,
    } = this.state

    // const {
    //   loading,
    // } = this.props

    return (
      <div id='friends-add'>
        <br />
        {/* <div>{loading ? 'Loading...' : 'Search for friends:'}</div> */}
        <div>Search for friends:</div>
        <br />
        <div className='search-div'>
          <img src='./images/search.svg' className='icon grey' />
          <input
            className='textarea-only'
            placeholder='Name or email...'
            type='text'
            onChange={this.search}
            autoCapitalize='off'
            autoComplete='off'
            ref={node => {
              this.searchInput = node
            }}
          />
        </div>
        <ScrollContainer showButtons={true}>
          {searchResults[0]
            ? searchResults.map(person => {
                if (madeRequestIds.includes(person.id)) {
                  return (
                    <CardItemInnertext
                      key={person.id}
                      message1={`${person.displayName}:`}
                      message2='Request sent'
                      leftIcon='/images/restore.svg'
                      leftTitle='Cancel Request'
                      leftAction={() => this.cancelRequest(person)}
                    />
                  )
                }
                if (receivedRequestIds.includes(person.id)) {
                  return (
                    <CardItemInnertext
                      key={person.id}
                      message1={`${person.displayName}:`}
                      message2='Accept request?'
                      leftIcon='/images/remove.svg'
                      leftTitle='Reject Request'
                      leftAction={() => this.handleIncomingRequest(person)}
                      rightIcon='/images/check.svg'
                      rightTitle='Accept Request'
                      rightAction={() => this.handleIncomingRequest(person, 1)}
                    />
                  )
                } else {
                  return (
                    <CardListItemConfirm
                      key={person.id}
                      item={person}
                      showConfirm={
                        showConfirmPerson.id === person.id ? true : false
                      }
                      onClick={() => this.showConfirmAddPerson(person)}
                      leftAction={this.clearConfirmPerson}
                      rightAction={() => this.handleAdd(person)}
                    />
                  )
                }
              })
            : null}
        </ScrollContainer>
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  currentEmail: state.firebase.auth.email,
  friends: state.friends.friends,
  loading: state.friends.loading,
  pending: state.firebase.profile.pending.friends,
})

const mapDispatch = dispatch => ({
  confirmFriendRequest: (friendId, currentUID) =>
    dispatch(confirmFriendRequest(friendId, currentUID)),
  rejectFriendRequest: (friendId, currentUID) =>
    dispatch(rejectFriendRequest(friendId, currentUID)),
  makeFriendRequest: (friendId, uid) =>
    dispatch(makeFriendRequest(friendId, uid)),
  findPerson: (input, email, friends) =>
    dispatch(findPerson(input, email, friends)),
  cancelOutgoingRequest: (friendId, currentUID) =>
    dispatch(cancelOutgoingRequest(friendId, currentUID)),
})

export default connect(
  mapState,
  mapDispatch
)(FindFriends)
