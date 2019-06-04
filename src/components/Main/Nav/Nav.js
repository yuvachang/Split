import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import {
  logoutThunk,
  checkUserIndex,
} from '../../../store/actions/authActions'

class Nav extends Component {



  capName = displayName => {
    let nameArr = displayName.split(' ')
    nameArr.forEach((name, idx) => {
      nameArr[idx] = name.charAt(0).toUpperCase() + name.slice(1)
    })
    return nameArr.join(' ')
  }

  componentDidMount = async () => {
    await this.props.checkUserIndex(this.props.currentUID)
  }

  render() {
    const { logout, displayName, location, pending, profile } = this.props
    return (
      <div id='nav'>
        <div className='nav-links'>
          <Link
            className={location.pathname === '/home' ? 'current' : ''}
            to='/home'>
            {/* <img src='./images/home.svg' className='icon large' /> */}
            Home
          </Link>
          <Link
            className={location.pathname === '/friends' ? 'current' : ''}
            to='/friends'>
            {/* <img src='./images/people.svg' className='icon large' /> */}
            Friends
          </Link>
          <Link
            className={location.pathname === '/receipts' ? 'current' : ''}
            to='/receipts'>
            {/* <img src='./images/receipts.svg' className='icon large' /> */}
            Receipts
          </Link>
          <Link
            className={location.pathname === '/groups' ? 'current' : ''}
            to='/groups'>
            {/* <img src='./images/group.png' className='icon large' /> */}
            Groups
          </Link>
  
          {profile.pending && <div>PENDING HERE</div>}
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
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  profile: state.firebase.profile,
  displayName: state.firebase.profile.displayName,
})

const mapDispatch = dispatch => ({
  checkUserIndex: (UID)=> dispatch(checkUserIndex(UID)),
  logout: () => dispatch(logoutThunk()),
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Nav))
