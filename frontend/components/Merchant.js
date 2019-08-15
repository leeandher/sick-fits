import React, { Component } from "react"
import StripeCheckout from "react-stripe-checkout"
import { Mutation } from "react-apollo"
import Router from "next/router"
import gql from "graphql-tag"
import PropTypes from "prop-types"
import NProgress from "nprogress"

import ErrorMessage from "./ErrorMessage"
import User, { CURRENT_USER_QUERY } from "./User"

import calcTotalPrice from "../lib/calcTotalPrice"
import { STRIPE_KEY } from "../config"

const CREATE_ORDER_MUTATION = gql`
  mutation CREATE_ORDER_MUTATION($token: String!) {
    createOrder(token: $token) {
      id
      charge
      total
      items {
        id
        title
      }
    }
  }
`

class Merchant extends Component {
  totalItems = cart => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0)
  }
  onToken = ({ id }, createOrder) => {
    // Send the ID server-side
    // Manually call the mutation once we have the stripe token
    createOrder({
      variables: { token: id }
    }).catch(err => alert(err.message))
  }
  render() {
    const { children } = this.props
    return (
      <User>
        {({ data: { me } }) => (
          <Mutation
            mutation={CREATE_ORDER_MUTATION}
            refetchQueries={[{ query: CURRENT_USER_QUERY }]}
          >
            {(createOrder, { data }) => (
              <StripeCheckout
                amount={calcTotalPrice(me.cart)}
                name="Sick Fits"
                description={`Order of ${this.totalItems(me.cart)} sick items!`}
                image={me.cart[0].item && me.cart[0].item.image}
                stripeKey={STRIPE_KEY}
                currency="CAD"
                email={me.email}
                token={res => this.onToken(res, createOrder)}
              >
                {children}
              </StripeCheckout>
            )}
          </Mutation>
        )}
      </User>
    )
  }
}

export default Merchant
