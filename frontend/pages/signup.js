import React from "react";
import styled from "styled-components";

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

import SignUp from "../components/SignUp";

const SignUpPage = props => (
  <Columns>
    <SignUp />
    <SignUp />
    <SignUp />
  </Columns>
);

export default SignUpPage;
