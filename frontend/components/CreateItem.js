import gql from 'graphql-tag'
import React, { Component } from 'react'
import Form from './styles/Form'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import ErrorMessage from './ErrorMessage'

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
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

class CreateItem extends Component {
  state = {
    title: 'Cool Shooes',
    description: 'I love those Context',
    image: 'dog.jpg',
    largeImage: 'large-dog.jpg',
    price: 1000
  }

  handleChange = ({ target: { name, type, value } }) => {
    const stateValue = type === 'number' ? parseFloat(value) : value
    this.setState({ [name]: stateValue })
  }

  render() {
    const { description, price, title } = this.state
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              // Stop the form from submitting
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

export default CreateItem
