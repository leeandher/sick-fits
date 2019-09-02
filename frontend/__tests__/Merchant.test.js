import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import NProgress from 'nprogress'
import Router from 'next/router'
import { MockedProvider } from 'react-apollo/test-utils'

import Merchant, { CREATE_ORDER_MUTATION } from '../components/Merchant'
import { CURRENT_USER_QUERY } from '../components/User'
import { fakeUser, fakeCartItem } from '../lib/testUtils'

Router.router = { push: jest.fn() }

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: { ...fakeUser(), cart: [fakeCartItem()] } } },
  },
]

describe('<Merchant />', () => {
  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Merchant />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    const checkoutButton = wrapper.find('ReactStripeCheckout')
    expect(toJSON(checkoutButton)).toMatchSnapshot()
  })

  it('creates an order onToken', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: 'xyz789' } },
    })
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Merchant />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    const component = wrapper.find('Merchant').instance()
    // Manually call the onToken method of the component
    component.onToken({ id: 'abc123' }, createOrderMock)
    expect(createOrderMock).toHaveBeenCalled()
    expect(createOrderMock).toHaveBeenCalledWith({
      variables: { token: 'abc123' },
    })
  })
  it('turns the progress bar on', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: 'xyz789' } },
    })
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Merchant />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    NProgress.start = jest.fn()
    const component = wrapper.find('Merchant').instance()
    component.onToken({ id: 'abc123' }, createOrderMock)
    expect(NProgress.start).toHaveBeenCalled()
  })

  it('routes to the order page when completed', async () => {
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: 'xyz789' } },
    })
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Merchant />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    const component = wrapper.find('Merchant').instance()
    component.onToken({ id: 'abc123' }, createOrderMock)
    expect(Router.router.push).toHaveBeenCalled()
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/order',
      query: { id: 'xyz789' },
    })
  })
})
