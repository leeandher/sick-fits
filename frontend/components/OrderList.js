import React, { Component } from 'react'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { Query } from 'react-apollo'
import { formatDistance } from 'date-fns'
import formatMoney from '../lib/formatMoney'
import Head from 'next/head'
import Link from 'next/link'
import OrderItemStyles from './styles/OrderItemStyles'
import ErrorMessage from './ErrorMessage'

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        description
        quantity
        image
      }
    }
  }
`

const ListWrap = styled.ul`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`
const MainWrap = styled.div`
  h2 {
    text-align: center;
    span {
      padding: 1rem;
      background: ${({ theme }) => theme.red};
      color: white;
      line-height: 1;
      transform: skew(-6deg);
      display: inline-block;
    }
  }
`

class OrderList extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({ data: { orders }, error, loading }) => {
          if (loading) return <p>⚡ Loading... ⚡</p>
          if (error) return <ErrorMessage error={error} />
          const itemCount = order => {
            return order.items.reduce((total, item) => total + item.quantity, 0)
          }
          const productCount = order => order.items.length
          return (
            <MainWrap>
              <Head>
                <title>Sick Fits - Orders</title>
              </Head>
              <h2>
                You have <span>{orders.length}</span> order
                {orders.length !== 1 && 's'}!
              </h2>
              <ListWrap>
                {orders.map(order => (
                  <OrderItemStyles key={order.id}>
                    <Link
                      href={{ pathname: 'order', query: { id: order.id } }}
                      key={order.id}
                    >
                      <a>
                        <div className="order-meta">
                          <p>
                            {itemCount(order)} Item
                            {itemCount(order) !== 1 && 's'}
                          </p>
                          <p>
                            {productCount(order)} Product
                            {productCount(order) !== 1 && 's'}
                          </p>
                          <p>
                            {formatDistance(
                              Date.parse(order.createdAt),
                              new Date(),
                            )}
                          </p>
                          <p>{formatMoney(order.total)}</p>
                        </div>
                        <div className="images">
                          {order.items.map(item => (
                            <img
                              src={item.image}
                              alt={item.title}
                              key={item.id}
                            />
                          ))}
                        </div>
                      </a>
                    </Link>
                  </OrderItemStyles>
                ))}
              </ListWrap>
            </MainWrap>
          )
        }}
      </Query>
    )
  }
}

export default OrderList
export { USER_ORDERS_QUERY }
