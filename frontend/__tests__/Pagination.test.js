import { mount } from 'enzyme'
import toJSON from 'enzyme-to-json'
import wait from 'waait'
import { MockedProvider } from 'react-apollo/test-utils'
import Router from 'next/router'

import Pagination, { PAGINATION_QUERY } from '../components/Pagination'

/**
 * A helper function to create mocks for the given number of items
 * @param count The count of items to mock
 */
function paginationMocks(count) {
  return [
    {
      request: { query: PAGINATION_QUERY },
      result: {
        data: {
          itemsConnection: {
            __typename: 'aggregate',
            aggregate: {
              count: count,
              __typename: 'count',
            },
          },
        },
      },
    },
  ]
}

// Mock the NextJS router
Router.router = {
  push() {},
  prefetch() {},
}

describe('<Pagination />', () => {
  it('renders correct pagination for 10 items', async () => {
    const wrapper = mount(
      <MockedProvider mocks={paginationMocks(10)}>
        <Pagination page={1} />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    const pagination = wrapper.find('div[data-test="pagination"]')
    expect(toJSON(pagination)).toMatchSnapshot()
    expect(pagination.text()).toContain('Page 1 of 3')
    expect(pagination.text()).toContain('10 Items Total')
  })
  it('disables prev button on first page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={paginationMocks(10)}>
        <Pagination page={1} />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    const prevLink = wrapper.find('a.prev')
    const nextLink = wrapper.find('a.next')
    expect(prevLink.prop('aria-disabled')).toBe(true)
    expect(nextLink.prop('aria-disabled')).toBe(false)
  })
  it('disables next button on last page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={paginationMocks(10)}>
        <Pagination page={3} />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    const prevLink = wrapper.find('a.prev')
    const nextLink = wrapper.find('a.next')
    expect(prevLink.prop('aria-disabled')).toBe(false)
    expect(nextLink.prop('aria-disabled')).toBe(true)
  })
  it('enables all buttons on a middle page', async () => {
    const wrapper = mount(
      <MockedProvider mocks={paginationMocks(10)}>
        <Pagination page={2} />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    const prevLink = wrapper.find('a.prev')
    const nextLink = wrapper.find('a.next')
    expect(prevLink.prop('aria-disabled')).toBe(false)
    expect(nextLink.prop('aria-disabled')).toBe(false)
  })
})
