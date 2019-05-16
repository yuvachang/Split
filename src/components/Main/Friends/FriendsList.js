import React from 'react'
import {connect} from 'react-redux'
import { logoutThunk, googleLoginThunk } from '../../../store/actions/authActions';

const FriendsList = ({isLoaded, isLoggedIn}) => {
  return (
    <div id='friends-list'>
    FRIENDS LIST COMPONENT
    </div>
  )
}

const mapState = state => ({
  displayName: state.firebase.profile.displayName,
  isLoaded: state.firebase.profile.isLoaded,
  isLoggedIn: !state.firebase.profile.isEmpty,
})

const mapDispatch = dispatch => ({
  logout: () => dispatch(logoutThunk()),
  googleOauth: () => dispatch(googleLoginThunk())
})

export default connect(mapState, mapDispatch)(FriendsList)

