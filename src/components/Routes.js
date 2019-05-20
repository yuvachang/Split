import React, { Component } from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'
import { Auth, Home, Friends, Groups } from './index'

const Routes = ({ isLoggedIn, isLoaded }) => {
  return (
    isLoaded && (
      <Switch>
        {isLoggedIn && (
          <Switch>
            <Route path='/home' component={Home} />
            <Route path='/friends' component={Friends} />
            <Route path='/groups' component={Groups} />
            <Route path='/receipts' component={Home} />
            <Redirect to='/home' component={Home} />
          </Switch>
        )}
        <Route exact path='/' component={Auth} />
        <Redirect to='/' component={Auth} />
      </Switch>
    )
  )
}

export default Routes
