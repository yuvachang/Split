import React, { Component } from 'react'
import {connect} from 'react-redux'
import { logoutThunk, googleLoginThunk } from '../../store/actions/authActions';
import Login from './Login'
import Signup from './Signup'
import './auth.css'

class Auth extends Component {
  state = {
    authType: 'none',
    loading: true,
  }

  toggleForm = type => {
    this.setState({ authType: type })
  }

  closeForm = () => {
    this.setState({ authType: 'none' })
  }

  render() {
    const { authType } = this.state
    return (
      <div className='auth-page'>
        <div className='auth-left'>
          <h1>Split.</h1>
        </div>
        <div className='auth-right'>
          {authType !== 'none' && (
            <button onClick={this.closeForm}>{'<<'}</button>
          )}
          {authType === 'login' ? (
            <Login showForm={authType === 'login' ? true : false} />
          ) : (
            authType === 'none' && (
              <button onClick={() => this.toggleForm('signup')}>Sign Up</button>
            )
          )}

          {authType === 'signup' ? (
            <Signup showForm={authType === 'signup' ? true : false} />
          ) : (
            authType === 'none' && (
              <button onClick={() => this.toggleForm('login')}>Log In</button>
            )
          )}

          {/* <button onClick={()=>this.props.logout()}> LOG OUT</button> */}
          <button onClick={()=>this.props.googleOauth()}> LOG IN WITH GOOGLE </button>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  displayName: !!state.firebase.profile.displayName
})

const mapDispatch = dispatch => ({
  logout: () => dispatch(logoutThunk()),
  googleOauth: () => dispatch(googleLoginThunk()),
})

export default connect(mapState, mapDispatch)(Auth)
