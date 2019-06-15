import gql from 'graphql-tag'
import React, { Component } from 'react'
import Form from './styles/Form'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import ErrorMessage from './ErrorMessage'

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

class UpdateItem extends Component {
  handleChange = ({ target: { name, type, value } }) => {
    const stateValue = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: stateValue })
  }

  render() {
    const { id } = this.props
    const { description, image, price, title } = this.state
    return (
      <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault()
              // Call the mutation
              const { data } = await createItem()
              // Send them to the single item page
              Router.push({
                pathname: '/item',
                query: { id: data.createItem.id }
              })
            }}
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
                  value={title}
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
                  value={price}
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
                  value={description}
                  onChange={this.handleChange}
                  style={{ boxShadow: 'none' }}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
