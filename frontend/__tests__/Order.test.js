import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'

import Order, { SINGLE_ORDER_QUERY } from '../components/Order'
import { fakeOrder } from '../lib/testUtils'

const mocks = [
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: 'ord123' } },
    result: { data: { order: fakeOrder() } },
  },
  {
    request: { query: SINGLE_ORDER_QUERY, variables: { id: 'ord124' } },
    result: { errors: [{ message: 'Order not found!' }] },
  },
]

describe('<Order />', () => {
  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id="ord123" />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    expect(toJSON(wrapper.find('div[data-test="order"]'))).toMatchSnapshot()
  })

  it('has a proper loading state', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id="ord123" />
      </MockedProvider>,
    )
    expect(wrapper.text()).toContain('⚡ Loading... ⚡')
  })

  it('has a proper error state', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id="ord124" />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    expect(wrapper.text()).toContain('Order not found!')
  })
})
