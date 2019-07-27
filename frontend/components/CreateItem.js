import gql from "graphql-tag"
import React, { Component } from "react"
import Form from "./styles/Form"
import { Mutation } from "react-apollo"
import Router from "next/router"

import ErrorMessage from "./ErrorMessage"

import { IMAGE_ENDPOINT } from "../config"

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
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0,
    uploading: false
  }

  handleChange = ({ target: { name, type, value } }) => {
    const stateValue = type === "number" ? parseFloat(value) : value
    this.setState({ [name]: stateValue })
  }

  uploadFile = async e => {
    const [file] = e.target.files
    const data = new FormData()
    data.append("file", file)
    // Select the correct cloudinary upload-preset configuration
    data.append("upload_preset", "sick-fits")
    await this.setState({ uploading: true })
    const res = await fetch(IMAGE_ENDPOINT, {
      method: "POST",
      body: data
    })
    const upload = await res.json()
    if (upload.error) {
      window.alert(upload.error.message)
      return this.setState({ uploading: false })
    }
    console.log(upload)
    this.setState({
      image: upload.secure_url,
      largeImage: upload.eager[0].secure_url,
      uploading: false
    })
  }

  render() {
    const { description, image, price, title, uploading } = this.state
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault()
              if (uploading) return false
              // Call the mutation
              const { data } = await createItem()
              // Send them to the single item page
              Router.push({
                pathname: "/item",
                query: { id: data.createItem.id }
              })
            }}
          >
            <ErrorMessage error={error} />
            <fieldset
              disabled={loading || uploading}
              aria-busy={loading || uploading}
            >
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={this.uploadFile}
                  required
                />
                {image.length > 0 && (
                  <img
                    src={image}
                    alt="Upload Preview"
                    style={{
                      maxWidth: "300px",
                      maxHeight: "200px",
                      padding: "1rem"
                    }}
                  />
                )}
              </label>
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
                  style={{ boxShadow: "none" }}
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
