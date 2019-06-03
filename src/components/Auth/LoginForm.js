import React, { Component } from 'react'

const LoginForm = ({
  authType,
  email,
  password,
  passwordCheck,
  firstName,
  lastName,
  tel,
  handleChange,
  error,
  handleSubmit,
  googleOauth
}) => {
  return (
    <div className='auth-form'>
      <form onSubmit={handleSubmit}>
        <div className={authType === 'signup' ? 'auth-form-div' : 'hidden'}>
          {/* <label>First Name:</label> */}
          <img src='./images/person.svg' className='icon' />
          <input
            placeholder='First Name'
            type='text'
            name='firstName'
            value={firstName}
            onChange={handleChange}
            required={authType === 'signup' ? true : false}
          />
        </div>
        <div className={authType === 'signup' ? 'auth-form-div' : 'hidden'}>
          {/* <label>Last Name:</label> */}
          <img src='./images/person.svg' className='icon' />
          <input
            placeholder='Last Name'
            type='text'
            name='lastName'
            value={lastName}
            onChange={handleChange}
            required={authType === 'signup' ? true : false}
          />
        </div>
  
        <div className='auth-form-div'>
          {/* <label>Email:</label> */}
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
        <div className='auth-form-div'>
          {/* <label>Password:</label> */}
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
        <div className={authType === 'signup' ? 'auth-form-div' : 'hidden'}>
          {/* <label>Enter password again:</label> */}
          <img src='./images/lock.svg' className='icon' />
          <input
            placeholder='Repeat Password'
            type='password'
            name='passwordCheck'
            value={passwordCheck}
            onChange={handleChange}
            required={authType === 'signup' ? true : false}
          />
        </div>
        {error && <div>{error}</div>}
        <br/>
        <button type='submit'>Submit</button>
        {/* Or log in with 
        <button
          // style={{ zIndex: '33' }}
          onClick={() => googleOauth()}>
          Google
        </button> */}
        <br/>
        <a onClick={() => googleOauth()}> Or log in with Google.</a>
      </form>
    </div>
  )
}

export default LoginForm


{/* <div className={authType === 'signup' ? 'auth-form-div' : 'hidden'}> */}
{/* <label>Phone:</label> */}
{/* <img src='./images/phone.svg' className='icon' />
<input
  placeholder='Phone'
  type='tel'
  name='tel'
  value={tel}
  onChange={handleChange}
/>
</div> */}