import React, { Component } from 'react'

class NavLink extends Component {
  render() {
    const {
      name,
      windowWidth,
      location,
      pathname,
      pushHistory,
      setMarker,
      iconSrc
    } = this.props
    return (
      <div
        className={location === pathname ? 'link-item current' : 'link-item'}
        onClick={async () => {
          await pushHistory(pathname)
          await setMarker()
        }}>
        <img
          src={iconSrc}
          className={windowWidth < 700 ? 'icon center' : 'icon'}
          ref={node => {
            this.ref = node
          }}
        />
        {windowWidth > 700 && <div className='navlink-text'>{name}</div>}
        {windowWidth > 700 && (
          <div className={location === pathname ? 'bullet filled' : 'bullet'} />
        )}
      </div>
    )
  }
}

export default NavLink
