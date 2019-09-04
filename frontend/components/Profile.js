import React from 'react'
import styled from 'styled-components'
import { Query } from 'react-apollo'

import { format, formatDistance } from 'date-fns'
import Head from 'next/head'
import Link from 'next/link'

import { USER_ORDERS_QUERY } from './OrderList'
import formatMoney from '../lib/formatMoney'
import ErrorMessage from './ErrorMessage'
import User from './User'

const ProfileWrapper = styled.div`
  h2 {
    font-size: 4rem;
  }
  span.stylish {
    padding: 1rem;
    background: ${({ theme }) => theme.red};
    color: white;
    line-height: 1;
    transform: skew(-6deg);
    display: inline-block;
  }
  h3 {
    font-size: 2rem;
    border-bottom: 3px solid red;
    margin-top: 3rem;
  }
  margin: 0 auto;
  box-shadow: ${props => props.theme.bs};
  padding: 2rem;
  li {
  }
  & > p.field {
    display: grid;
    grid-template-columns: 1fr 5fr;
    margin: 0;
    border-bottom: 1px solid ${props => props.theme.offWhite};
    span {
      padding: 1rem;
      &:first-child {
        font-weight: 900;
        text-align: right;
      }
    }
  }
`

const OrderSummary = styled.div`
  border-left: 7px solid red;
  box-shadow: 0 0 2px;
  margin: 2rem;
  & > p.field {
    display: grid;
    grid-template-columns: 1fr 7fr;
    margin: 0;
    border-bottom: 1px solid ${props => props.theme.offWhite};
    span {
      padding: 0.5rem;
      &:first-child {
        font-weight: 900;
        text-align: right;
      }
    }
  }
`

const Profile = () => {
  const accountAge = me => {
    return formatDistance(Date.parse(me.createdAt), Date.now())
  }
  const spendingTotal = orders => {
    return formatMoney(
      orders.reduce((total, order) => total + order.total, 0) || 0,
    )
  }
  return (
    <User>
      {({ data: { me }, loading }) =>
        loading ? (
          <p>⚡ Loading... ⚡</p>
        ) : (
          <ProfileWrapper>
            <Head>
              <title>Sick Fits | Account</title>
            </Head>
            <h2>
              <span className="stylish">Your Account</span>
            </h2>
            <h3>Details</h3>
            <p className="field">
              <span>Name</span>
              <span>{me.name}</span>
            </p>
            <p className="field">
              <span>Email</span>
              <span>{me.email}</span>
            </p>
            <p className="field">
              <span>Permissions</span>
              <span>{me.permissions.join(', ')}</span>
            </p>
            <p className="field">
              <span>Account Birthday</span>
              <span>
                {format(Date.parse(me.createdAt), 'MMMM d, YYY h:mm a')}
              </span>
            </p>
            <h3>Stats</h3>
            <ul>
              <li>Your account is {accountAge(me)} old</li>
              {me.orders.length > 0 ? (
                <li>You've spent {spendingTotal(me.orders)} on Sick Fits</li>
              ) : (
                <li>You haven't made a purchase on Sick Fits yet!</li>
              )}
            </ul>
            <h3>Order Summaries</h3>
            <Query query={USER_ORDERS_QUERY}>
              {({ data }) => {
                return data.orders.map(order => (
                  <Link
                    key={order.id}
                    href={{
                      pathname: 'order',
                      query: { id: order.id },
                    }}
                  >
                    <a>
                      <OrderSummary>
                        <p className="field">
                          <span>ID</span>
                          <span>{order.id}</span>
                        </p>
                        <p className="field">
                          <span>Date</span>
                          <span>
                            {format(
                              Date.parse(order.createdAt),
                              'MMMM d, YYY h:mm a',
                            )}
                          </span>
                        </p>
                        <p className="field">
                          <span>Total</span>
                          <span>{formatMoney(order.total)}</span>
                        </p>
                      </OrderSummary>
                    </a>
                  </Link>
                ))
              }}
            </Query>
          </ProfileWrapper>
        )
      }
    </User>
  )
}

export default Profile
