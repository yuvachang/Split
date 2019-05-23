import React, { Component } from 'react'
import ListItem from '../Elements/ListItem'

class FadingScroll extends Component {
  state = {
    listFadeBottom: false,
    listFadeTop: false,
  }

  scrollListener = e => {
    const atBottom =
      this.list.scrollTop + this.list.clientHeight >=
      this.list.scrollHeight - 10
    const atTop = this.list.scrollTop <= 10

    if (atTop && this.state.listFadeTop) {
      this.setState({ listFadeTop: false })
    }

    if (!atTop && !this.state.listFadeTop) {
      this.setState({ listFadeTop: true })
    }

    if (atBottom && this.state.listFadeBottom) {
      this.setState({ listFadeBottom: false })
    }

    if (!atBottom && !this.state.listFadeBottom) {
      this.setState({ listFadeBottom: true })
    }
  }

  componentDidMount = async () => {
    if (this.list) {
      this.list.addEventListener('scroll', e => this.scrollListener(e))
      const isLongList = this.list.scrollHeight > this.list.clientHeight
      if (isLongList) {
        await this.setState({
          listFadeBottom: true,
        })
      }
    }
  }

  componentWillUnmount() {
    if (this.list) {
      this.list.removeEventListener('scroll', e => this.scrollListener(e))
    }
  }

  render() {
    const { listFadeBottom, listFadeTop } = this.state
    return (
      <div className='scroll-div-container'>
        <div
          className={
            listFadeBottom && listFadeTop
              ? 'scroll-div fade-top fade-bottom'
              : listFadeBottom
              ? 'scroll-div fade-bottom'
              : listFadeTop
              ? 'scroll-div fade-top'
              : 'scroll-div'
          }
          style={ this.props.styles ? this.props.styles : null}
          ref={node => {
            this.list = node
          }}>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default FadingScroll
