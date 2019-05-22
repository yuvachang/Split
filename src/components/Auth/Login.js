import React, { Component } from 'react'
import {connect} from 'react-redux'
import {loginThunk} from '../../store/actions/authActions'
import AuthForm from './AuthForm'

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
    const { showForm, toggleForm, authType } = this.props
    const { email, password } = this.state

    return (
      <AuthForm
        type={authType}
        email={email}
        password={password}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    )
  }
}

const mapState = state => ({
  userProfile: state.firebase.profile,
  error: state.auth.error
})

const mapDispatch = dispatch => ({
  login: user => dispatch(loginThunk(user)),
})

export default connect(mapState, mapDispatch)(Login)
