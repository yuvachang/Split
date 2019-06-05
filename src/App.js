import React from 'react'
import { connect } from 'react-redux'
import { Routes, LoadingScreen, Nav } from './components'
import { checkUserIndex } from './store/actions/authActions'

class App extends React.Component {
  componentDidUpdate = async prevProps => {
    if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
      console.log('app didupdate')
      if (this.props.isLoggedIn) {
        await this.props.checkUserIndex(this.props.currentUser.uid)
      }
    }
  }
  componentDidMount = async () => {
    if (this.props.isLoggedIn) {
      await this.props.checkUserIndex(this.props.currentUser.uid)
    }
  }

  render() {
    const { isLoggedIn, isLoaded } = this.props
    return (
      <div className='App'>
        {isLoggedIn && <Nav />}
        {isLoaded ? (
          <div id={isLoggedIn ? 'routes' : ''}>
            <Routes isLoggedIn={isLoggedIn} isLoaded={isLoaded} />
          </div>
        ) : (
          <LoadingScreen />
        )}
      </div>
    )
  }
}

const mapState = state => ({
  isLoaded: state.firebase.profile.isLoaded,
  isLoggedIn: !state.firebase.profile.isEmpty,
  currentUser: state.firebase.auth,
})

const mapDispatch = dispatch => ({
  checkUserIndex: uid => dispatch(checkUserIndex(uid)),
})

export default connect(
  mapState,
  mapDispatch
)(App)
