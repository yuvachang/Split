import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  logoutThunk,
  googleLoginThunk,
} from '../../../store/actions/authActions'
import { getUserStats } from '../../../store/actions/receiptsActions'
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

  componentDidMount = async () => {
    console.log(this.props.currentUID)
    await this.props.getUserStats(this.props.currentUID)
  }

  render() {
    const { isLoaded, isLoggedIn, stats } = this.props
    const { view } = this.state
    console.log('!!!', stats)
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
        {view === 'home' && (
          <div className='homepage'>
            <br />
            Welcome!
            <br />
            <br />
            <div
              className='button card'
              onClick={() => {
                this.props.history.push('/receipts/create')
              }}>
              Add a new receipt!
            </div>
            <br />
            <div className='stats'>
              <br />
              You've spent ${stats.totalSpending || '0'} in total.
            </div>
          </div>
        )}

        {view === 'notifs' && <FriendsPending />}
      </div>
    )
  }
}

const mapState = state => ({
  displayName: state.firebase.profile.displayName,
  isLoaded: state.firebase.profile.isLoaded,
  isLoggedIn: !state.firebase.profile.isEmpty,
  currentUID: state.firebase.auth.uid,
  stats: state.receipts.stats,
})

const mapDispatch = dispatch => ({
  logout: () => dispatch(logoutThunk()),
  googleOauth: () => dispatch(googleLoginThunk()),
  getUserStats: uid => dispatch(getUserStats(uid)),
})

export default connect(
  mapState,
  mapDispatch
)(Home)
