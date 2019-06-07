import React, { Component } from 'react'
import ListItem from '../Elements/ListItem'

class ScrollContainer extends Component {
  state = {
    scrollDown: false,
    scrollUp: false,
  }

  scrollListener = e => {
    const atBottom =
      this.list.scrollTop + this.list.clientHeight >=
      this.list.scrollHeight - 10
    const atTop = this.list.scrollTop <= 10

    if (atTop && this.state.scrollUp) {
      this.setState({ scrollUp: false })
    }

    if (!atTop && !this.state.scrollUp) {
      this.setState({ scrollUp: true })
    }

    if (atBottom && this.state.scrollDown) {
      this.setState({ scrollDown: false })
    }

    if (!atBottom && !this.state.scrollDown) {
      this.setState({ scrollDown: true })
    }
  }

  scroll = ( dir) => {
    // event.preventDefault()
    this.scrollTimeout = setInterval(() => {
      this.list.scrollBy({
        top: dir === 'up' ? -55 : 55,
        left: 0,
        behavior: 'smooth',
      })
    }, 100)
    // this.list.scrollTo({
    //   top: dir === 'up' ? 0 : this.list.scrollHeight,
    //   left: 0,
    //   behavior: 'smooth',
    // })
  }
  scrollt = dir => {
    this.list.scrollBy({
      top: dir === 'up' ? -55 : 55,
      left: 0,
      behavior: 'smooth',
    })
  }

  endScroll = () => {
    console.log('end scroll')
    clearInterval(this.scrollTimeout)
    // window.stop(true, false)
  }

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      console.log(this.list.scrollHeight, this.list.clientHeight)
      const isLongList = this.list.scrollHeight > this.list.clientHeight
      if (isLongList) {
        this.setState({
          scrollDown: true,
        })
      } else {
        this.setState({
          scrollUp: false,
          scrollDown: false,
        })
      }
    }
  }

  componentDidMount = async () => {
    if (this.list) {
      this.list.addEventListener('scroll', e => this.scrollListener(e))
    }
  }

  componentWillUnmount() {
    if (this.list) {
      this.list.removeEventListener('scroll', e => this.scrollListener(e))
    }
  }

  render() {
    const { scrollDown, scrollUp } = this.state
    return (
      <div className='scroll-div-container'>
        <div
          className={`scroll-arrow button card ${scrollUp ? '' : 'hidden'}`}
          style={{ top: `${this.list ? this.list.clientTop : 0}` }}
          // onClick={this.scrollUp}
          // onMouseDown={(e) => this.scroll(e,'up')}
          onMouseDown={() =>  this.scroll('up')}
          onMouseUp={this.endScroll}
          onMouseLeave={this.endScroll}
          onTouchStart={() =>  this.scroll('up')}
          onTouchEnd ={this.endScroll}
          onTouchCancel={this.endScroll}>
          <img
            className='icon'
            src='/images/down-arrow.png'
            style={{
              transform: 'rotate(180deg)',
              width: '30px',
              filter: 'invert(0.4)',
            }}
          />
        </div>

        <div
          className='scroll-div'
          style={{ scrollBehavior: 'smooth' }}
          ref={node => {
            this.list = node
          }}>
          {this.props.children}
        </div>

        <div
          className={`scroll-arrow button card ${scrollDown ? '' : 'hidden'}`}
          style={{
            top: `${
              this.list ? this.list.clientTop + this.list.clientHeight : 0
            }`,
          }}
          // onMouseDown={e => this.scroll(e)}
          onMouseDown={this.scroll}
          onMouseUp={this.endScroll}
          onMouseLeave={this.endScroll}
          onTouchStart={this.scroll}
          onTouchEnd={this.endScroll}
          onTouchCancel={this.endScroll}>
          <img
            className='icon'
            src='/images/down-arrow.png'
            style={{ width: '30px', filter: 'invert(0.4)' }}
          />
        </div>
      </div>
    )
  }
}

export default ScrollContainer
