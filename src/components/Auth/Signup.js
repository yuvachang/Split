import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signupThunk, googleLoginThunk } from '../../store/actions/authActions'
import SignupForm from './SignupForm';

class Signup extends Component {
  state = {
    firstName: '',
    lastName: '',
    tel: '',
    email: '',
    password: '',
    passwordCheck: '',
    error: '',
    page: '1',
  }

  togglePage = page => {
    this.setState({
      page
    })
  }

  handleChange = async e => {
    await this.setState({
      [e.target.name]: e.target.value,
    })
  }

  handleSubmit = async e => {
    e.preventDefault()

    const {password, passwordCheck, firstName, lastName, email} = this.state

    // validation
    if (!firstName || !lastName || !email || !password || !passwordCheck) {
      await this.setState({ error: 'Please make sure you filled out all fields.'})
      return
    }
    if (password !== passwordCheck) {
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
        page: '1',
      })
    }
  }

  render() {
    const { googleOauth } = this.props
    const {
      email,
      password,
      passwordCheck,
      firstName,
      lastName,
      tel,
      error,
      page
    } = this.state

    return (
      <SignupForm
        authType='signup'
        page={page}
        togglePage={this.togglePage}
        googleOauth={googleOauth}
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
  googleOauth: () => dispatch(googleLoginThunk()),
})

export default connect(
  mapState,
  mapDispatch
)(Signup)
