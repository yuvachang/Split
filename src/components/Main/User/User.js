import React from 'react'
import { connect } from 'react-redux'
import { logoutThunk, googleLoginThunk } from '../../../store/actions/authActions'
import { Nav, UserRoutes } from '../../index'
import './User.css'

const User = ({ logout, displayName }) => {
  return (
    <div id='user'>
      <div className='profile'>this is profile stuff</div>
      <div className='metrics'>metrics and stuff go here</div>
      {/* 
        metrics, user info here. 
      */}
    </div>
  )
}

const mapState = state => ({
  displayName: state.firebase.profile.displayName,
})

const mapDispatch = dispatch => ({
  logout: () => dispatch(logoutThunk()),
  googleOauth: () => dispatch(googleLoginThunk()),
})

export default connect(
  mapState,
  mapDispatch
)(User)
