import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import Router from 'next/router'

import SignUp, { SIGN_UP_MUTATION } from '../components/SignUp'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser } from '../lib/testUtils'
import { ApolloConsumer } from 'react-apollo'

function type(wrapper, name, value) {
  wrapper.find(`input[name="${name}"]`).simulate('change', {
    target: { name, value },
  })
}

const me = fakeUser()
delete me.createdAt
delete me.updatedAt

const mocks = [
  // Signup mock
  {
    request: {
      query: SIGN_UP_MUTATION,
      variables: {
        name: me.name,
        email: me.email,
        password: 'abc123',
        confirmPassword: 'abc123',
      },
    },
    result: {
      data: {
        signUp: {
          __typename: 'User',
          id: me.id,
          email: me.email,
          name: me.name,
        },
      },
    },
  },
  // Current user mock
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me } },
  },
]

Router.router = {
  push: jest.fn(),
}

describe('<SignUp />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <SignUp />
      </MockedProvider>,
    )
    expect(toJSON(wrapper.find('form'))).toMatchSnapshot()
  })
  it('calls the mutation properly', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <SignUp />
          }}
        </ApolloConsumer>
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    // Simulator helper function
    type(wrapper, 'name', me.name)
    type(wrapper, 'email', me.email)
    type(wrapper, 'password', 'abc123')
    type(wrapper, 'confirmPassword', 'abc123')
    wrapper.update()
    wrapper.find('form').simulate('submit')
    await wait()
    // Query the user out of the Apollo Client
    const { data } = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(data.me).toMatchObject(me)
  })
})
