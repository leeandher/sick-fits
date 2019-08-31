import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import Router from 'next/router'
import { MockedProvider } from 'react-apollo/test-utils'

import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem'
import { fakeItem } from '../lib/testUtils'

// Mock the global fetch API
const fakeImage = 'https://example.com/dog.jpg'
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: fakeImage,
    eager: [{ secure_url: fakeImage }],
  }),
})

// Mock the router
Router.router = { push: jest.fn() }

describe('<CreateItem />', () => {
  it('renders and matches snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>,
    )
    const form = wrapper.find('form[data-test="create"]')
    expect(toJSON(form)).toMatchSnapshot()
  })
  it('uploads a file when changed', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>,
    )
    const input = wrapper.find('input[type="file"]')
    input.simulate('change', { target: { files: ['fakeDog.jpg'] } })
    await wait()
    const component = wrapper.find('CreateItem').instance()
    expect(component.state.image).toEqual(fakeImage)
    expect(component.state.largeImage).toEqual(fakeImage)
    expect(global.fetch).toHaveBeenCalled()
    global.fetch.mockReset()
  })
  it('handles state updating', async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>,
    )
    wrapper
      .find('#title')
      .simulate('change', { target: { value: 'Testing', name: 'title' } })
    wrapper.find('#price').simulate('change', {
      target: { value: 50000, name: 'price', type: 'number' },
    })
    wrapper.find('#description').simulate('change', {
      target: { value: 'Super cool testing description', name: 'description' },
    })
  })
  it('creates an item when the form is submitted', async () => {
    const item = fakeItem()
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            price: item.price,
            image: '',
            largeImage: '',
          },
        },
        result: {
          data: {
            createItem: {
              ...item,
              typename: 'Item',
            },
          },
        },
      },
    ]

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>,
    )
    wrapper
      .find('#title')
      .simulate('change', { target: { value: item.title, name: 'title' } })
    wrapper.find('#price').simulate('change', {
      target: { value: item.price, name: 'price', type: 'number' },
    })
    wrapper.find('#description').simulate('change', {
      target: { value: item.description, name: 'description' },
    })
    wrapper.find('form[data-test="create"]').simulate('submit')
    await wait(50)
    expect(Router.router.push).toHaveBeenCalled()
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: '/item',
      query: {
        id: 'abc123',
      },
    })
  })
})
