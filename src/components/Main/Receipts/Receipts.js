import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchReceipts,
  selectReceipt,
} from '../../../store/actions/receiptsActions'
import SingleReceipt from './SingleReceipt'
import TopMenu from '../Elements/TopMenu'
import CardList from '../Elements/CardList'
import AddReceiptPage from './AddReceiptPage'

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

  componentDidUpdate = async prevProps => {
    if (prevProps.receipts.length !== this.props.receipts.length) {
      await this.setState({
        receipts: this.props.receipts,
      })
    }
  }

  componentDidMount = async () => {
    await this.props.fetchReceipts(this.props.currentUID)

    // set receipts to state to allow indexing for local filtering
    await this.setState({
      receipts: this.props.receipts,
    })
  }

  render() {
    const { currentUID, fetchReceipts } = this.props
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
        {view === 'add' && <AddReceiptPage />}

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
              backToList={() => this.switchView('list')}
              fetchReceipts={() => fetchReceipts(currentUID)}
            />
          </div>
        )}
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  receipts: state.receipts.receipts,
})

const mapDispatch = dispatch => ({
  fetchReceipts: uid => dispatch(fetchReceipts(uid)),
  selectReceipt: RID => dispatch(selectReceipt(RID)),
})

export default connect(
  mapState,
  mapDispatch
)(Receipts)
