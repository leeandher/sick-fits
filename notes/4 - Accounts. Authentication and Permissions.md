# Advanced React

_Some helpful notes for developing modern applications in React. These may be a good reference!_

---

## Authentication Flow

The way the authentication of the Server-side Rendered application is going to go is entirely through the help of **JSON Web Tokens (JWTs)** in *cookies*. JWTs are useful little identifiers that we can attach to our requests to and from the server so that we know what permissions the user has associated with them and what mutations/queries are valid for our GraphQL server to do.

They are ideally sent with every request, an a common way to do so is by setting them in the user's Local Storage of their web browser. The problem with this is that if our application is SSR'd, the initial request isn't sent with the JWT so we will actually send them an SSR'd view of the non-authenticated view, which will flicker in 1-2s to the authenticated view once our browser receives a request for its Locally Stored content.

By attaching the JWTs to our cookies, they will be sent to the server with every single request, meaning that our SSR'd initial view ill be the an authenticate one, i.e. with a cart, or profile picture, etc!

## Sign Up

When a user signs up, there are a few things that need to be done in order to preserve this authentication flow. They are easy to forget and can be a hassle down the line if you have more and more users accessing your applications:
  1. Lowercase the email
  2. Hash the password
  3. Create the User in the database (with the new password/email values)
  4. Create a JWT for the user (preferably with their ID)
  5. Set the JWT on the response as a cookie

The following code snippet is an example of how to implement the sign-up resolver:
```js
async signUp(parent, args, ctx, info) {
  const email = args.email.toLowerCase();
  const password = await bcrypt.hash(args.password, 10);
  const user = await ctx.db.mutation.createUser(
    {
      data: {
        ...args,
        email,
        password,
        permissions: {
          set: ["USER"]
        }
      }
    },
    info
  );
  // Create the JWT for this specific uses
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
  // Set the JWT on the response as a cookie
  ctx.response.cookie("token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
  });
  return user;
}
```

The permissions field above is formatted oddly simply because it is an `enum` in GraphQL, you can see more about how these work in the other note: *2 - Server Side GraphQL*.

