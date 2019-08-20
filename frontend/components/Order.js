import React, { Component } from "react"
import PropTypes from "prop-types"
import gql from "graphql-tag"
import { Query } from "react-apollo"
import { format } from "date-fns"
import Head from "next/head"
import formatMoney from "../lib/formatMoney"
import ErrorMessage from "./ErrorMessage"
import OrderStyles from "./styles/OrderStyles"

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    order(where: { id: $id }) {
      id
      charge
      total
      createdAt
      user {
        id
      }
      items {
        id
        title
        description
        price
        image
        quantity
      }
    }
  }
`

class Order extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }
  render() {
    const { id } = this.props
    return (
      <Query query={SINGLE_ORDER_QUERY} variables={{ id }}>
        {({ data: { order }, error, loading }) => {
          if (loading) return <p>⚡ Loading... ⚡</p>
          if (error) return <ErrorMessage error={error} />
          return (
            <OrderStyles>
              <Head>
                <title>Sick Fits - Order {order.id}</title>
              </Head>
              <p>
                <span>Order ID:</span>
                <span>{order.id}</span>
              </p>
              <p>
                <span>Charge:</span>
                <span>{order.charge}</span>
              </p>
              <p>
                <span>Date:</span>
                <span>{format(order.createdAt, "MMMM d, YYY h:mm a")}</span>
              </p>
              <p>
                <span>Total:</span>
                <span>{formatMoney(order.total)}</span>
              </p>
              <p>
                <span>Items:</span>
                <span>
                  {order.items.length} unique,{" "}
                  {order.items.reduce(
                    (total, item) => item.quantity + total,
                    0
                  )}{" "}
                  total
                </span>
              </p>
              <div className="items">
                {order.items.map(item => (
                  <div className="order-item" key={item.id}>
                    <img src={item.image} alt={item.title} />
                    <div className="item-details">
                      <h2>{item.title}</h2>
                      <p>Qty: {item.quantity}</p>
                      <p>Each: {formatMoney(item.price)}</p>
                      <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OrderStyles>
          )
        }}
      </Query>
    )
  }
}

export default Order
export { SINGLE_ORDER_QUERY }
