import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '../Elements/Modal'
import ListItem from '../Elements/ListItem'
import FadingScroll from '../Elements/FadingScroll'
import { fetchGroups, selectGroup } from '../../../store/actions/groupsActions'
import {
  fetchReceipts,
  createReceipt,
} from '../../../store/actions/receiptsActions'
import DropDownList from '../Elements/DropDownList'

class CreateReceipt extends Component {
  state = {
    rows: 0,
    groupId: null,
    payer: {},
    receiptName: '',
    error: null,
    // group: {}/
  }

  handleSubmit = async e => {
    e.preventDefault()

    if (!this.state.payer || !this.state.groupId) return

    const newReceipt = await this.props.createReceipt(this.state)

    // await this.setState({
    //   rows: 0,
    //   groupId: null,
    //   payer: {},
    //   error: null,
    // })

    // console.log(newReceipt.id, this.props.history)

    this.props.history.push(`/receipts/${newReceipt.id}`)
  }

  selectGroup = async group => {
    await this.props.selectGroup(group.id)

    this.setState({
      groupId: this.props.selectedGroup.id,
    })
  }

  selectPayer = async person => {
    this.setState({
      payer: person,
    })
  }

  handleChange = async e => {
    if (e.target.name === 'rows' && e.target.value.length > 2) {
      let valueSlice = e.target.value.slice(0, 2)
      await this.setState({
        [e.target.name]: valueSlice,
      })
    } else {
      await this.setState({
        [e.target.name]: e.target.value,
      })
    }
  }

  componentDidMount = async () => {
    await this.props.fetchGroups(this.props.currentUID)
  }

  render() {
    const { friends, groups, fetchGroups, loading, selectedGroup } = this.props
    const { payer } = this.state
    return (
      <div id='groups-add'>
        {/* <Modal
          display={displayModal}
          header='Confirm Add Friend'
          message={'friend details here'}
          yes='Yes'
          yesAction={async () => {}}
          cancel={this.closeModal}
        /> */}
        <FadingScroll>
          {loading && <h3>Saving...</h3>}

          {this.state.error && (
            <ListItem content={{ error: this.state.error }} error={true} />
          )}

          <DropDownList
            listContent={groups}
            message={'Select a group.'}
            clickAction={this.selectGroup}
            selected={selectedGroup.id ? selectedGroup.groupName : null}
          />

          {selectedGroup.id ? (
            <div>
              {/* <p>
                <b>Selected Group: </b>
              </p>
              {selectedGroup.groupName} */}
              {/* <p>
                <b>Members: </b>
              </p> */}
              <ul className='comma-list'>
                {selectedGroup.members.map(member => (
                  <li key={member.email}>{member.displayName}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <br />
          <DropDownList
            listContent={selectedGroup.id ? selectedGroup.members : []}
            message={'Who paid the bill?'}
            clickAction={this.selectPayer}
            selected={payer ? payer.displayName : null}
          />
          <br />

          <form onSubmit={this.handleSubmit}>
            <label>Name:</label>
            <input
              type='text'
              required={true}
              value={this.state.receiptName}
              name='receiptName'
              onChange={this.handleChange}
            />
            <label>Total number of items:</label>
            <input
              type='number'
              min='1'
              max='55'
              value={this.state.rows}
              name='rows'
              onChange={this.handleChange}
            />
            <button type='submit'>Create Receipt</button>
          </form>
        </FadingScroll>
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  currentEmail: state.firebase.auth.email,
  receipts: state.receipts.receipts,
  loading: state.receipts.loading,
  beingCreated: state.receipts.beingCreated,
  groups: state.groups.groups,
  selectedGroup: state.groups.selected,
})

const mapDispatch = dispatch => ({
  createReceipt: data => dispatch(createReceipt(data)),
  fetchReceipts: uid => dispatch(fetchReceipts(uid)),
  fetchGroups: uid => dispatch(fetchGroups(uid)),
  selectGroup: gid => dispatch(selectGroup(gid)),
})

export default connect(
  mapState,
  mapDispatch
)(CreateReceipt)
