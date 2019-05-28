import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import {
  listenReceipt,
  unlistenReceipt,
} from '../../../store/actions/receiptsActions'

class SingleReceipt extends Component {
  componentDidMount = async () => {
    //set listener on receipt
    this.props.listenReceipt(this.props.receiptId)
  }

  componentWillUnmount = async () => {
    //unset listener for receipt
    this.props.unlistenReceipt(this.props.receiptId)
  }

  render() {
    return <div>single receipt component</div>
  }
}

const mapState = state => ({
  // receipt: state.firestore.data

  currentUID: state.firebase.auth.uid,
  loading: state.receipts.loading,
  groups: state.groups.groups,
  selectedGroup: state.groups.selected,
})

const mapDispatch = dispatch => ({
  // createReceipt: data => dispatch(createReceipt(data)),
  // fetchReceipts: uid => dispatch(fetchReceipts(uid)),
  // fetchGroups: uid => dispatch(fetchGroups(uid)),
  // selectGroup: gid => dispatch(selectGroup(gid)),
  listenReceipt: RID => dispatch(listenReceipt(RID)),
  unlistenReceipt: RID => dispatch(unlistenReceipt(RID)),
})

export default connect(
  mapState,
  mapDispatch
)(SingleReceipt)
