import React, { Component } from 'react'

class TopMenu extends Component {
  render() {
    const {
      view,
      searchPlaceholder,
      // dbSearchPlaceholder,
      search,
      // dbSearch,
      b1Src,
      b1Click,
      b2Src,
      b2Click,
      b3Src,
      b3Click,
    } = this.props
    return (
      <div className='menu'>
        <div className='menu-views'>
          <div
            className={`round-icon-button ${view === 'list' ? 'selected' : ''}`}
            onClick={b1Click}>
            <img
              src={b1Src}
              className='icon'
              style={view === 'list' ? {} : { filter: 'invert(0.4)' }}
            />
          </div>
        </div>

        <div
          className={
            view === 'list' || view === 'add-friend'
              ? 'search-div'
              : 'search-div hidden'
          }>
          <img src='./images/search.svg' className='icon grey' />
          <input
            className='textarea-only'
            // placeholder={
            //   view === 'list' ? searchPlaceholder : dbSearchPlaceholder
            // }
            placeholder={searchPlaceholder}
            type='text'
            onChange={search}
            // onChange={view === 'list' ? search : dbSearch}
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

        {b3Src && (
          <div className='menu-views'>
            <div
              className={`round-icon-button ${
                view === 'notif' ? 'selected' : ''
              }`}
              onClick={b3Click}>
              <img
                src={b3Src}
                className='icon'
                style={view === 'add' ? {} : { filter: 'invert(0.4)' }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default TopMenu
