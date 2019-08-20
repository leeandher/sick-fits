import React, { Component } from "react"
import gql from "graphql-tag"
import styled from "styled-components"
import { Query } from "react-apollo"
import { formatDistance } from "date-fns"
import formatMoney from "../lib/formatMoney"
import Head from "next/head"
import Link from "next/link"
import OrderItemStyles from "./styles/OrderItemStyles"
import ErrorMessage from "./ErrorMessage"

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      total
      createdAt
      items {
        id
        title
        price
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
  h2 > span {
    padding: 1rem;
    background: ${({ theme }) => theme.red};
    color: white;
    line-height: 1;
    transform: skew(-6deg);
    display: inline-block;
  }
`

class OrderList extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({ data: { orders }, error, loading }) => {
          if (loading) return <p>⚡ Loading... ⚡</p>
          if (error) return <ErrorMessage error={error} />
          return (
            <MainWrap>
              <Head>
                <title>Sick Fits - Orders</title>
              </Head>
              <h2>
                You have <span>{orders.length}</span> orders!
              </h2>
              <ListWrap>
                {orders.map(order => (
                  <Link
                    href={{ pathname: "order", query: { id: order.id } }}
                    key={order.id}
                  >
                    <div>
                      <p>
                        <span>Order ID:</span>
                        <span>{order.id}</span>
                      </p>
                      <p>
                        <span>Date:</span>
                        <span>
                          {formatDistance(
                            order.createdAt,
                            "MMMM d, YYY h:mm a"
                          )}
                        </span>
                      </p>
                      <p>
                        <span>Total:</span>
                        <span>{formatMoney(order.total)}</span>
                      </p>
                    </div>
                  </Link>
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
