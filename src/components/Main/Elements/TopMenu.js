import React, { Component } from 'react'
import { connect } from 'react-redux'

class TopMenu extends Component {
  state = {
    notifs: false,
  }

  updateNotifs = async () => {
    if (!!Object.keys(this.props.pPending.friends).length) {
      const hasNotifs =
        !!this.props.pPending.friends.receivedRequest.length ||
        // !!this.props.pPending.madeRequest.length ||
        !!this.props.pPending.friends.confirmed.length
      if (!this.state.notifs && hasNotifs) {
        await this.setState({
          notifs: true,
        })
      } else if (this.state.notifs && !hasNotifs) {
        await this.setState({
          notifs: false,
        })
      }
    }
  }

  componentDidUpdate = async prevProps => {
    if (this.props.b2Src.includes('bell')) {
      if (prevProps.pPending !== this.props.pPending) {
        this.updateNotifs()
      }
    }
  }

  componentDidMount = async () => {
    if (this.props.b2Src.includes('bell')) {
      await this.updateNotifs()
    }
  }

  render() {
    const {
      view,
      searchPlaceholder,
      search,
      b1Src,
      b1Click,
      b2Src,
      b2Click,
      b3Src,
      b3Click,
    } = this.props
    return (
      <div className='menu'>
        <div className='menu-views'>
          <div
            className={`round-icon-button ${
              view === 'list' || view === 'home' ? 'selected' : ''
            }`}
            onClick={b1Click}>
            <img
              alt='icon'
              src={b1Src}
              className='icon'
              style={
                view === 'list' || view === 'home'
                  ? {}
                  : { filter: 'invert(0.4)' }
              }
            />
          </div>
        </div>

        {search && (
          <div
            className={
              view === 'list' || view === 'add-friend'
                ? 'search-div'
                : 'search-div hidden'
            }>
            <img alt='icon' src='./images/search.svg' className='icon grey' />
            <input
              className='textarea-only'
              // placeholder={
              //   view === 'list' ? searchPlaceholder : dbSearchPlaceholder
              // }
              placeholder={searchPlaceholder}
              type='text'
              onChange={search}
              // onChange={view === 'list' ? search : dbSearch}
              autoCapitalize='off'
              autoComplete='off'
            />
          </div>
        )}

        <div className='menu-views'>
          <div
            className={`round-icon-button ${
              view === 'add' || view === 'notifs' ? 'selected' : ''
            }`}
            onClick={b2Click}>
            <img
              alt='icon'
              src={b2Src}
              className='icon'
              style={
                view === 'add' || view === 'notifs'
                  ? {}
                  : { filter: 'invert(0.4)' }
              }
            />

            {this.state.notifs && <div className='notif-bullet' />}
          </div>
        </div>

        {b3Src && (
          <div className='menu-views'>
            <div
              className={`round-icon-button ${
                view === 'notif' ? 'selected' : ''
              }`}
              onClick={b3Click}>
              <img
                alt='icon'
                src={b3Src}
                className='icon'
                style={view === 'add' ? {} : { filter: 'invert(0.4)' }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

const mapState = state => ({
  pPending: state.firebase.profile.pending,
})

export default connect(mapState)(TopMenu)
