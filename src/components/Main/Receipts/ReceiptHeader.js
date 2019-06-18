import React, { Component } from 'react'
import { connect } from 'react-redux'

class ReceiptHeader extends Component {
  state = {
    notifs: false,
  }

  updateNotifs = async () => {
    const hasNotifs =
      !!this.props.pPending.receivedRequest[0] ||
      // !!this.props.pPending.madeRequest[0] ||
      !!this.props.pPending.confirmed[0]
    console.log('hasnotifs?', hasNotifs)
    if (!this.state.notifs && hasNotifs) {
      console.log('turn on notifs')
      await this.setState({
        notifs: true,
      })
    } else if (this.state.notifs && !hasNotifs) {
      console.log('turn off notifs')
      await this.setState({
        notifs: false,
      })
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
              src={b1Src}
              alt='icon'
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
            <img
              src='./images/search.svg'
              alt='search icon'
              className='icon grey'
            />
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
              src={b2Src}
              alt='icon'
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
                src={b3Src}
                alt='icon'
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
  pPending: state.firebase.profile.pending.friends,
})

export default connect(mapState)(ReceiptHeader)
