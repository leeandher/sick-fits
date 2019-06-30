import React from "react"
import styled from "styled-components"

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`

import SignUp from "../components/SignUp"
import SignIn from "../components/SignIn"

const SignUpPage = props => (
  <Columns>
    <SignUp />
    <SignIn />
  </Columns>
)

export default SignUpPage
