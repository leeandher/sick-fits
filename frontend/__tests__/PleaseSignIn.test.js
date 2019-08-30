import { mount } from "enzyme"
import toJSON from "enzyme-to-json"
import wait from "waait"
import { MockedProvider } from "react-apollo/test-utils"

import PleaseSignIn from "../components/PleaseSignIn"
import { CURRENT_USER_QUERY } from "../components/User"
import { fakeUser } from "../lib/testUtils"

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } }
  }
]
const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } }
  }
]

describe("<PleaseSignIn />", () => {
  it("renders the sign in dialog to logged out users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(wrapper.find("SignIn").exists()).toBe(true)
    expect(wrapper.text()).toContain("Sign in to continue")
  })
  it("renders the child component when the user is signed in", async () => {
    const Child = () => <p>A child component</p>
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <Child />
        </PleaseSignIn>
      </MockedProvider>
    )
    await wait()
    wrapper.update()
    expect(wrapper.find("SignIn").exists()).toBe(false)
    expect(wrapper.contains(<Child />)).toBe(true)
    expect(wrapper.text()).toContain("A child component")
  })
})
