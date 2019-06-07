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

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      const isLongList = this.list.scrollHeight > this.list.clientHeight
      if (isLongList) {
        this.setState({
          scrollDown: true,
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
        {scrollUp && (
          <div
            className='scroll-arrow top'
            style={{ top: `${this.list.clientTop}` }}>
            <img
              className='icon'
              src='/images/down-arrow.png'
              style={{ transform: 'rotate(180deg)', width: '30px' }}
            />
          </div>
        )}

        <div
          className='scroll-div'
          style={this.props.styles ? this.props.styles : null}
          ref={node => {
            this.list = node
          }}>
          {this.props.children}
        </div>

        
        {scrollDown && (
          <div
            className='scroll-arrow bottom'
            style={{ top: `${this.list.clientTop + this.list.clientHeight}` }}>
            <img
              className='icon'
              src='/images/down-arrow.png'
              style={{ width: '30px' }}
            />
          </div>
        )}
      </div>
    )
  }
}

export default ScrollContainer
