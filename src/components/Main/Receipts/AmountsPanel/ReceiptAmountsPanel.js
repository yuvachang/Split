import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  updateReceipt,
  updateUserAmounts,
} from '../../../../store/actions/receiptsActions'
import ScrollContainer from '../../Elements/ScrollContainer'
import UserAmountDropdown from './UserAmountDropdown'
import AmountsCard from './AmountsCard'

class ReceiptAmountsPanel extends Component {
  state = { totalPaid: 0 }

  updateUserAmt = async usrAmt => {
    let userAmounts = this.props.receipt.userAmounts
    if (usrAmt) {
      userAmounts[usrAmt.id] = usrAmt
    }
    await this.props.updateUserAmounts(userAmounts, this.props.receipt.id)
  }

  handleEditAmount = async (value, field) => {
    await this.props.updateReceipt(field, value, this.props.receipt.id)
  }

  setColors = async () => {
    const usrAmts = { ...this.props.receipt.userAmounts }
    const userIds = Object.keys(usrAmts)

    if (userIds.filter(userId => !usrAmts[userId].color).length) {
      console.log('setting user colors')
      let hslIncrement = 360 / userIds.length
      userIds.forEach(userId => {
        usrAmts[userId].color =
          'hsla(' + Math.floor(hslIncrement % 360) + ', 90%, 60%,1)'
        hslIncrement += 360 / userIds.length
      })
      console.log('ReceiptAmountsPanel.setColors(): usrAmts', usrAmts)
      await this.props.updateUserAmounts(usrAmts, this.props.receipt.id)
    }
  }

  setTotalPaid = async () => {
    const { receipt } = this.props
    const { userAmounts } = receipt
    const totalPaid = Object.keys(userAmounts)
      .map(uid => (userAmounts[uid].paid ? Number(userAmounts[uid].paid) : 0))
      .reduce((a, b) => a + b)
    await this.setState({
      totalPaid,
    })
  }

  componentDidUpdate = async prevProps => {
    if (prevProps !== this.props) {
      console.log('componentDidUpdate receiptAmountsPanel')
      await this.setTotalPaid()
    }
  }

  componentDidMount = async () => {
    console.log('componentdidmount receiptAmountPanel')
    await this.setColors()
    await this.setTotalPaid()
  }

  componentWillUnmount = async () => {}

  render() {
    const { receipt } = this.props
    const { userAmounts } = receipt
    const { totalPaid } = this.state

    if (!receipt.id) {
      return null
    } else if (receipt.id === 'DNE') {
      return 'Receipt does not exist or has been deleted.'
    } else
      return (
        <div id='amounts-panel'>
          <br />
          {receipt.receiptName}
          <br />
          <ScrollContainer showButtons={true}>
            <AmountsCard
              label='Subtotal'
              amount={receipt.subtotal}
              handleEditAmount={val => this.handleEditAmount(val, 'subtotal')}
              allowEdit={true}
              style={{
                maxHeight: '30px',
                minHeight: '30px',
              }}
            />
            <AmountsCard
              label='Tip'
              amount={receipt.tip}
              handleEditAmount={val => this.handleEditAmount(val, 'tip')}
              allowEdit={true}
            />
            <AmountsCard
              label='Total'
              amount={receipt.total}
              handleEditAmount={val => this.handleEditAmount(val, 'total')}
              allowEdit={
                receipt.subtotal !== 0 || receipt.tip !== 0 ? false : true
              }
            />
            <AmountsCard
              label='Amount paid'
              amount={totalPaid}
              handleEditAmount={val => this.handleEditAmount(val, 'subtotal')}
              allowEdit={false}
            />

            <br />
            {Object.keys(userAmounts).map(userId => (
              <UserAmountDropdown
                key={userId}
                receipt={receipt}
                updateUserAmt={this.updateUserAmt}
                userAmount={userAmounts[userId]}
              />
            ))}
          </ScrollContainer>
        </div>
      )
  }
}

const mapState = state => ({})

const mapDispatch = dispatch => ({
  updateReceipt: (field, value, receiptId) =>
    dispatch(updateReceipt(field, value, receiptId)),
  updateUserAmounts: (usrAmts, receiptId) =>
    dispatch(updateUserAmounts(usrAmts, receiptId)),
})

export default connect(
  mapState,
  mapDispatch
)(ReceiptAmountsPanel)
