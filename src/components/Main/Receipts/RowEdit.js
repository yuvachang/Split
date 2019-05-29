import React, { Component } from 'react'

class RowEdit extends Component {
  state = {
    cost: '',
    delete: false,
    item: '',
    users: [],
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  componentDidMount = () => {
    this.setState({
      ...this.props.row,
    })
  }

  render() {
    const { row } = this.props
    return (
      <div className='grid-container'>
        <div className='editbutton'>
          {row.edit ? (
            row.edit
          ) : (
            <img src='/images/edit.svg' className='icon' />
          )}
        </div>
        <div className='item'>
          <input
            name='item'
            value={this.state.item}
            onChange={this.handleChange}
          />
        </div>
        <div className='cost'>
          <input
            name='cost'
            value={this.state.cost}
            onChange={this.handleChange}
          />
        </div>
        <div className='users'>
          
            <ul className='comma-list'>
              {row.users.map(user => (
                <li>{user.displayName}</li>
              ))}
            </ul>
          
        </div>
        <div className='deletebutton'>
          {row.delete ? (
            row.delete
          ) : (
            <img src='/images/trash.svg' className='icon' />
          )}
        </div>
      </div>
    )
  }
}

export default RowEdit
