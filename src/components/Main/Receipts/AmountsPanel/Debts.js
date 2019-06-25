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

class Debts extends Component {
  state = {}

  componentDidUpdate = async prevProps => {
    // if (prevProps !== this.props) {
    //   // console.log('componentDidUpdate receiptAmountPanel')
    //   await this.setPayer()
    // }
  }

  calcDebts = async () => {
    const {
      id,
      name,
      color,
      amount,
      items,
      // paidTotal,
      paid,
      debt,
      owe,
      percentageOfTotal,
    } = this.props.userAmount

    const { subtotal, tip, total, userAmounts } = this.props.receipt

    const { userAmount } = this.props

    const userIds = Object.keys(userAmounts)
  

    // if (totalPayer) {
    //   //determine usrAmt.owe::::
    //   //check if self has amount
    //     //if yes, usrAmt.owe=self.amount
    //     //if no, check if anybody else has an amount
    //       //if yes, usrAmt.owe = (total - sum of other amounts)/# of people without amounts
    //       //if no, usrAmt.owe = total / total # of people
    //   //should be done during creation of receipt::
    //     //usrAmt.owe, usrAmt.

    //   const percentOfTotal = userAmount.amount / total
    //   userAmount.owe = percentOfTotal * total 
    // }
  }

  componentDidMount = async () => {
    // calculate user debts, update db with new user debts
    await this.calcDebts()
  }

  componentWillUnmount = async () => {}

  render() {
    const { receipt, userAmount } = this.props
    const { payer, showPanel } = this.state

    return (
      <div className='usr-amt-card footer'>
        {Object.keys(userAmount.debt).map(userId => {
          const usrAmt = userAmount.debt[userId]
          return (
            <p>
              Pay {usrAmt.name} ${usrAmt.amount}.
            </p>
          )
        })}
      </div>
    )
  }
}

const mapState = state => ({
  receipt: state.receipts.selected,
})

const mapDispatch = dispatch => ({
  // updateReceipt: (field, value, receiptId) =>
  //   dispatch(updateReceipt(field, value, receiptId)),
  // updateSingleUserAmount: (userId, usrAmt, receiptId) =>
  //   dispatch(updateSingleUserAmount(userId, usrAmt, receiptId)),
  // updateUserAmounts: (usrAmts, receiptId) =>
  //   dispatch(updateUserAmounts(usrAmts, receiptId)),
})

export default connect(
  mapState,
  mapDispatch
)(Debts)
