import React, { Component } from 'react'
import AuthForm from './AuthForm'
import { connect } from 'react-redux'
import { signupThunk } from '../../store/actions/authActions'

class Signup extends Component {
  state = {
    firstName: '',
    lastName: '',
    tel: '',
    email: '',
    password: '',
    passwordCheck: '',
    error: '',
  }

  handleChange = async e => {
    await this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = async e => {
    e.preventDefault()

    // validation

    if (this.state.password !== this.state.passwordCheck) {
      this.setState({ error: 'Passwords need to be the same.' })
      return
    }
    
    await this.props.signup(this.state)

    if (this.props.error) {
      await this.setState({ error: this.props.error })
    } else {
      await this.setState({
        firstName: '',
        lastName: '',
        tel: '',
        email: '',
        password: '',
        passwordCheck: '',
        error: '',
      })
    }
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
      error,
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
        error={error}
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
  signup: user => dispatch(signupThunk(user)),
})

export default connect(
  mapState,
  mapDispatch
)(Signup)
