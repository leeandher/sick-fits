import React from 'react'
import PaginationStyles from './styles/PaginationStyles'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'

import { PER_PAGE } from '../config'

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

const Pagination = ({ page }) => (
  <PaginationStyles>
    <Query query={PAGINATION_QUERY}>
      {({ data, error, loading }) => {
        if (loading) return <p>⚡ Loading... ⚡</p>
        if (error) return <p>❌ Error ❌: {error.message}</p>
        const { count } = data.itemsConnection.aggregate
        const pages = Math.ceil(count / PER_PAGE)
        return (
          <p>
            Page {page} of {pages}
          </p>
        )
      }}
    </Query>
  </PaginationStyles>
)

export default Pagination
