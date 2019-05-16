import React from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import {
  logoutThunk,
  googleLoginThunk,
} from '../../../store/actions/authActions'
import './Nav.css'

const Nav = ({ logout, displayName, location }) => {
  const capName = displayName => {
    let nameArr = displayName.split(' ')
    nameArr.forEach((name, idx) => {
      nameArr[idx] = name.charAt(0).toUpperCase() + name.slice(1)
    })
    return nameArr.join(' ')
  }

  return (
    <div id='nav'>
      {/* <div className='nav-message'>
        <h3>Logged in as {capName(displayName)}! </h3>
      </div> */}
      <div className='nav-links'>
        <Link
          className={location.pathname === '/home' ? 'current' : ''}
          to='/home'>
          Home
        </Link>
        {/* <Link
          className={location.pathname === '/user' ? 'current' : ''}
          to='/user'>
          User
        </Link> */}
        <Link
          className={location.pathname === '/friends' ? 'current' : ''}
          to='/friends'>
          Friends
        </Link>
        <Link
          className={location.pathname === '/receipts' ? 'current' : ''}
          to='/receipts'>
          Receipts
        </Link>
        <Link
          className={location.pathname === '/groups' ? 'current' : ''}
          to='/groups'>
          Groups
        </Link>
        <a
          href=''
          onClick={e => {
            e.preventDefault()
            logout()
          }}>
          Log Out
        </a>
      </div>
    </div>
  )
}

const mapState = state => ({
  displayName: state.firebase.profile.displayName,
})

const mapDispatch = dispatch => ({
  logout: () => dispatch(logoutThunk()),
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Nav))
