import React, { Component } from 'react'
import { connect } from 'react-redux'
import { logoutThunk, googleLoginThunk } from '../../store/actions/authActions'
import Login from './Login'
import Signup from './Signup'

class Auth extends Component {
  state = {
    authType: 'none',
    loading: true,

    window: {
      width: 0,
      height: 0,
    },
  }

  toggleForm = type => {
    this.setState({ authType: type })
  }

  closeForm = () => {
    this.setState({ authType: 'login' })
  }

  setWindowSize = () => {
    this.setState({
      window: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    })
  }

  componentDidMount = () => {
    this.setWindowSize()
    window.addEventListener('resize', this.setWindowSize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.setWindowSize)
  }

  render() {
    const { authType, window } = this.state
    return (
      <div className='auth-page'>
        <div
          className='auth-top-half'
          style={
            authType === 'none'
              ? { height: '40vh', transition: '0.5s' }
              : authType === 'signup'
              ? { height: '100vh', transition: '0.5s' }
              : {}
          }>
          <div id='auth-nav'>
            <div
              className={
                authType === 'signup' ? 'selected left' : 'button-text left'
              }
              onClick={() => this.toggleForm('signup')}>
              Sign Up
            </div>

            <div
              className={
                authType === 'login' ? 'selected right' : 'button-text right'
              }
              onClick={() => this.toggleForm('login')}>
              Log In
            </div>
          </div>

          <div className='form-space'>
            {/* SIGNUP */}

            <div
              className={
                authType === 'signup' ? 'auth-form' : 'auth-form transparent'
              }>
              <Signup />
              <br />
              <a onClick={() => this.toggleForm('none')} className='small'>
                Cancel
              </a>
            </div>

            {/* LOGIN */}
            <div
              className={
                authType === 'login' ? 'auth-form' : 'auth-form transparent'
              }>
              <Login />
              <br />
              <a onClick={() => this.toggleForm('none')} className='small'>
                Cancel
              </a>
            </div>
          </div>

          <img
            src='/images/orange-wedge.png'
            draggable='false'
            className={
              authType === 'signup'
                ? window.height >= 430
                  ? 'orange-wedge'
                  : 'orange-wedge collapsed'
                : 'orange-wedge'
            }
          />
        </div>

        <div
          className='auth-bottom-half'
          style={
            authType === 'none'
              ? { height: '60vh', transition: '0.5s' }
              : authType === 'signup'
              ? { height: '0vh', transition: '0.5s' }
              : {}
          }>
          <div id='split-blurb'>
            {authType !== 'signup' && <p className='split-title'>Split.</p>}

            {((authType === 'login' && window.height > 550) ||
              authType === 'none') && (
              <p>
                Tired of paying for someone else's extra drink? <i>Split</i> your bill so you only pay for what you ordered! 
              </p>
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
})

export default connect(
  mapState,
  mapDispatch
)(Auth)
