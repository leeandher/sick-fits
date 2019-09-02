import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import { ApolloConsumer } from 'react-apollo'

import RemoveFromCart, {
  REMOVE_FROM_CART_MUTATION,
} from '../components/RemoveFromCart'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'

// Replace window.alert functionality
global.alert = console.log

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: { ...fakeUser(), cart: [fakeCartItem({ id: 'abc123' })] },
      },
    },
  },
  {
    request: { query: REMOVE_FROM_CART_MUTATION, variables: { id: 'abc123' } },
    result: {
      data: {
        removeFromCart: {
          __typename: 'CartItem',
          id: 'abc123',
        },
      },
    },
  },
]

describe('<RemoveFromCart />', () => {
  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <RemoveFromCart id="omg123" />
      </MockedProvider>,
    )
    expect(toJSON(wrapper.find('button'))).toMatchSnapshot()
  })
  it('removes the item from the cart', async () => {
    let apolloClient
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <ApolloConsumer>
          {client => {
            apolloClient = client
            return <RemoveFromCart id="abc123" />
          }}
        </ApolloConsumer>
      </MockedProvider>,
    )
    const {
      data: { me: beforeClick },
    } = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(beforeClick.cart).toHaveLength(1)

    wrapper.find('button').simulate('click')
    await wait()
    const {
      data: { me: afterClick },
    } = await apolloClient.query({ query: CURRENT_USER_QUERY })
    expect(afterClick.cart).toHaveLength(0)
  })
})
