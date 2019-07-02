import React, { Component } from 'react'

class SignupForm extends Component {
  render() {
    const {
      email,
      password,
      passwordCheck,
      firstName,
      lastName,
      handleChange,
      error,
      formError,
      handleSubmit,
      googleOauth,
      togglePage,
      page,
    } = this.props
    return (
      <div className='auth-form'>
        <p>Already have a Google Account?</p>

        <div className='alink' onClick={() => googleOauth()}>
          Log in with Google.
        </div>
        <br />

        <form onSubmit={handleSubmit}>
          {page === '1' && (
            <div className='auth-form-div'>
              <img alt='icon' src='./images/person.svg' className='icon' />
              <input
                placeholder='First Name'
                autoComplete='given-name'
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
              <img alt='icon' src='./images/person.svg' className='icon' />
              <input
                placeholder='Last Name'
                autoComplete='family-name'
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
              <img alt='icon' src='./images/mail.svg' className='icon' />
              <input
                placeholder='Email'
                autoComplete='email'
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
              <img alt='icon' src='./images/lock.svg' className='icon' />
              <input
                placeholder='Password'
                autoComplete='new-password'
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
              <img alt='icon' src='./images/lock.svg' className='icon' />
              <input
                placeholder='Repeat Password'
                autoComplete='new-password'
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
              {error && <div className='alink small'>{error}</div>}
              {formError && <div className='alink small'>{formError}</div>}
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
