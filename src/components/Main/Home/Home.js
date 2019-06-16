import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  logoutThunk,
  googleLoginThunk,
} from '../../../store/actions/authActions'
// import { Nav, UserRoutes } from '../../index'
import FriendsPending from '../Friends/FriendsPending'
import TopMenu from '../Elements/TopMenu'

class Home extends Component {
  state = {
    view: 'home',
  }

  switchView = async view => {
    await this.setState({ view })
  }

  render() {
    const { isLoaded, isLoggedIn } = this.props
    const { view } = this.state
    return (
      <div id='homepage'>
        <TopMenu
          view={view}
          // searchPlaceholder='Find existing friend...'
          // search={this.search}
          b1Src='/images/home.svg'
          b1Click={() => this.switchView('home')}
          b2Src='/images/bell.svg'
          b2Click={() => this.switchView('notifs')}
        />
        {view === 'home' && <div>Welcome to your home page</div>}

        {view === 'notifs' && <FriendsPending />}

        {/* <UserRoutes isLoggedIn={isLoggedIn} isLoaded={isLoaded}/> */}
        {/* 
        metrics, user info here. 
      */}
      </div>
    )
  }
}

const mapState = state => ({
  displayName: state.firebase.profile.displayName,
  isLoaded: state.firebase.profile.isLoaded,
  isLoggedIn: !state.firebase.profile.isEmpty,
})

const mapDispatch = dispatch => ({
  logout: () => dispatch(logoutThunk()),
  googleOauth: () => dispatch(googleLoginThunk()),
})

export default connect(
  mapState,
  mapDispatch
)(Home)
