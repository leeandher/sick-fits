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

class Merchant extends Component {
  totalItems = cart => {
    return cart.reduce((total, cartItem) => total + cartItem.quantity, 0)
  }
  onToken = id => {
    // Send the ID server-side
    console.log(id)
  }
  render() {
    const { children } = this.props
    return (
      <User>
        {({ data: { me } }) => (
          <StripeCheckout
            amount={calcTotalPrice(me.cart)}
            name="Sick Fits"
            description={`Order of ${this.totalItems(me.cart)} sick items!`}
            image={me.cart[0].item && me.cart[0].item.image}
            stripeKey={STRIPE_KEY}
            currency="CAD"
            email={me.email}
            token={res => this.onToken(res)}
          >
            {children}
          </StripeCheckout>
        )}
      </User>
    )
  }
}

export default Merchant
