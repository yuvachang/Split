import React from 'react'
import { connect } from 'react-redux'
import { Routes, LoadingScreen, Nav } from './components'
import { checkUserIndex } from './store/actions/authActions'

class App extends React.Component {
  componentDidUpdate = async prevProps => {
    if (prevProps !== this.props) {
      if (this.props.isLoggedIn) {
        this.props.checkUserIndex(this.props.currentUser.uid)
      }
    }
  }

  render() {
    const { isLoggedIn, isLoaded } = this.props
    return (
      <div className='App'>
        {isLoggedIn && <Nav />}
        {isLoaded ? (
          <Routes isLoggedIn={isLoggedIn} isLoaded={isLoaded} />
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
  checkUserIndex: (uid) => dispatch(checkUserIndex(uid)),
})

export default connect(
  mapState,
  mapDispatch
)(App)
