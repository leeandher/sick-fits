import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'

import Title from './styles/Title'
import ItemStyles from './styles/ItemStyles'
import PriceTag from './styles/PriceTag'
import DeleteItem from './DeleteItem'
import AddToCart from './AddToCart'

import formatMoney from '../lib/formatMoney'

export default class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  render() {
    const { item } = this.props
    const { description, id, image, price, title } = item
    return (
      <ItemStyles>
        <PriceTag>{formatMoney(price)}</PriceTag>

        <Link href={{ pathname: 'item', query: { id: id } }}>
          <a>{image && <img src={image} alt={title} />}</a>
        </Link>
        <Title>
          <Link href={{ pathname: 'item', query: { id: id } }}>
            <a>{title}</a>
          </Link>
        </Title>
        <p>{description}</p>
        <div className="buttonList">
          <Link href={{ pathname: 'update', query: { id: id } }}>
            <button>🔨 Edit 🔨</button>
          </Link>
          <AddToCart id={item.id} />
          <DeleteItem id={item.id}>🔥 Delete Item 🔥</DeleteItem>
        </div>
      </ItemStyles>
    )
  }
}
