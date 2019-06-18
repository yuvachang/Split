import React, { Component } from 'react'

class ClearableInput extends Component {
  state = {
    selected: {},
    open: false,
    filteredGroups: [],
    inputClearable: false,
  }

  clearInput = async () => {
    this.searchInput.value = ''

    await this.setState({
      inputClearable: false,
    })
  }

  handleChange = async e => {
    if (e.target.value.length>0) {
      await this.setState({
        inputClearable: true
      })
    } else {
      await this.setState({
        inputClearable: false
      })
    }
  }

  componentDidMount = async () => {
    document.addEventListener('mousedown', this.clickListener)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.clickListener)
  }

  render() {
    const {
      readOnly,
      style,
      className,
      placeholder,
      type,
      required,
      value,
      name,
      onChange,
      iconSrc,
    } = this.props
    return (
      <div className='search-div' style={{ border: 'none' }}>
        {iconSrc && <img src={iconSrc} className='icon grey' />}
        <input
          ref={node => (this.searchInput = node)}
          name={name}
          value={value}
          required={required}
          style={style}
          readOnly={readOnly}
          className={className}
          placeholder={placeholder}
          type={type}
          onChange={() => {
            this.handleChange()
            onChange()
          }}
          autoCapitalize='off'
          autoComplete='off'
        />
        {inputClearable && (
          <img
            src='/images/remove.svg'
            className='icon grey left'
            style={{ transform: 'translateX(-8px)' }}
            onClick={this.clearInput}
          />
        )}
      </div>
    )
  }
}

export default ClearableInput
