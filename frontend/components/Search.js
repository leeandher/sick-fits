import React, { Component } from "react"
import Downshift, { resetIdCounter } from "downshift"
import Router from "next/router"
import { ApolloConsumer } from "react-apollo"
import gql from "graphql-tag"
import debounce from "lodash.debounce"

import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown"

const SEARCH_ITEMS_QUERY = gql`
  query SEARCH_ITEMS_QUERY($searchTerm: String!) {
    items(
      where: {
        OR: [
          { title_contains: $searchTerm }
          { description_contains: $searchTerm }
        ]
      }
    ) {
      id
      image
      title
    }
  }
`

class Search extends Component {
  state = {
    items: [],
    loading: false
  }

  handleSearch = debounce(async (searchTerm, client) => {
    // 1. Set the loading state to true
    await this.setState({ loading: true })
    // 2. Manually query the apollo client
    const res = await client.query({
      query: SEARCH_ITEMS_QUERY,
      variables: { searchTerm }
    })
    // 3. Set the loading state to false, and parse the items
    this.setState({
      items: res.data.items,
      loading: false
    })
  }, 350)

  routeToItem({ id }) {
    Router.push({
      pathname: "/item",
      query: {
        id
      }
    })
  }

  render() {
    const { items, loading } = this.state
    resetIdCounter()
    return (
      <SearchStyles>
        <Downshift
          onChange={this.routeToItem}
          itemToString={item => (item === null ? "" : item.title)}
        >
          {({
            getInputProps,
            getItemProps,
            isOpen,
            inputValue,
            highlightedIndex
          }) => (
            <div>
              <ApolloConsumer>
                {client => (
                  <input
                    {...getInputProps({
                      type: "search",
                      placeholder: "Search!",
                      id: "search",
                      className: loading ? "loading" : "",
                      onChange: e => {
                        e.persist()
                        this.handleSearch(e.target.value, client)
                      }
                    })}
                  />
                )}
              </ApolloConsumer>
              {isOpen && (
                <DropDown>
                  {items.map((item, i) => (
                    <DropDownItem
                      {...getItemProps({ item })}
                      key={item.id}
                      highlighted={i === highlightedIndex}
                    >
                      <img width="50" src={item.image} alt={item.title} />
                      {item.title}
                    </DropDownItem>
                  ))}
                  {items.length === 0 && !loading && (
                    <DropDownItem>
                      Nothing found for '{inputValue}'
                    </DropDownItem>
                  )}
                </DropDown>
              )}
            </div>
          )}
        </Downshift>
      </SearchStyles>
    )
  }
}

export default Search
