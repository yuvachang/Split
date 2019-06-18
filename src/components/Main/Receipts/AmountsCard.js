import React, { Component } from 'react'

class AmountsCard extends Component {
  state = {
    isEdit: false,
    inputValue: 0,
  }

  toggleEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    })
  }

  handleSave = async () => {
    if (this.state.inputValue !== this.props.amount) {
      await this.props.handleEditAmount(this.state.inputValue)
    }
  }

  handleChange = async e => {
    await this.setState({
      inputValue: e.target.value,
    })
  }

  componentDidMount = () => {
    this.setState({
      inputValue: this.props.amount,
    })
  }

  render() {
    const { label, amount, handleEditAmount, allowEdit } = this.props
    const { isEdit, inputValue } = this.state
    return (
      <div className={`usr-amt-card container`}>
        <div className='usr-amt-card rows'>
          <div className='usr-amt-card row'>
            <div className='usr-amt-card name'>{label}</div>

            {isEdit ? (
              <input
                className='outline-only'
                style={{maxWidth:'100px'}}
                value={Number(inputValue).toString()}
                type='number'
                onChange={this.handleChange}
              />
            ) : label === 'Tip' ? (
              <div className='usr-amt-card amount'>{amount}%</div>
            ) : (
              <div className='usr-amt-card amount'>${amount}</div>
            )}

            {allowEdit ? (
              isEdit ? (
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
              )
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

export default AmountsCard
