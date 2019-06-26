import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { logoutThunk, checkUserIndex } from '../../../store/actions/authActions'
import NavLink from './NavLInk'

class Nav extends Component {
  state = {
    bulletTop: 121,
    bulletLeft: null,
    window: {
      width: 0,
      height: 0,
    },
    notifs: false,
  }

  capName = displayName => {
    let nameArr = displayName.split(' ')
    nameArr.forEach((name, idx) => {
      nameArr[idx] = name.charAt(0).toUpperCase() + name.slice(1)
    })
    return nameArr.join(' ')
  }

  pushHistory = route => {
    this.props.history.push(route)
  }

  setMarker = async () => {
    if (window.innerWidth < 700) {
      let node = ''
      if (this.props.location.pathname === '/receipts/create') {
        node = 'newReceiptLink'
      }
      if (this.props.location.pathname === '/home') {
        node = 'homeLink'
      }
      if (this.props.location.pathname === '/friends') {
        node = 'friendsLink'
      }
      if (this.props.location.pathname === '/receipts') {
        node = 'receiptsLink'
      }
      if (this.props.location.pathname === '/groups') {
        node = 'groupsLink'
      }
      if (node) {
        if (window.innerWidth < 420 && this[node]) {
          await this.setState({
            bulletLeft: Math.round(
              this[node].ref.getBoundingClientRect().left - 5
            ),
          })
        } else {
          if (!this[node] || node === 'newReceiptLink') {
            await this.setState({
              bulletTop: -50,
              bulletLeft: null,
            })
          } else {
            await this.setState({
              bulletTop: this[node].ref.getBoundingClientRect().top - 5,
              bulletLeft: null,
            })
          }
        }
      }
    }
  }

  setWindowSize = async () => {
    if (window.innerWidth < 700) {
      await this.setMarker()
    }
    await this.setState({
      window: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    })
  }

  updateNotifs = async () => {
    const hasNotifs =
      !!this.props.pPending.receivedRequest[0] ||
      // !!this.props.pPending.madeRequest[0] ||
      !!this.props.pPending.confirmed[0]
    // console.log('hasnotifs?', hasNotifs)
    if (!this.state.notifs && hasNotifs) {
      // console.log('turn on notifs')
      await this.setState({
        notifs: true,
      })
    } else if (this.state.notifs && !hasNotifs) {
      // console.log('turn off notifs')
      await this.setState({
        notifs: false,
      })
    }
  }

  componentDidUpdate = async prevProps => {
    if (prevProps.pPending !== this.props.pPending) {
      this.updateNotifs()
    }
  }

  componentDidMount = async () => {
    await this.props.checkUserIndex(this.props.currentUID)
    await this.setMarker()
    await this.setWindowSize()
    await this.updateNotifs()
    window.addEventListener('resize', this.setWindowSize)
    window.addEventListener('orientationchange', () => {
      window.setTimeout(this.setWindowSize, 350)
    })
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.setWindowSize)
    window.removeEventListener('orientationchange', this.setWindowSize, 800)
  }

  render() {
    const { logout, displayName, location, pending, profile } = this.props
    const { window, bulletTop, bulletLeft, notifs } = this.state

    return (
      <div id='nav'>
        <div className='nav-header'>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} className='large-avatar' />
          ) : (
            <img src='/images/person.svg' className='large-avatar' />
          )}

          {displayName && <p>{this.capName(displayName)}</p>}
        </div>

        <div className='nav-links'>
          {window.width < 700 && (
            <div
              className='bullet mobile'
              style={bulletLeft ? { left: bulletLeft } : { top: bulletTop }}
            />
          )}

          <NavLink
            name='Home'
            showNotif={notifs ? true : false}
            windowWidth={window.width}
            location={location.pathname}
            pathname='/home'
            pushHistory={this.pushHistory}
            setMarker={this.setMarker}
            iconSrc='/images/home.svg'
            ref={node => {
              this.homeLink = node
            }}
          />

          <NavLink
            name='Friends'
            windowWidth={window.width}
            location={location.pathname}
            pathname='/friends'
            pushHistory={this.pushHistory}
            setMarker={this.setMarker}
            iconSrc='/images/people.svg'
            ref={node => {
              this.friendsLink = node
            }}
          />

          {window.width < 420 && (
            <NavLink
              name='New Receipt'
              windowWidth={window.width}
              location={location.pathname}
              pathname='/receipts/create'
              pushHistory={this.pushHistory}
              setMarker={this.setMarker}
              iconSrc='/images/add.svg'
              ref={node => {
                this.newReceiptLink = node
              }}
            />
          )}

          <NavLink
            name='Receipts'
            windowWidth={window.width}
            location={location.pathname}
            pathname='/receipts'
            pushHistory={this.pushHistory}
            setMarker={this.setMarker}
            iconSrc='/images/receipts.svg'
            ref={node => {
              this.receiptsLink = node
            }}
          />

          <NavLink
            name='Groups'
            windowWidth={window.width}
            location={location.pathname}
            pathname='/groups'
            pushHistory={this.pushHistory}
            setMarker={this.setMarker}
            iconSrc='/images/group.png'
            ref={node => {
              this.groupsLink = node
            }}
          />
        </div>
        <div className='nav-footer'>
          <a
            href=''
            onClick={e => {
              e.preventDefault()
              logout()
            }}>
            Log Out
          </a>
        </div>
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  profile: state.firebase.profile,
  displayName: state.firebase.profile.displayName,
  pPending: state.firebase.profile.pending.friends,
})

const mapDispatch = dispatch => ({
  checkUserIndex: UID => dispatch(checkUserIndex(UID)),
  logout: () => dispatch(logoutThunk()),
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Nav))
