import React, { Component } from 'react'
import { connect } from 'react-redux'
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
    rows: 1,
    groupId: null,
    payer: {},
    receiptName: '',
    error: null,
    date: {
      day: 1,
      month: 1,
      year: 2019,
    },
  }

  handleSubmit = async e => {
    e.preventDefault()
    const { year, month, day } = this.state.date

    // make sure payer and group selected
    if (!this.state.payer || !this.state.groupId) return

    // set and save date as UTC
    const created = new Date()

    const date = Number(
      `${year}${month.toString().padStart(2, '0')}${day
        .toString()
        .padStart(2, '0')}`
    )
    console.log(date)

    // // offset current date by timezone...
    // created.setTime( created.getTime() + created.getTimezoneOffset()*60*1000 )

    // create the receipt firestore instance
    const newReceipt = await this.props.createReceipt({...this.state, created})

    // redirect to view/edit receipt
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
    // restrict 'rows' input to only 2 char length
    if (e.target.name === 'rows' && e.target.value.length > 2) {
      let valueSlice = e.target.value.slice(0, 2)
      await this.setState({
        [e.target.name]: valueSlice,
      })
    } else {
      if (e.target.name.includes('date')) {
        let targetValue = e.target.value

        if (e.target.name !== 'date.year' && targetValue.length > 2) {
          targetValue = targetValue.slice(0, 2)
        }
        if (e.target.name === 'date.year' && targetValue.length > 4) {
          targetValue = targetValue.slice(0, 4)
        }

        this.setState({
          date: {
            ...this.state.date,
            [e.target.name.slice(5)]: targetValue,
          },
        })
      } else {
        await this.setState({
          [e.target.name]: e.target.value,
        })
      }
    }
  }

  componentDidMount = async () => {
    await this.props.fetchGroups(this.props.currentUID)

    //set today's date as default
    const today = new Date()
    this.setState({
      date: {
        day: today.getDate(),
        month: today.getMonth() + 1,
        year: today.getFullYear(),
      },
    })
  }

  render() {
    const { groups, loading, selectedGroup } = this.props
    const { payer } = this.state
    return (
      <div id='groups-add'>
      
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
              <ul className='comma-list'>
                Members:
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
            <label>Date (M/D/Y):</label>
            <div style={{ display: 'inherit' }}>
              <input
                title='Month'
                type='number'
                min='1'
                max='12'
                required={true}
                value={this.state.date.month}
                name='date.month'
                onChange={this.handleChange}
              />
              <input
                title='Day'
                type='number'
                min='1'
                max='31'
                required={true}
                value={this.state.date.day}
                name='date.day'
                onChange={this.handleChange}
              />
              <input
                title='Year'
                type='number'
                min='1950'
                max='9999'
                required={true}
                value={this.state.date.year}
                name='date.year'
                onChange={this.handleChange}
              />
            </div>

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
  loading: state.receipts.loading,
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
