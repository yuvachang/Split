import React, { Component } from 'react'
import './auth-form.css'

const AuthForm = ({
  type,
  email,
  password,
  passwordCheck,
  firstName,
  lastName,
  tel,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div>
      <form onSubmit={handleSubmit} className='auth-form'>
        {type === 'signup' && (
          <div className='auth-form'>
            <label>First Name:</label>
            <input
              type='text'
              name='firstName'
              value={firstName}
              onChange={handleChange}
            />
            <label>Last Name:</label>
            <input
              type='text'
              name='lastName'
              value={lastName}
              onChange={handleChange}
            />
            <label>Phone:</label>
            <input type='tel' name='tel' value={tel} onChange={handleChange} />
          </div>
        )}

        <label>Email:</label>
        <input
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
        />
        <label>Password:</label>
        <input
          type='password'
          name='password'
          value={password}
          onChange={handleChange}
        />

        {type === 'signup' && (
          <div className='auth-form'>
            <label>Enter password again:</label>
            <input
              type='password'
              name='passwordCheck'
              value={passwordCheck}
              onChange={handleChange}
            />
          </div>
        )}
      <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default AuthForm
