import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import { ALL_ITEMS_QUERY } from './Items'

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`

class DeleteItem extends Component {
  update = (cache, { data: resData }) => {
    // Manually update the client cache so it matches the server
    // 1. Read the query data from the cache
    const cacheData = cache.readQuery({ query: ALL_ITEMS_QUERY })
    // 2. Manually change the cached data
    cacheData.items = cacheData.items.filter(
      ({ id }) => id !== resData.deleteItem.id
    )
    // 3. Write the changed cache data to its query
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data: cacheData })
  }
  render() {
    const { children, id } = this.props
    return (
      <Mutation
        mutation={DELETE_ITEM_MUTATION}
        variables={{ id }}
        update={this.update}
      >
        {(deleteItem, { error }) => (
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this item?')) {
                deleteItem().catch(err => window.alert(err.message))
              }
            }}
          >
            {children}
          </button>
        )}
      </Mutation>
    )
  }
}

export default DeleteItem
export { DELETE_ITEM_MUTATION }
