import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  border: 3px solid white;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  font-size: 1.5rem;
  line-height: 1.5;
  margin: 2rem 0;
  p {
    margin: 0;
  }
  .standout {
    border-bottom: 2px solid red;
    grid-column: 2;
  }
  .grid {
    display: grid;
    max-width: 350px;
  }
`
const DemoSignupMessage = () => (
  <Wrapper>
    <p>
      Yo dawg, this is really just a demo so you can use these creds if you
      don't wanna make an account:
    </p>
    <br />
    <div className="grid">
      <p>Email:</p>
      <span className="standout">chris@email.com</span>
      <p>Password:</p>
      <span className="standout">pines</span>
    </div>
  </Wrapper>
)

export default DemoSignupMessage
