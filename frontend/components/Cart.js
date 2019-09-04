import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { adopt } from 'react-adopt'

import User from './User'
import CartItem from './CartItem'
import Merchant from './Merchant'
import CartStyles from './styles/CartStyles'
import Supreme from './styles/Supreme'
import CloseButton from './styles/CloseButton'
import SickButton from './styles/SickButton'

import calcTotalPrice from '../lib/calcTotalPrice'
import formatMoney from '../lib/formatMoney'

const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE_QUERY {
    cartOpen @client
  }
`

const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`

const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
})

const Cart = () => {
  return (
    <Composed>
      {({ user, toggleCart, localState }) => {
        const { me } = user.data
        const { cartOpen } = localState.data
        if (!me) return null
        return (
          <CartStyles open={cartOpen}>
            <header>
              <CloseButton title="close" onClick={toggleCart}>
                &times;
              </CloseButton>
              <Supreme>
                {`${me.name}${me.name.endsWith('s') ? "'" : "'s"} `}🛒
              </Supreme>
              <p>
                You have {me.cart.length} item
                {me.cart.length !== 1 && 's'} in your cart.
              </p>
            </header>
            <ul>
              {me.cart.map(cartItem => (
                <CartItem key={cartItem.id} cartItem={cartItem}>
                  {cartItem.id}
                </CartItem>
              ))}
            </ul>
            {me.cart.length ? (
              <>
                <p>
                  Credit Card shy? This bad boi is powered using Stripe's Test
                  Environment, so just go ahead and uses{' '}
                  <span style={{ borderBottom: '3px solid red' }}>
                    4242 4242 4242 4242
                  </span>{' '}
                  as your CC number (anything as CVC/Exp) 👌👌
                </p>
                <footer>
                  <p>{formatMoney(calcTotalPrice(me.cart))}</p>
                  <Merchant>
                    <SickButton>Checkout</SickButton>
                  </Merchant>
                </footer>
              </>
            ) : null}
          </CartStyles>
        )
      }}
    </Composed>
  )
}

export default Cart
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION }
