import { mount } from 'enzyme'
import wait from 'waait'
import toJSON from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'

import RequestReset, {
  RESET_REQUEST_MUTATION,
} from '../components/RequestReset'

const mocks = [
  {
    request: {
      query: RESET_REQUEST_MUTATION,
      variables: { email: 'me@leander.xyz' },
    },
    result: {
      data: { requestReset: { message: 'success', __typename: 'Message' } },
    },
  },
]

describe('<RequestReset />', () => {
  it('renders and matches the snapshot', async () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>,
    )
    await wait()
    wrapper.update()
    const form = wrapper.find('form[data-test="form"]')
    expect(toJSON(form)).toMatchSnapshot()
  })
  it('calls the mutation', async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>,
    )
    // Simulate typing an email
    wrapper.find('input').simulate('change', {
      target: { name: 'email', value: 'me@leander.xyz' },
    })
    wrapper.find('form[data-test="form"]').simulate('submit')
    // Submit the form
    await wait()
    wrapper.update()
    expect(wrapper.debug()).toContain('success')
  })
})
