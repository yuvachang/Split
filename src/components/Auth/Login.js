import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loginThunk, googleLoginThunk } from '../../store/actions/authActions'
import LoginForm from './LoginForm'

// TODO: sign in with telephone?
// throttle number of sign in attempts with one email

class Login extends Component {
  state = {
    email: '',
    password: '',
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.login(this.state)
    console.log('submitted')
  }

  render() {
    const { showForm, toggleForm, authType, googleOauth } = this.props
    const { email, password } = this.state

    return (
      <LoginForm
        email={email}
        password={password}
        googleOauth={googleOauth}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    )
  }
}

const mapState = state => ({
  userProfile: state.firebase.profile,
  error: state.auth.error,
})

const mapDispatch = dispatch => ({
  login: user => dispatch(loginThunk(user)),
  googleOauth: () => dispatch(googleLoginThunk()),
})

export default connect(
  mapState,
  mapDispatch
)(Login)
