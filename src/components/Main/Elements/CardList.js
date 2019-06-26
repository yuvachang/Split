import React from 'react'
import ScrollContainer from './ScrollContainer'
import CardListItem from './CardListItem'

const CardList = ({ list, onClick }) => (
  <ScrollContainer showButtons={true}>
    {list.length
      ? list
          .filter(item => !!item)
          .map(item => (
            <CardListItem
              key={item.id}
              item={item}
              onClick={() => onClick('single', item)}
            />
          ))
      : null}
  </ScrollContainer>
)

export default CardList
