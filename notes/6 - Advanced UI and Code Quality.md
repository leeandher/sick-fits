# Advanced React

_Some helpful notes for developing modern applications in React. These may be a good reference!_

---

## Composition

When using the render-props methodology for React Components, you might get into some situations where your components become heavily nested in an incomprehensible series of `{}`s and `()`s. To fix this there's a common sort of structural pattern known as **composition**.

It usually involves a library or some sort of helper function which will take in a series of higher order components, and wrap them around each other, making it easier to pass the info down to your actual application. We can walk through an example below:

Say we have a component that needs to to perform a few different GraphQL operations, all nested within one another, with Apollo. As they recommend, you'd use render props to (as an example) query `localState`, render props to modify `localState` and maybe another render props to query some other user info or something.

It'd look something like this:

```js
render() {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({data: {user}}) => (
        <Query query={LOCAL_STATE_QUERY}>
          {({data: localState}) => {
            // some localState operation check or other code
            return (
              <Mutation mutation={TOGGLE_LOCAL_STATE_MUTATION}>
                {(toggleFunction) => {
                  // some actual JSX markup which uses the 
                  // - user
                  // - localState
                  // - toggleFunction
                }}
              </Mutation>
            )
          }}
        </Query>
      )}
    </Query>
  )
}
```

Boy howdy, that thing sure is ugly, and that's just so that your markup can get some actual data. By using _composition_ we can clean that thing up. Let's take the `adopt` function from `react-adopt` as an example.

```js
const Composed = adopt({
  user: <User />,
  toggleCart: <Mutation mutation={TOGGLE_CART_MUTATION} />,
  localState: <Query query={LOCAL_STATE_QUERY} />
})

// Now inside the component...

render() {
  return (
    <Composed>
      {({user, localState, toggleFunction}) => {
        // some actual JSX markup which uses the 
        // - user
        // - localState
        // - toggleFunction
      }}
    </Composed>
  )
}
```

What we've done here is provide a wrapper component which goes ahead and nests the render props into one component, which itself provides a new render prop containing keys we declare holding all of that HOC's payload. There are many other looks that this pattern can take depending on the library or implementation but the concept is essentially the same.

##


<!-- Fixing weird issues with  -->
```js
user: ({ render }) => <User>{render}</User>,
```
even though this works

```js
user: <User />,

```

## Consumers
## Debouncing Event functions
## Downshift

SSR DOWNSHIFT RESET COUNTER ID