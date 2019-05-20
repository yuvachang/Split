import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logoutThunk, googleLoginThunk } from '../../store/actions/authActions'
import Login from './Login'
import Signup from './Signup'

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
          <div className='auth-right-container'>
            <div className='auth-back'>
              {/* BACK BUTTON */}
              {authType !== 'none' && (
                <button onClick={this.closeForm} className='button'>
                  Back
                </button>
              )}
            </div>
            {/* SIGN UP */}
            {authType === 'signup' ? (
              <Signup showForm={authType === 'signup' ? true : false} />
            ) : (
              authType === 'none' && (
                <div className='button' onClick={() => this.toggleForm('login')}>Log In</div>
              )
            )}

            {/* EMAIL LOGIN */}
            {authType === 'login' ? (
              <Login showForm={authType === 'login' ? true : false} />
            ) : (
              authType === 'none' && (
                <div className='button' onClick={() => this.toggleForm('signup')}>
                  Sign Up
                </div>
              )
            )}

            {/* GOOGLE LOGIN */}
            {authType === 'none' ? (
              <div className='button' onClick={() => this.props.googleOauth()}>
                <img src='./images/google.svg' className='icon' />
                oogle Login
              </div>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  displayName: !!state.firebase.profile.displayName,
})

const mapDispatch = dispatch => ({
  logout: () => dispatch(logoutThunk()),
  googleOauth: () => dispatch(googleLoginThunk()),
})

export default connect(
  mapState,
  mapDispatch
)(Auth)
