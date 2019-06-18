import React, { Component } from 'react'
import { connect } from 'react-redux'
import CreateReceipt from './CreateReceipt'
import {
  fetchReceipts,
  selectReceipt,
} from '../../../store/actions/receiptsActions'
import SingleReceipt from './SingleReceipt'
import TopMenu from '../Elements/TopMenu'
import CardList from '../Elements/CardList'

class Receipts extends Component {
  state = {
    view: 'list',
    receipts: [],
    searchInput: '',
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

  filterReceipts = (input, receiptsDataArr) =>
    receiptsDataArr.filter(friend =>
      friend.displayName.toLowerCase().includes(input.toLowerCase())
    )

  search = async e => {
    if (e.target.value.length > 0) {
      const results = this.filterReceipts(e.target.value, this.props.receipts)
      await this.setState({ receipts: results, searchInput: e.target.value })
    } else {
      await this.setState({ receipts: this.props.receipts, searchInput: '' })
    }
  }

  componentDidMount = async () => {
    await this.props.fetchReceipts(this.props.currentUID)

    await this.setState({
      receipts: this.props.receipts,
    })
  }

  render() {
    const { history, currentUID, fetchReceipts } = this.props
    const { view, receipts, searchInput } = this.state
    return (
      <div id='receipts'>
        <TopMenu
          view={view}
          searchPlaceholder='Receipt name...'
          search={this.search}
          b1Src='/images/list.svg'
          b1Click={() => this.switchView('list')}
          b2Src='/images/add.svg'
          b2Click={() => this.switchView('add')}
        />

        {view === 'add' && (
          <div>
            <br /> Create a receipt:
          </div>
        )}
        {view === 'add' && <CreateReceipt history={history} />}

        {view === 'list' && (
          <div>
            <br />
            {searchInput ? `Searching for '${searchInput}':` : 'Your receipts:'}
          </div>
        )}
        {view === 'list' &&
          (receipts.length ? (
            <CardList list={receipts} onClick={this.switchView} />
          ) : (
            'You have no receipts...'
          ))}

        {view === 'singleView' && (
          <div id='groups-list'>
            <SingleReceipt
              // receiptId={this.state.singleReceipt.id}
              backToList={() => this.switchView('list')}
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
  // loading: state.receipts.loading,
})

const mapDispatch = dispatch => ({
  fetchReceipts: uid => dispatch(fetchReceipts(uid)),
  selectReceipt: RID => dispatch(selectReceipt(RID)),
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
