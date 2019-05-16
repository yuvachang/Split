import React, { Component } from 'react'
import AuthForm from './AuthForm'
import {connect} from 'react-redux'
import { signupThunk } from '../../store/actions/authActions';

class Signup extends Component {
  state = {
    firstName: '',
    lastName: '',
    tel: '',
    email: '',
    password: '',
    passwordCheck: '',
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.signup(this.state)
    console.log('submitted')
  }

  render() {
    const { showForm, toggleForm } = this.props
    const {
      email,
      password,
      passwordCheck,
      firstName,
      lastName,
      tel,
    } = this.state

    return (
      <AuthForm
        type='signup'
        firstName={firstName}
        lastName={lastName}
        tel={tel}
        email={email}
        password={password}
        passwordCheck={passwordCheck}
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
  signup: user => dispatch(signupThunk(user)),
})

export default connect(mapState, mapDispatch)(Signup)
