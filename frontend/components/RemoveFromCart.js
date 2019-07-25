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
  render() {
    const { id } = this.props
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
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
