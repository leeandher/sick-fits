import React from "react"
import gql from "graphql-tag"
import { Query } from "react-apollo"
import Head from "next/head"
import Link from "next/link"
import styled from "styled-components"

import PaginationStyles from "./styles/PaginationStyles"

import { PER_PAGE } from "../config"

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`

const StylishAnchor = styled.a`
  color: ${({ theme }) => theme.black};
`

const Pagination = ({ page }) => (
  <Query query={PAGINATION_QUERY}>
    {({ data, error, loading }) => {
      if (loading) return <p>⚡ Loading... ⚡</p>
      if (error) return <p>❌ Error ❌: {error.message}</p>
      const { count } = data.itemsConnection.aggregate
      const pages = Math.ceil(count / PER_PAGE)
      return (
        <PaginationStyles>
          <Head>
            <title>
              Sick Fits | Page {page} of {pages}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: "items",
              query: { page: page - 1 }
            }}
          >
            <StylishAnchor className="prev" aria-disabled={page <= 1}>
              ← Prev
            </StylishAnchor>
          </Link>
          <p>
            Page {page} of {pages}
          </p>
          <p>{count} Items Total</p>
          <Link
            prefetch
            href={{
              pathname: "items",
              query: { page: page + 1 }
            }}
          >
            <StylishAnchor className="next" aria-disabled={page >= pages}>
              Next →
            </StylishAnchor>
          </Link>
        </PaginationStyles>
      )
    }}
  </Query>
)

export default Pagination
