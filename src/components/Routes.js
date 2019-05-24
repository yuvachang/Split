import React, { Component } from 'react'

import { Route, Switch, Redirect } from 'react-router-dom'
import { Auth, Home, Friends, Groups, Receipts, EditReceipt } from './index'

const Routes = ({ isLoggedIn, isLoaded }) => {
  return (
    isLoaded && (
      <Switch>
        {isLoggedIn && (
          <Switch>
            <Route exact path='/home' component={Home} />
            <Route exact path='/friends' component={Friends} />
            <Route exact path='/groups' component={Groups} />
            <Route exact path='/receipts' component={Receipts} />
            <Route exact path='/receipts/:receiptId' component={EditReceipt} />
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
