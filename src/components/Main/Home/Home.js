import React from 'react'
import {connect} from 'react-redux'
import { logoutThunk, googleLoginThunk } from '../../../store/actions/authActions';
import { Nav, UserRoutes } from '../../index'

const Home = ({isLoaded, isLoggedIn}) => {
  return (
    <div>
      home page
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

export default connect(mapState, mapDispatch)(Home)

