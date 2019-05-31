import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  listenReceipt,
  unlistenReceipt,
} from '../../../store/actions/receiptsActions'
import FadingScroll from '../Elements/FadingScroll'
import Row from './Row'

class SingleReceipt extends Component {
  componentDidMount = async () => {}

  render() {
    if (!this.props.receipt.id) {
      return <h3>Error: No receipt selected.</h3>
    } else {
      const { receipt } = this.props
      return (
        <FadingScroll>
          <div style={{ margin: '3px 0px' }}>
            Receipt: {receipt.receiptName}
            <Link to={`/receipts/${receipt.id}`}>
              <img src='./images/edit.svg' className='icon' />
            </Link>
            <br />
            Group: {receipt.group.groupName}
            <br />
            <ul className='comma-list'>
              Members:
              {Object.keys(receipt.userAmounts).map(userId => (
                <li key={userId}>{receipt.userAmounts[userId].name}</li>
              ))}
            </ul>
          </div>
          Items:
          <ul style={{ listStyleType: 'none', width: '100%', margin: '0' }}>
            {Object.keys(receipt.rows).map(rowIdx => {
              return (
                <li key={rowIdx} style={{ margin: '3px 0px' }}>
                  Item: {receipt.rows[rowIdx].item ? receipt.rows[rowIdx].item : 'n/a'}, Cost: ${' '}
                  {receipt.rows[rowIdx].cost ? receipt.rows[rowIdx].cost : 'n/a'}, Users:{' '}
                  {!receipt.rows[rowIdx].users[0]
                    ? 'n/a'
                    : receipt.rows[rowIdx].users.map(user => user.displayName)}
                </li>
              )
            })}
          </ul>
        </FadingScroll>
      )
    }
  }
}

const mapState = state => ({
  receipt: state.receipts.selected,

  // currentUID: state.firebase.auth.uid,
  // loading: state.receipts.loading,
  // groups: state.groups.groups,
  // selectedGroup: state.groups.selected,
})

const mapDispatch = dispatch => ({
  // createReceipt: data => dispatch(createReceipt(data)),
  // fetchReceipts: uid => dispatch(fetchReceipts(uid)),
  // fetchGroups: uid => dispatch(fetchGroups(uid)),
  // selectGroup: gid => dispatch(selectGroup(gid)),
  // listenReceipt: RID => dispatch(listenReceipt(RID)),
  // unlistenReceipt: RID => dispatch(unlistenReceipt(RID)),
})

export default connect(
  mapState,
  mapDispatch
)(SingleReceipt)
