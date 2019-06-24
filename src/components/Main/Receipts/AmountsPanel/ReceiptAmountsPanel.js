import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  updateSingleUserAmount,
  updateReceipt,
  updateUserAmounts,
} from '../../../../store/actions/receiptsActions'
import ScrollContainer from '../../Elements/ScrollContainer'
import UserAmountDropdown from './UserAmountDropdown'
import AmountsCard from './AmountsCard'

class ReceiptAmountsPanel extends Component {
  state = {
    payer: {},
    showPanel: false,
  }

  updateUserAmt = async usrAmt => {
    // calculate new debts with usrAmt.paid

    await this.props.updateSingleUserAmount(
      usrAmt.id,
      usrAmt,
      this.props.receipt.id
    )
  }

  setPayer = () => {
    const usrAmt = this.props.receipt.userAmounts
    const payerIdArr = Object.keys(usrAmt).filter(
      userId => usrAmt[userId].isPayer
    )
    if (payerIdArr.length) {
      const payer = usrAmt[payerIdArr[0]]
      this.setState({
        payer,
      })
    }
  }

  handleEditAmount = async (value, field) => {
    await this.props.updateReceipt(field, value, this.props.receipt.id)
  }

  resizeListener = () => {
    
  }

  setColors = async () => {
    const { userAmounts } = this.props.receipt
    const userIds = Object.keys(userAmounts)
    if (userIds.filter(userId => !userAmounts[userId].color).length) {
      let hslIncrement = 360 / userIds.length
      userIds.forEach(userId => {
        userAmounts[userId].color =
          'hsla(' + Math.floor(hslIncrement % 360) + ',' + '90%,' + '60%,1)'
        hslIncrement += 360 / userIds.length
      })
      await this.props.updateUserAmounts(userAmounts, this.props.receipt.id)
    }
  }

  componentDidUpdate = async prevProps => {
    if (prevProps !== this.props) {
      // console.log('componentDidUpdate receiptAmountPanel')
      await this.setPayer()
    }
  }

  componentDidMount = async () => {
    console.log('componentdidmount receiptAmountPanel')
    window.addEventListener('resize', this.clickListener)
    await this.setPayer()

    await this.setColors()
  }

  componentWillUnmount = async () => {}

  render() {
    const { receipt } = this.props
    const { payer, showPanel } = this.state
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
                receipt.subtotal != 0 || receipt.tip != 0 ? false : true
              }
            />
            <br />
            {payer.id && <p>Payer: {payer.name}</p>}
            {Object.keys(receipt.userAmounts).map(userId => (
              <UserAmountDropdown
                key={userId}
                updateUserAmt={this.updateUserAmt}
                userAmount={receipt.userAmounts[userId]}
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
  updateSingleUserAmount: (userId, usrAmt, receiptId) =>
    dispatch(updateSingleUserAmount(userId, usrAmt, receiptId)),
  updateUserAmounts: (usrAmts, receiptId) =>
    dispatch(updateUserAmounts(usrAmts, receiptId)),
})

export default connect(
  mapState,
  mapDispatch
)(ReceiptAmountsPanel)
