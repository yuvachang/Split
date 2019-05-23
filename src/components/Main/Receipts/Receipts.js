import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateReceipt from './CreateReceipt'
import ReceiptsList from './ReceiptsList'
import {} from '../../../store/actions/receiptsActions'

class Receipts extends Component {
  state = {
    view: 'list',
    singleReceipt: {},
  }

  switchView = (view, receipt) => {
    if (receipt) {
      this.setState({
        singleReceipt: receipt,
        view: 'singleView',
      })
    } else {
      this.setState({ view })
    }
  }

  render() {
    const { receipts } = this.props
    const { view, singleReceipt } = this.state

    // return (
    //   <div id='receipts'>
    //     <div className='views'>
    //       <div
    //         className={
    //           view === 'list' ? 'button-icon selected' : 'button-icon'
    //         }>
    //         <img
    //           src='./images/receipts.png'
    //           className='icon large'
    //           onClick={() => {
    //             this.switchView('list')
    //           }}
    //         />
    //       </div>
    //       <div
    //         className={view === 'add' ? 'button-icon selected' : 'button-icon'}>
    //         <img
    //           src='./images/add.svg'
    //           className='icon large'
    //           onClick={() => this.switchView('add')}
    //         />
    //       </div>
    //     </div>
    //     <hr />
    //     <br />
    //     {view === 'add' && <CreateReceipt />}

    //     {view === 'list' && (
    //       <ReceiptsList
    //         receipts={receipts}
    //         fetchReceipts={() => fetchReceipts(currentUID)}
    //         viewItem={this.switchView}
    //       />
    //     )}

    //     {view === 'singleView' && (
    //       <div id='groups-list'>
    //         <SingleGroup
    //           backToList={() => this.switchView('list')}
    //           group={singleReceipt}
    //           deleteGroup={deleteGroup}
    //           loading={loading}
    //         />
    //       </div>
    //     )}
    //   </div>
    // )

    return null
  }
}

// const mapState = state => ({
//   currentUID: state.firebase.auth.uid,
//   currentEmail: state.firebase.auth.email,
//   receipts: state.receipts.receipts,
//   loading: state.receipts.loading,
//   beingCreated: state.receipts.beingCreated,
// })

// const mapDispatch = dispatch => ({
//   fetchReceipts: uid => dispatch(fetchReceipts(uid)),
//   createGroup: (group, uid) => dispatch(createGroup(group, uid)),
//   fetchFriends: uid => dispatch(fetchFriends(uid)),
//   createGroupInProgress: group => dispatch(createGroupInProgress(group)),
//   deleteGroup: groupId => dispatch(deleteGroup(groupId)),
// })

// export default connect(
//   mapState,
//   mapDispatch
// )(Receipts)

export default Receipts
