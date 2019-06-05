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
    console.log(this.homeLink.ref.getBoundingClientRect())

    if (window.innerWidth < 700) {
      let node = ''
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

      if (window.innerWidth < 390) {
        await this.setState({
          // bulletTop: this[node].ref.getBoundingClientRect().top - 5,
          bulletLeft: Math.round(this[node].ref.getBoundingClientRect().left - 5),
        })
        return
      }

      await this.setState({
        bulletTop: this[node].ref.getBoundingClientRect().top - 5,
        bulletLeft: null,
      })
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

  componentDidMount = async () => {
    await this.props.checkUserIndex(this.props.currentUID)
    await this.setMarker()
    await this.setWindowSize()
    window.addEventListener('resize', this.setWindowSize)
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.setWindowSize)
  }

  render() {
    const { logout, displayName, location, pending, profile } = this.props
    const { window, bulletTop, bulletLeft } = this.state

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

          {window.width < 390 && (
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

          {/* <div
            className={
              location.pathname === '/home' ? 'link-item current' : 'link-item'
            }
            onClick={async () => {
              await this.pushHistory('/home')
              await this.setMarker()
            }}>
            <img
              src='/images/home.svg'
              className={window.width < 700 ? 'icon center' : 'icon'}
              ref={node => {
                this.homeLink = node
              }}
            />
            {window.width > 700 && 'Home'}
            {window.width > 700 && (
              <div
                className={
                  location.pathname === '/home' ? 'bullet filled' : 'bullet'
                }
              />
            )}
          </div> */}
          {/* 

          <div
            className={
              location.pathname === '/friends'
                ? 'link-item current'
                : 'link-item'
            }
            onClick={async () => {
              await this.pushHistory('/friends')
              await this.setMarker()
            }}>
            <img
              src='/images/people.svg'
              className={window.width < 700 ? 'icon center' : 'icon'}
              ref={node => {
                this.friendsLink = node
              }}
            />
            {window.width > 700 && 'Friends'}
            {window.width > 700 && (
              <div
                className={
                  location.pathname === '/friends' ? 'bullet filled' : 'bullet'
                }
              />
            )}
          </div>

          <div
            className={
              location.pathname === '/receipts'
                ? 'link-item current'
                : 'link-item'
            }
            onClick={() => this.pushHistory('/receipts')}>
            <img src='/images/receipts.svg' className='icon' />
            Receipts
            <div
              className={
                location.pathname === '/receipts' ? 'bullet filled' : 'bullet'
              }
              ref={node => {
                this.receiptsLink = node
              }}
            />
          </div>

          <div
            className={
              location.pathname === '/groups'
                ? 'link-item current'
                : 'link-item'
            }
            onClick={() => this.pushHistory('/groups')}>
            <img src='/images/group.png' className='icon' />
            Groups
            <div
              className={
                location.pathname === '/groups' ? 'bullet filled' : 'bullet'
              }
              ref={node => {
                this.groupsLink = node
              }}
            />
          </div> */}
        </div>
        <div className='nav-footer'>
          {/* {profile.pending && <div>PENDING HERE</div>} */}
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
})

const mapDispatch = dispatch => ({
  checkUserIndex: UID => dispatch(checkUserIndex(UID)),
  logout: () => dispatch(logoutThunk()),
})

export default connect(
  mapState,
  mapDispatch
)(withRouter(Nav))
