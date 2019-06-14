import React, { Component } from 'react'

class TopMenu extends Component {
  render() {
    const {
      view,
      searchPlaceholder,
      search,
      b1Src,
      b1Click,
      b2Src,
      b2Click,
    } = this.props
    return (
      <div className='menu'>
        <div className='menu-views'>
          <div
            className={`round-icon-button ${
              view === 'list' ? 'selected' : ''
            }`}
            onClick={b1Click}>
            <img
              src={b1Src}
              className='icon'
              style={view === 'list' ? {} : { filter: 'invert(0.4)' }}
            />
          </div>
        </div>

        <div className={view === 'list' ? 'search-div' : 'search-div hidden'}>
          <img src='./images/search.svg' className='icon grey' />
          <input
            className='textarea-only'
            placeholder={searchPlaceholder}
            type='text'
            onChange={search}
            autoCapitalize='off'
            autoComplete='off'
          />
        </div>

        <div className='menu-views'>
          <div
            className={`round-icon-button ${view === 'add' ? 'selected' : ''}`}
            onClick={b2Click}>
            <img
              src={b2Src}
              className='icon'
              style={view === 'add' ? {} : { filter: 'invert(0.4)' }}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default TopMenu
