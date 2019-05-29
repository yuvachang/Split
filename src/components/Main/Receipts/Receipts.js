import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateReceipt from './CreateReceipt'
import { fetchReceipts, selectReceipt } from '../../../store/actions/receiptsActions'
import ListPage from '../Elements/ListPage';
import SingleReceipt from './SingleReceipt';

class Receipts extends Component {
  state = {
    view: 'list',
    // singleReceipt: {},
  }

  switchView = async (view, receipt) => {
    if (receipt) {
      await this.props.selectReceipt(receipt.id)
      await this.setState({
        // singleReceipt: receipt,
        view: 'singleView',
      })
    } else {
      this.setState({ view })
    }
  }

  render() {
    const { receipts, history, currentUID, fetchReceipts } = this.props
    const { view, singleReceipt } = this.state
    return (
      <div id='receipts'>
        <div className='views'>
          <div
            className={
              view === 'list' ? 'button-icon selected' : 'button-icon'
            }>
            <img
              src='./images/receipts.svg'
              className='icon large'
              onClick={() => {
                this.switchView('list')
              }}
            />
          </div>
          <div
            className={view === 'add' ? 'button-icon selected' : 'button-icon'}>
            <img
              src='./images/add.svg'
              className='icon large'
              onClick={() => this.switchView('add')}
            />
          </div>
        </div>
        <hr />
        <br />
        {view === 'add' && <CreateReceipt history={history} />}

        {view === 'list' && (
          <ListPage
            receipts={receipts}
            fetchReceipts={() => fetchReceipts(currentUID)}
            viewItem={this.switchView}
          />
        )}

        {view === 'singleView' && (
          <div id='groups-list'>
            <SingleReceipt
              // receiptId={this.state.singleReceipt.id}
              // backToList={() => this.switchView('list')}
              // group={singleReceipt}
              // deleteGroup={deleteGroup}
              // loading={loading}
            />
          </div>
        )}
      </div>
    )

    return null
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  receipts: state.receipts.receipts,
  loading: state.receipts.loading,
})

const mapDispatch = dispatch => ({
  fetchReceipts: uid => dispatch(fetchReceipts(uid)),
  selectReceipt: RID => dispatch(selectReceipt(RID))
  // createGroup: (group, uid) => dispatch(createGroup(group, uid)),
  // fetchFriends: uid => dispatch(fetchFriends(uid)),
  // createGroupInProgress: group => dispatch(createGroupInProgress(group)),
  // deleteGroup: groupId => dispatch(deleteGroup(groupId)),
})

export default connect(
  mapState,
  mapDispatch
)(Receipts)

// export default Receipts
