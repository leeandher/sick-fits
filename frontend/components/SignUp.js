import React, { Component } from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import Router from 'next/router'

import ErrorMessage from './ErrorMessage'
import Form from './styles/Form'
import { CURRENT_USER_QUERY } from './User'

const SIGN_UP_MUTATION = gql`
  mutation SIGN_UP_MUTATION(
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

class SignUp extends Component {
  state = {
    email: '',
    name: '',
    password: ''
  }
  saveToState = e => {
    const { value, name } = e.target
    this.setState({ [name]: value })
  }
  render() {
    const { email, name, password } = this.state
    return (
      <Mutation
        mutation={SIGN_UP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signUp, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault()
                await signUp()
                this.setState({
                  email: '',
                  name: '',
                  password: ''
                })
                Router.push('/')
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

export default SignUp
export { SIGN_UP_MUTATION }
