import React, { Component } from 'react'
import ScrollContainer from './ScrollContainer'
import CardListItem from './CardListItem'

class CardList extends Component {
  componentDidMount = async () => {
    console.log('listpage mounted')
  }

  render() {
    const { list, onClick } = this.props
    return (
      <ScrollContainer showButtons={true}>
        {list[0]
          ? list.map(item => (
              <CardListItem
                key={item.id}
                item={item}
                onClick={() => onClick('single', item)}
              />
            ))
          : null}
      </ScrollContainer>
    )
  }
}

export default CardList
