import React, { Component } from 'react'

class SignupForm extends Component {
  render() {
    const {
      authType,
      email,
      password,
      passwordCheck,
      firstName,
      lastName,
      handleChange,
      error,
      handleSubmit,
      googleOauth,
      togglePage,
      page,
    } = this.props
    return (
      <div className='auth-form'>
        <p>Already have a Google Account?</p>

        <a onClick={() => googleOauth()}> Log in with Google.</a>
        <br />

        <form onSubmit={handleSubmit}>
          {page === '1' && (
            <div className='auth-form-div'>
              <img src='./images/person.svg' className='icon' />
              <input
                placeholder='First Name'
                type='text'
                name='firstName'
                value={firstName}
                onChange={handleChange}
                required={true}
              />
            </div>
          )}
          {page === '1' && (
            <div className='auth-form-div'>
              <img src='./images/person.svg' className='icon' />
              <input
                placeholder='Last Name'
                type='text'
                name='lastName'
                value={lastName}
                onChange={handleChange}
                required={true}
              />
            </div>
          )}
          {page === '1' && (
            <button onClick={() => togglePage('2')}>Next</button>
          )}

          {page === '2' && (
            <div className='auth-form-div'>
              <img src='./images/mail.svg' className='icon' />
              <input
                placeholder='Email'
                type='email'
                name='email'
                value={email}
                onChange={handleChange}
                required={true}
              />
            </div>
          )}
          {page === '2' && (
            <div className='auth-form-div'>
              <img src='./images/lock.svg' className='icon' />
              <input
                placeholder='Password'
                type='password'
                name='password'
                value={password}
                onChange={handleChange}
                required={true}
              />
            </div>
          )}
          {page === '2' && (
            <div className='auth-form-div'>
              <img src='./images/lock.svg' className='icon' />
              <input
                placeholder='Repeat Password'
                type='password'
                name='passwordCheck'
                value={passwordCheck}
                onChange={handleChange}
                required={true}
              />
            </div>
          )}
          {page === '2' && (
            <div className='auth-form'>
              {error && <div>{error}</div>}
              <br />
              <button onClick={() => togglePage('1')}>Back</button>
              <button type='submit'>Submit</button>
            </div>
          )}
        </form>
      </div>
    )
  }
}

export default SignupForm
