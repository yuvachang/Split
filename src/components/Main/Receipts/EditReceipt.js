import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  listenReceipt,
  unlistenReceipt,
} from '../../../store/actions/receiptsActions'
import ItemsList from './ItemsList'
import ReceiptHeader from './ReceiptHeader'
import ReceiptAmountsPanel from './AmountsPanel/ReceiptAmountsPanel'

class EditReceipt extends Component {
  state = {
    payer: {},
    showMenu: true,
    windowWidth: 0,
  }

  toggleMenu = async () => {
    await this.setState({
      showMenu: !this.state.showMenu,
    })
  }

  setWindowWidth = () => {
    if (window.innerWidth <= 760) {
      this.setState({
        windowWidth: window.innerWidth,
      })
    } else {
      this.setState({
        windowWidth: 310,
      })
    }
  }

  componentDidUpdate = async prevProps => {
    if (!prevProps.receipt.id && this.props.receipt.id) {
      console.log('EditReceipt updated')
    }
  }

  componentDidMount = async () => {
    console.log('EditReceipt mounted')
    // set listener on receipt, will fetch receipt to store
    // no need to use 'selectReceipt'
    const receiptId = this.props.location.pathname.slice(10)
    await this.props.listenReceipt(receiptId)

    // determine window width for menu's translate-x distance
    this.setWindowWidth()
    window.addEventListener('resize', this.setWindowWidth)
  }

  componentWillUnmount = async () => {
    //unset listener for receipt
    this.props.unlistenReceipt(this.props.receipt.id)
    //remove window listener
    window.removeEventListener('resize', this.setWindowWidth)
  }

  render() {
    const { receipt } = this.props
    const { showMenu, windowWidth } = this.state
    if (!receipt.id) {
      return null
    } else if (receipt.id === 'DNE') {
      return 'Receipt does not exist or has been deleted.'
    } else
      return (
        <div id='receipt-edit'>
          <ReceiptHeader
            showMenu={showMenu}
            b1Src='/images/menu.svg'
            b1Click={this.toggleMenu}
            // b2Src='/images/add.svg'
            // b2Click={() => this.switchView('add')}
          />

          <div id='receipt-body'>
            <div
              id='receipt-left'
              className={`${showMenu ? '' : 'hide-menu'}`}
              style={
                !showMenu
                  ? { transform: `translateX(-${windowWidth}px)` }
                  : null
              }>
              <ReceiptAmountsPanel receipt={receipt} />
            </div>

            <div id='receipt-right'>
              <br />
              Receipt Items
              <p style={{ margin: '0', fontSize: '0.9em', color: '#7f7f7f' }}>
                total: $
                {Object.keys(receipt.rows)
                  .map(rowIdx => receipt.rows[rowIdx].deletePending ? 0 : Number(receipt.rows[rowIdx].cost))
                  .reduce((a, b) => a + b)}
              </p>
              <ItemsList />
            </div>
          </div>
        </div>
      )
  }
}

const mapState = state => ({
  receipt: state.receipts.selected,
})

const mapDispatch = dispatch => ({
  listenReceipt: RID => dispatch(listenReceipt(RID)),
  unlistenReceipt: RID => dispatch(unlistenReceipt(RID)),
})

export default connect(
  mapState,
  mapDispatch
)(EditReceipt)
