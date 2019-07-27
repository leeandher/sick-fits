import React, { Component } from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import PropTypes from "prop-types"
import styled from "styled-components"

import { CURRENT_USER_QUERY } from "./User"

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: ${({ theme }) => theme.red};
  }
`

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  }
  // This gets called as soon as a response comes back from the server
  // (after the mutation has been performed)
  // With an optimisticResponse, this will be run twice (optimistically, and after actual response)
  update = (cache, { data: resData, error }) => {
    // 1. Read the cache
    const cacheData = cache.readQuery({ query: CURRENT_USER_QUERY })
    // 2. Remove the item from the cart
    const cartItemId = resData.removeFromCart.id
    cacheData.me.cart = cacheData.me.cart.filter(({ id }) => id !== cartItemId)
    // 3. Write it back to the cache
    cache.writeQuery({ query: CURRENT_USER_QUERY, data: cacheData })
  }
  render() {
    const { id } = this.props
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id }}
        update={this.update}
        optimisticResponse={{
          __typename: "Mutation",
          removeFromCart: {
            __typename: "CartItem",
            id
          }
        }}
      >
        {(removeFromCart, { loading }) => (
          <BigButton
            title="Delete Item"
            onClick={() => {
              removeFromCart().catch(err => window.alert(err.message))
            }}
            disabled={loading}
          >
            &times;
          </BigButton>
        )}
      </Mutation>
    )
  }
}

export default RemoveFromCart
