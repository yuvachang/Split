import React, { Component } from 'react'
import { connect } from 'react-redux'

class ReceiptHeader extends Component {
  state = {}

  componentDidUpdate = async prevProps => {}

  componentDidMount = async () => {}

  render() {
    const { showMenu, b1Src, b1Click} = this.props
    return (
      <div className='menu'>
        <div className='menu-views'>
          <div
            className={`round-icon-button ${showMenu ? 'selected' : ''}`}
            onClick={b1Click}>
            <img
              src={b1Src}
              alt='menu'
              className='icon'
              style={showMenu ? {} : { filter: 'invert(0.4)' }}
            />
          </div>
        </div>

        {/* <div className='menu-views'>
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
        </div> */}

        {/* {b3Src && (
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
        )} */}
      </div>
    )
  }
}

const mapState = state => ({
  pPending: state.firebase.profile.pending.friends,
})

export default connect(mapState)(ReceiptHeader)
