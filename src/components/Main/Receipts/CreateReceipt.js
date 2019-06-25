import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchGroups,
  selectGroup,
  deselectGroup,
} from '../../../store/actions/groupsActions'
import {
  fetchReceipts,
  createReceipt,
} from '../../../store/actions/receiptsActions'
import ScrollContainer from '../Elements/ScrollContainer'
import SelectGroupDropdown from '../Groups/SelectGroupDropdown'
import SelectUserDropdown from '../Elements/SelectUserDropdown'

class CreateReceipt extends Component {
  state = {
    selectedGroup: {},

    error: null,

    formData: {
      subtotal: 0,
      tip: 0,
      total: 0,

      rows: 1,
      groupId: null,
      payer: {},
      receiptName: '',
      date: {
        day: 1,
        month: 1,
        year: 2019,
      },
    },
  }

  handleSubmit = async e => {
    e.preventDefault()
    // const { year, month, day } = this.state.date

    // make sure payer and group selected
    if (
      // !this.state.formData.payer ||
      !this.state.formData.groupId
    )
      return

    // set and save date as UTC
    const created = new Date()

    // const date = Number(
    //   `${year}${month.toString().padStart(2, '0')}${day
    //     .toString()
    //     .padStart(2, '0')}`
    // )

    // // offset current date by timezone...
    // created.setTime( created.getTime() + created.getTimezoneOffset()*60*1000 )

    // create the receipt firestore instance
    const newReceipt = await this.props.createReceipt({
      ...this.state.formData,
      created,
    })

    // redirect to view/edit receipt
    this.props.history.push(`/receipts/${newReceipt.id}`)
  }

  selectGroup = async group => {
    await this.props.selectGroup(group.id)

    await this.setState({
      formData: {
        ...this.state.formData,
        groupId: group.id,
      },
    })
  }

  deselectGroup = async () => {
    await this.props.deselectGroup()

    await this.setState({
      formData: {
        ...this.state.formData,
        groupId: '',
      },
    })
  }

  selectPayer = async person => {
    await this.setState({
      formData: {
        ...this.state.formData,
        payer: person,
      },
    })
  }

  deselectPayer = async () => {
    await this.setState({
      formData: {
        ...this.state.formData,
        payer: {},
      },
    })
  }

  handleChange = async e => {
    // restrict 'rows' input to only 2 char length
    if (e.target.name === 'rows' && e.target.value.length > 2) {
      let valueSlice = e.target.value.slice(0, 2)
      await this.setState({
        formData: {
          ...this.state.formData,
          [e.target.name]: valueSlice,
        },
      })
    } else if (e.target.type === 'number') {
      if (e.target.name.includes('date')) {
        let targetValue = e.target.value

        if (e.target.name !== 'date.year' && targetValue.length > 2) {
          targetValue = targetValue.slice(0, 2)
        }
        if (e.target.name === 'date.year' && targetValue.length > 4) {
          targetValue = targetValue.slice(0, 4)
        }

        await this.setState({
          formData: {
            ...this.state.formData,
            date: {
              ...this.state.formData.date,
              [e.target.name.slice(5)]: targetValue,
            },
          },
        })
      } else {
        let total = this.state.formData.total
        if (
          (e.target.name === 'tip' && this.state.formData.subtotal) ||
          e.target.name === 'subtotal'
        ) {
          const tarVal = Number(e.target.value)
          if (e.target.name === 'tip') {
            total =
              this.state.formData.subtotal +
              (this.state.formData.subtotal * tarVal) / 100
          } else {
            total = tarVal + (this.state.formData.tip / 100) * tarVal
          }
        } else if (e.target.name === 'total') {
          total = e.target.value
        }
        await this.setState({
          formData: {
            ...this.state.formData,
            [e.target.name]: Number(e.target.value),
            total,
          },
        })
      }
    } else {
      await this.setState({
        formData: {
          ...this.state.formData,
          [e.target.name]: e.target.value,
        },
      })
    }
  }

