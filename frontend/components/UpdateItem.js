import gql from 'graphql-tag'
import React, { Component } from 'react'
import Form from './styles/Form'
import { Mutation, Query } from 'react-apollo'
import Router from 'next/router'

import ErrorMessage from './ErrorMessage'

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      title
      description
      price
      image
      largeImage
    }
  }
`

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`

class UpdateItem extends Component {
  state = {}

  handleChange = ({ target: { name, type, value } }) => {
    const stateValue = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: stateValue })
  }

  handleSubmit = async (e, updateItem) => {
    const { id } = this.props
    e.preventDefault()
    await updateItem({
      variables: {
        id,
        ...this.state,
      },
    })
  }

  render() {
    const { id } = this.props
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id }}>
        {({ data: { item }, loading }) => {
          if (loading) return <p>⚡ Loading... ⚡</p>
          if (!item) return <p>🤷‍♀️ No Item Found! 🤷‍♂️</p>
          return (
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form
                  onSubmit={async e => {
                    e.preventDefault()
                    Router.push({
                      pathname: '/item',
                      query: { id },
                    })
                  }}
                  onSubmit={e => this.handleSubmit(e, updateItem)}
                >
                  <ErrorMessage error={error} />
                  <fieldset disabled={loading} aria-busy={loading}>
                    {/* TODO: Implement image editing */}
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        defaultValue={item.title}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min={0}
                        placeholder="Price"
                        defaultValue={item.price}
                        onChange={this.handleChange}
                        required
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Enter a Description"
                        defaultValue={item.description}
                        onChange={this.handleChange}
                        style={{ boxShadow: 'none', resize: 'vertical' }}
                        required
                      />
                    </label>
                    <button type="submit">
                      Sav{loading ? 'ing...' : 'e Changes'}
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
