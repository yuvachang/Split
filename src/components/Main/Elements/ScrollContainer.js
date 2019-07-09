import React, { Component } from 'react'

class ScrollContainer extends Component {
  state = {
    scrollDown: false,
    scrollUp: false,
  }

  scrollListener = e => {
    const atBottom =
      this.list.scrollTop + this.list.clientHeight >=
      this.list.scrollHeight - 20
    const atTop = this.list.scrollTop <= 20

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

  scroll = dir => {
    this.scrollTimeout = setInterval(() => {
      this.list.scrollBy({
        top: dir === 'up' ? -55 : 55,
        left: 0,
        behavior: 'smooth',
      })
    }, 100)
  }
  
  scrollt = dir => {
    this.list.scrollBy({
      top: dir === 'up' ? -55 : 55,
      left: 0,
      behavior: 'smooth',
    })
  }

  endScroll = () => {
    clearInterval(this.scrollTimeout)
  }

  checkListLength = () => {
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

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps !== this.props) {
      this.checkListLength()
    }
  }

  componentDidMount = async () => {
    if (this.list) {
      this.list.addEventListener('scroll', this.scrollListener)
      window.addEventListener('resize', this.checkListLength)
      this.checkListLength()
    }
  }

  componentWillUnmount() {
    if (this.list) {
      this.list.removeEventListener('scroll', this.scrollListener)
      window.removeEventListener('resize', this.checkListLength)
    }
  }

  render() {
    const { showButtons } = this.props
    const { scrollDown, scrollUp } = this.state
    return (
      <div className='scroll-div-container'>
        {showButtons && (
          <div
            className={`scrollArrowID scroll-arrow button card ${
              scrollUp ? '' : 'hidden'
            } top`}
            onMouseDown={() => this.scroll('up')}
            onMouseUp={this.endScroll}
            onMouseLeave={this.endScroll}
            onTouchStart={() => this.scroll('up')}
            onTouchEnd={this.endScroll}
            onTouchCancel={this.endScroll}>
            <img
              alt='Scroll up'
              className='icon upsidedown scrollArrowID'
              src='/images/down-arrow.png'
              style={{
                width: '30px',
                filter: 'invert(0.4)',
              }}
            />
          </div>
        )}

        <div
          className='scroll-div'
          ref={node => {
            this.list = node
          }}>
          {this.props.children}
        </div>

        {showButtons && (
          <div
            className={`scrollArrowID scroll-arrow button card ${
              scrollDown ? '' : 'hidden'
            } bottom`}
            onMouseDown={this.scroll}
            onMouseUp={this.endScroll}
            onMouseLeave={this.endScroll}
            onTouchStart={this.scroll}
            onTouchEnd={this.endScroll}
            onTouchCancel={this.endScroll}>
            <img
              alt='Scroll down'
              className='icon scrollArrowID'
              src='/images/down-arrow.png'
              style={{ width: '30px', filter: 'invert(0.4)' }}
            />
          </div>
        )}
      </div>
    )
  }
}

export default ScrollContainer
