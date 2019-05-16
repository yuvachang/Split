import React from 'react'
import {connect} from 'react-redux'
import { logoutThunk, googleLoginThunk } from '../../../store/actions/authActions';
import { Nav, UserRoutes } from '../../index'
import FriendsList from './FriendsList'
import AddFriend from './AddFriend'
import './Friends.css'

const Friends = ({isLoaded, isLoggedIn}) => {
  return (
    <div id='friends'>
      ::Add Friend::
      <br/>
      options: import from contacts, scan qr code, find by email/tel
      <br/>
      show found/scanned/selected friend, add button

      <br/>
      <br/>
      <AddFriend/>
      <br/>
      <br/>
      ::Search bar::
      <br/>
      <br/>
      Friends list: 
      <br/>
      filter by Search, onclick show friend profile, item show iou
      <br/>
      <FriendsList/>
  
      {/* <UserRoutes isLoggedIn={isLoggedIn} isLoaded={isLoaded}/> */}
      {/* 
        metrics, user info here. 
      */}
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

export default connect(mapState, mapDispatch)(Friends)

