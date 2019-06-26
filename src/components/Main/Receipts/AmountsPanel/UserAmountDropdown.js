import React, { Component } from 'react'
import { rdNum2, rdNum3 } from '../../../../store/actions/utilActions'

class UserAmountDropdown extends Component {
  state = {
    open: false,
    minHeight: 0,
    isEdit: false,
    inputValue: 0,
  }

  // input methods
  toggleEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    })
  }

  handleSave = async () => {
    if (this.state.inputValue !== this.props.userAmount.paid) {
      let usrAmt = this.props.userAmount
      let { inputValue } = this.state
      usrAmt.paid = rdNum3(inputValue)
      await this.props.updateUserAmt(usrAmt)
    }
  }

  handleChange = async e => {
    await this.setState({
      inputValue: Number(e.target.value),
    })
  }
  // end input methods

  toggleDropdown = action => {
    if (action === 'close') {
      if (this.props.userAmount.paid !== this.state.inputValue) {
        this.handleSave()
      }
      this.setState({
        open: false,
        isEdit: false,
      })
    } else if (action === 'open') {
      this.setState({ open: true })
    } else {
      const toggle = !this.state.open
      let isEdit = this.state.isEdit
      if (!toggle) {
        isEdit = false
      }
      this.setState({ open: toggle, isEdit })
    }
  }

  clickListener = e => {
    // if (
    //   this.state.open &&
    //   !this.menu.contains(e.target) &&
    //   !e.target.className.includes('scrollArrowID')
    // ) {
    //   this.toggleDropdown('close')
    // }
  }

  selectUser = user => {
    this.props.clickAction(user)
    this.setState({
      selected: user,
      open: false,
    })
  }

  removeSelected = () => {
    this.props.clearAction()
    this.setState({
      selected: {},
    })
  }

  setMinHeight = () => {
    const debt = this.props.userAmount.debt
    const numberOfDebts = Object.keys(debt).length
    let minHeight = 135
    if (numberOfDebts) {
      minHeight += numberOfDebts * 17 + 10
    }
    this.setState({
      minHeight,
    })
  }

  updateInputValue = async () => {
    await this.setState({
      inputValue: this.props.userAmount.paid,
    })
  }

  componentDidUpdate = async (prevProps, prevState) => {
    if (prevProps !== this.props) {
      // console.log('UserAmountDropdown updated')
      if (this.state.inputValue !== this.props.userAmount.paid) {
        await this.updateInputValue()
      }
      await this.setMinHeight()
    }
  }

  componentDidMount = async () => {
    // console.log('UserAmountDropdown mounted')
    // document.addEventListener('mousedown', this.clickListener)
    await this.setMinHeight()
    await this.updateInputValue()
  }

  componentWillUnmount = () => {
    // document.removeEventListener('mousedown', this.clickListener)
  }

  render() {
    const { userAmount, receipt } = this.props
    const { open, minHeight, isEdit, inputValue } = this.state
    const userItemCount = Object.keys(userAmount.items).length
    return (
      <div
        className={`usr-amt-card container ${open ? 'open' : ''} `}
        ref={node => (this.menu = node)}
        style={open ? { minHeight } : null}>
        <div
          className='usr-amt-card color-bar'
          style={{
            backgroundColor: userAmount.color || 'blue',
            border: `1px solid ${userAmount.color}`,
          }}
        />

        <div className='usr-amt-card rows'>
          {/* TOP ROW */}
          <div className='usr-amt-card row'>
            <div
              className='usr-amt-card name'
              style={{ display: 'block', textAlign: 'left' }}>
              {userAmount.name}
              <br />
              <p>{`${userItemCount} item${userItemCount === 1 ? '' : 's'}`}</p>
            </div>

            <div className='usr-amt-card amount'>${userAmount.amount}</div>
            <img
              alt='open/close'
              onClick={this.toggleDropdown}
              src='/images/down-arrow.png'
              className={`icon right grey ${open ? 'upsidedown' : ''}`}
              style={{ right: '-25px', width: '24px', height: '18px' }}
            />
          </div>

          {/* PAID */}
          <div className='usr-amt-card row'>
            <div className='usr-amt-card name'>
              <div className='row-bullet' />
              Paid
              <p style={{ marginLeft: '4px' }}>(towards total)</p>
            </div>

            {isEdit ? (
              <input
                className='outline-only'
                style={{ maxWidth: '75px' }}
                value={Number(inputValue).toString()}
                type='number'
                onChange={this.handleChange}
                onBlur={() => {
                  this.handleSave()
                  this.toggleEdit()
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.target.blur()
                  }
                }}
              />
            ) : (
              <div className='usr-amt-card amount'>
                ${rdNum2(userAmount.paid)}
              </div>
            )}

            {isEdit ? (
              <img
                src='/images/save.svg'
                alt='save icon'
                className='icon grey right'
                onClick={async () => {
                  await this.handleSave()
                  this.toggleEdit()
                }}
                style={{ right: '-25px' }}
              />
            ) : (
              <img
                src='/images/edit.svg'
                alt='edit icon'
                className='icon grey right'
                onClick={this.toggleEdit}
                style={{ right: '-25px', borderRadius: '0', width: '17px' }}
              />
            )}
          </div>

          {/* OWES */}
          <div className='usr-amt-card row'>
            <div className='usr-amt-card name'>
              <div className='row-bullet' />
              Owes
            </div>

            <div className='usr-amt-card amount'>${rdNum2(userAmount.owe)}</div>
          </div>

          {/* DEBTS */}
          <div className='usr-amt-card footer'>
            {Object.keys(userAmount.debt).map(userId => {
              return (
                <p key={userId} style={{ color: '#595959' }}>
                  Pay {receipt.userAmounts[userId].name} $
                  {userAmount.debt[userId].toFixed(2)}
                </p>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default UserAmountDropdown
