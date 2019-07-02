import React from 'react'

const LoginForm = ({
  email,
  password,
  handleChange,
  error,
  handleSubmit,
  googleOauth,
}) => {
  return (
    <div className='auth-form'>
      <form onSubmit={handleSubmit}>
        <div className='auth-form-div'>
          <img alt='icon' src='./images/mail.svg' className='icon' />
          <input
            autoComplete='email'
            placeholder='Email'
            type='email'
            name='email'
            value={email}
            onChange={handleChange}
            required={true}
          />
        </div>
        <div className='auth-form-div'>
          <img alt='icon' src='./images/lock.svg' className='icon' />
          <input
            autoComplete='password'
            placeholder='Password'
            type='password'
            name='password'
            value={password}
            onChange={handleChange}
            required={true}
          />
        </div>
        {error && (
          <div className='alink small' style={{ maxWidth: '180px' }}>
            {error}
          </div>
        )}
        <br />
        <button type='submit'>Submit</button>
        <br />
        <div className='alink' onClick={() => googleOauth()}>
          Or log in with Google.
        </div>
      </form>
    </div>
  )
}

export default LoginForm
