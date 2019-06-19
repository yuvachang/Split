import React, { Component } from 'react'

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
      const newUsrAmt = this.props.userAmount
      newUsrAmt.paid = parseFloat(this.state.inputValue.toFixed(2))
      await this.props.updateUserAmt(newUsrAmt)
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
    if (
      this.state.open &&
      !this.menu.contains(e.target) &&
      !e.target.className.includes('scrollArrowID')
    ) {
      this.toggleDropdown('close')
    }
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
    let minHeight = 135
    if (Object.keys(debt).length) {
      minHeight += Object.keys(debt).length * 17 + 10
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

  componentDidUpdate = async prevProps => {
    if (prevProps !== this.props) {
      console.log('UserAmountDropdown updated', this.props.userAmount.id)
      await this.updateInputValue()
      this.setMinHeight()
    }
  }

  componentDidMount = async () => {
    this.setMinHeight()
    document.addEventListener('mousedown', this.clickListener)
    console.log('UserAmountDropdown mounted')
    await this.updateInputValue()
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.clickListener)
  }

  render() {
    const { userAmount } = this.props
    // const {
    //   name,
    //   amount,
    //   items,
    //   isPayer,
    //   paid,
    //   debt,
    //   owe,
    //   percentageOfTotal,
    // } = userAmount
    const { open, minHeight, isEdit, inputValue } = this.state
    return (
      <div
        className={`usr-amt-card container ${open ? 'open' : ''} `}
        ref={node => (this.menu = node)}
        style={open ? { minHeight } : null}>
        <div
          className='usr-amt-card color-bar'
          style={{ backgroundColor: userAmount.color || 'blue',
            border: `1px solid ${userAmount.color}`
        }}
        />
        <div className='usr-amt-card rows'>
          <div className='usr-amt-card row'>
            <div className='usr-amt-card name'>{userAmount.name}</div>

            <div className='usr-amt-card amount'>${userAmount.amount}</div>
            <img
              alt='open/close'
              onClick={this.toggleDropdown}
              src='/images/down-arrow.svg'
              className={
                open ? 'icon right grey upsidedown' : 'icon right grey'
              }
              style={{ right: '-25px' }}
            />
          </div>

          <div className='usr-amt-card row'>
            <div className='usr-amt-card name'>
              <div className='row-bullet' />
              Paid
              {String(userAmount.paid).length > 4 && <br />}
              (towards total)
            </div>

            {isEdit ? (
              <input
                className='outline-only'
                style={{ maxWidth: '75px' }}
                value={Number(inputValue).toString()}
                type='number'
                onChange={this.handleChange}
              />
            ) : (
              <div className='usr-amt-card amount'>${userAmount.paid}</div>
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

          <div className='usr-amt-card row'>
            <div className='usr-amt-card name'>
              <div className='row-bullet' />
              Owes
            </div>

            <div className='usr-amt-card amount'>${userAmount.owe}</div>
          </div>

          {/* {Object.keys(userAmount.debt)[0] && ( */}
          <div className='usr-amt-card footer'>
            {Object.keys(userAmount.debt).map(userId => {
              return (
                <p key={userId}>
                  Pay {userAmount.debt[userId].name} $
                  {userAmount.debt[userId].amount}.
                </p>
              )
            })}
          </div>
          {/* )} */}
        </div>
      </div>
    )
  }
}

export default UserAmountDropdown
