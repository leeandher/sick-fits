import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import styled from 'styled-components'
import Link from 'next/link'

import Item from './Item'
import Pagination from './Pagination'

import { PER_PAGE } from '../config'

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY(
    $skip: Int = 0,
    $first: Int = ${PER_PAGE}
  ) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`

const Center = styled.div`
  text-align: center;
`

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
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

class Items extends Component {
  render() {
    const { page } = this.props
    return (
      <Center>
        <Pagination page={page} />
        <Query
          query={ALL_ITEMS_QUERY}
          variables={{
            skip: (page - 1) * PER_PAGE,
            first: PER_PAGE,
          }}
        >
          {({ data, error, loading }) => {
            if (loading)
              return (
                <p>
                  ⚡ Loading (I'm on a free Heroku dyno, so this may initially
                  take around 45s, but then it'll be speedy!)... ⚡
                </p>
              )
            if (error) return <p>❌ Error ❌: {error.message}</p>
            return (
              <MainWrap>
                {data.items.length === 0 && (
                  <h2>
                    There aren't any items in the shop right now!
                    <br />
                    <Link href="/sell">
                      <a>
                        <span>Selling something?</span>
                      </a>
                    </Link>
                  </h2>
                )}
                <ItemsList>
                  {data.items.map(item => (
                    <Item key={item.id} item={item} />
                  ))}
                </ItemsList>
              </MainWrap>
            )
          }}
        </Query>
        <Pagination page={page} />
      </Center>
    )
  }
}

export default Items
export { ALL_ITEMS_QUERY }
