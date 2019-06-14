# Advanced React

_Some helpful notes for developing modern applications in React. These may be a good reference!_

---

## Setting up Apollo Client (w/ Next, and SSR)

- boilerplate
  - withData.js
  - \_app.js
- renderprops
  - payload
  - data
  - error
  - loading
- HOCs
  - withItems (adds the Item Query etc)

renderprops with Query
take a function with the first arguement as (payload)

the Mutation component takes (mutationFunction and payload as arguments)

fieldset for disabling on submit

routing can be used to redirect on submit if e.prevent default stops from refreshing.
