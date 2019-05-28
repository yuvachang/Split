import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {firestoreConnect} from 'react-redux-firebase'

class EditReceipt extends Component {
  componentDidMount = () => {}

  render() {
    console.log(this.props.history)
    return(
      <div>
        edit receipt component
        </div>
    )
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
})

export default compose(
  firestoreConnect({
    collection: 'receipts',
  }),
  connect(
    mapState,
    mapDispatch
  ))(EditReceipt)

