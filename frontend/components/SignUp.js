import gql from "graphql-tag"
import React, { Component } from "react"
import { Mutation } from "react-apollo"
import ErrorMessage from "./ErrorMessage"
import Form from "./styles/Form"

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signUp(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`

export default class SignUp extends Component {
  state = {
    email: "",
    name: "",
    password: ""
  }
  saveToState = e => {
    const { value, name } = e.target
    this.setState({ [name]: value })
  }
  render() {
    const { email, name, password } = this.state
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signUp, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                await signUp()
                this.setState({
                  email: "",
                  name: "",
                  password: ""
                })
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up for an Account</h2>
                <ErrorMessage error={error} />
                <label htmlFor="email">
                  Email
                  <input
                    type="text"
                    name="email"
                    placeholder="e.g. kanye@west.com"
                    value={email}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Kanye West"
                    value={name}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    placeholder="e.g. y33zy"
                    value={password}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Sign Up!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}
