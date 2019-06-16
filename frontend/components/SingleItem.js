import React, { Component } from 'react'
import Head from 'next/head'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import styled from 'styled-components'

import ErrorMessage from './ErrorMessage'
import { buildSchema } from 'graphql'

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      largeImage
      price
      createdAt
      updatedAt
    }
  }
`

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${({ theme }) => theme.bs};
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }
`

class SingleItem extends Component {
  render() {
    const { id } = this.props
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data: { item }, error, loading }) => {
          if (loading) return <p>⚡ Loading... ⚡</p>
          if (error) return <ErrorMessage error={error} />
          if (!item) return <p>🤷‍♀️ No Item Found! 🤷‍♂️</p>
          return (
            <SingleItemStyles>
              <Head>
                <title> Sick Fits | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>{item.title}</h2>
                <p> {item.description}</p>
              </div>
            </SingleItemStyles>
          )
        }}
      </Query>
    )
  }
}

export default SingleItem
export { SINGLE_ITEM_QUERY }