  checkDateOnBlur = async e => {
    const days31 = [1, 3, 5, 7, 8, 10, 12]
    const days30 = [4, 6, 9, 11]
    const { month, day } = this.state.formData.date

    let targetValue = Number(e.target.value)
    let newDay = 0

    if (e.target.name === 'date.month') {
      if (!targetValue || targetValue === 0) {
        targetValue = 1
      } else if (targetValue > 12) {
        targetValue = 12
      } else if (days30.includes(targetValue) && day > 30) {
        newDay = 30
      } else if (targetValue === 2 && day > 28) {
        newDay = 28
      }
    } else if (e.target.name === 'date.day') {
      if (!targetValue || targetValue === 0) {
        targetValue = 1
      } else if (days31.includes(month) && targetValue > 31) {
        targetValue = 31
      } else if (days30.includes(month) && targetValue > 30) {
        targetValue = 30
      } else if (month === 2 && targetValue > 28) {
        targetValue = 28
      }
    }

    if (newDay && e.target.name === 'date.month') {
      await this.setState({
        formData: {
          ...this.state.formData,
          date: {
            ...this.state.formData.date,
            [e.target.name.slice(5)]: targetValue,
            day: newDay,
          },
        },
      })
    } else {
      await this.setState({
        formData: {
          ...this.state.formData,
          date: {
            ...this.state.formData.date,
            [e.target.name.slice(5)]: targetValue,
          },
        },
      })
    }
  }

  componentDidMount = async () => {
    await this.props.fetchGroups(this.props.currentUID)

    //set today's date as default
    const today = new Date()
    this.setState({
      formData: {
        ...this.state.formData,
        date: {
          day: today.getDate(),
          month: today.getMonth() + 1,
          year: today.getFullYear(),
        },
      },
    })
  }

  render() {
    const { groups, loading, selectedGroup } = this.props
    const { payer, subtotal, tip, total, date } = this.state.formData
    return (
      <ScrollContainer showButtons={true}>
        {loading && <h3>Saving...</h3>}

        {this.state.error && `Error: ${this.state.error}`}

        <SelectGroupDropdown
          clickAction={this.selectGroup}
          groups={groups}
          clearAction={this.deselectGroup}
          placeholder={'Select a group...'}
        />

        <br />

        <SelectUserDropdown
          users={selectedGroup.members || []}
          clickAction={this.selectPayer}
          clearAction={this.deselectPayer}
          placeholder={
            selectedGroup.id ? 'Select payer...' : 'Select a group first'
          }
        />

        <form onSubmit={this.handleSubmit} style={{ width: '75%' }}>
          <label>Receipt Name:</label>
          <input
            className='outline-only'
            placeholder='Receipt name'
            type='text'
            required={true}
            value={this.state.formData.receiptName}
            name='receiptName'
            onChange={this.handleChange}
          />
          <label>Subtotal:</label>
          <input
            className='outline-only'
            placeholder='Subtotal'
            type='number'
            value={Number(subtotal).toString()}
            name='subtotal'
            onChange={this.handleChange}
          />
          <label>Tip(%):</label>
          <input
            className='outline-only'
            placeholder='Tip(%):'
            type='number'
            value={Number(tip).toString()}
            name='tip'
            onChange={this.handleChange}
          />
          <label>Total:</label>
          <input
            readOnly={tip || subtotal ? true : false}
            style={tip || subtotal ? { color: '#7f7f7f' } : null}
            className='outline-only'
            placeholder='Total'
            type='number'
            required={true}
            value={Number(total).toString()}
            name='total'
            onChange={this.handleChange}
          />

          <label>Date (M/D/Y):</label>
          <div style={{ display: 'inherit' }}>
            <input
              className='outline-only'
              title='Month'
              type='number'
              min='1'
              max='12'
              required={true}
              onBlur={this.checkDateOnBlur}
              value={Number(date.month).toString()}
              name='date.month'
              onChange={this.handleChange}
            />
            <input
              className='outline-only'
              title='Day'
              type='number'
              min='1'
              max='31'
              required={true}
              onBlur={this.checkDateOnBlur}
              value={Number(date.day).toString()}
              name='date.day'
              onChange={this.handleChange}
            />
            <input
              className='outline-only'
              title='Year'
              type='number'
              min='1950'
              max='9999'
              required={true}
              value={date.year}
              name='date.year'
              onChange={this.handleChange}
            />
          </div>

          <label>Number of items:</label>
          <input
            className='outline-only'
            type='number'
            min='1'
            max='55'
            value={this.state.formData.rows}
            name='rows'
            onChange={this.handleChange}
          />
          <button
            className='button card'
            type='submit'
            style={{ width: '100%' }}>
            Create Receipt
          </button>
        </form>
      </ScrollContainer>
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
  deselectGroup: () => dispatch(deselectGroup()),
})

export default connect(
  mapState,
  mapDispatch
)(CreateReceipt)
