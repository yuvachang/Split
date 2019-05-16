import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  addFriendEmail,
  findFriendThunk,
} from '../../../store/actions/friendsActions'

class AddFriend extends Component {

  search = (input) => {
    if (input.includes(' ')){
      this.props.findFriendThunk( null, input) 
    }
    if (input.includes('@')) {
      this.props.findFriendThunk( input ) 
    } 
  }


  render() {
    const {
      selected,
      searchResults,
      addFriendEmail,
      currentUID,
      findFriendThunk,
    } = this.props

    return (
      <div id='friends-add'>
        {/* Find Friend by Email */}
        {/* <div>
          <input
            type='email'
            placeholder='search by email'
            ref={node => {
              this.searchInput = node
            }}
          />
          <button onClick={() => search(this.searchInput.value)}>
            Submit
          </button>
        </div> */}
        Find Friend by Name
        <div>
          <input
            type='email'
            placeholder='search by name'
            ref={node => {
              this.searchInput = node
            }}
            onChange={() => this.search(this.searchInput.value)}
          />
          <button onClick={() => this.search(this.searchInput.value)}>
            Submit
          </button>
        </div>

        {searchResults.map(person => {
          return <div> {person.displayName} </div>
        })}
        {/* <button onClick={()=>addFriendEmail({email:'null', uid: currentUID})}>add friend</button> */}
        {/* <button onClick={()=>findFriendThunk({email: 'bb@email.com', tel: null})}>bob</button> */}
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  searchResults: state.friends.searchResults,
  selected: state.friends.selected,
  error: state.friends.error,
})

const mapDispatch = dispatch => ({
  addFriendEmail: data => dispatch(addFriendEmail(data)),
  findFriendThunk: data => dispatch(findFriendThunk(data)),
})

export default connect(
  mapState,
  mapDispatch
)(AddFriend)
