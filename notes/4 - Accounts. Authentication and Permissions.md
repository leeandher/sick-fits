# Advanced React

_Some helpful notes for developing modern applications in React. These may be a good reference!_

---

## Authentication Flow

The way the authentication of the Server-side Rendered application is going to go is entirely through the help of **JSON Web Tokens (JWTs)** in _cookies_. JWTs are useful little identifiers that we can attach to our requests to and from the server so that we know what permissions the user has associated with them and what mutations/queries are valid for our GraphQL server to do.

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

The permissions field above is formatted oddly simply because it is an `enum` in GraphQL, you can see more about how these work in the other note: _2 - Server Side GraphQL_.

## Sign In/Out

The sign up is probably the most complicated mutation to write. To sign in, or sign out really doesn't require any writes to the data store, just some manipulation of the cookies. If a user signs in, we should check their password and username against our database, and assign them the proper credentials via JWT, and if they sign out, simply revoke the JwT their browser has assigned!

First things first, we are going to define these mechanisms as `mutations` instead of `queries`. The reason for this, is that something in our application is actually changing when we perform this request, even if it isn't related to the database. On the client-side, the UI and permissions are _mutating_, thus `mutation`.

**Sign In**

```js
async signIn(parent, args, ctx, info) {
  // 1. Validate the incoming data
  const email = args.email.toLowerCase()
  const user = await ctx.db.query.user({ where: { email } }, `{id password}`)
  if (!user) {
    throw new Error(`😫 No user found with that email (${email})! 😫`)
  }
  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error(`❌ Invalid password, try again! ❌`)
  }

  // Create the JWT for this specific uses
  const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
  // Set the JWT on the response as a cookie
  ctx.response.cookie('sf-token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
  })
  return ctx.db.query.user({ where: { email } }, info)
},
```

The cookie generation is done exactly like the sign up system, since the user is _signed in_ after _signing up_.

**Sign Out**

Here is actually a good place to explain how custom types can be passed as a response. In some cases such as this, you'll want to just send a message back from the API rather than information about the user who just signed out, since it wouldn't be useful to the app.

In that case you just add it to the `schema.graphql` file as another type:

```graphql
type SuccessMessage {
  message: String
}

type Mutation {
  signOut: SuccessMessage
}
```

Now your resolver has to return the data with the matching shape:

```js
async signOut(parent, args, ctx, info) {
 ctx.response.clearCookie('sf-token', {
   httpOnly: true,
   maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
 })
 return { message: 'See ya!' }
}

```

Another important note is that the `clearCookie` method attached to the response is actually requires the same parameters as initially provided to it in order to ensure the browser complies ([Check out the Docs](http://expressjs.com/en/api.html#res.clearCookie))

## Request Security

One important aspect of building an full-scale GraphQL API with Prisma that you should take into account is the accessible fields available to the user. Since the client determines the information it can receive, you have to make sure that certain fields aren't available to the client, and only for the resolvers. These are things like account credentials, emails, 2FA sources, passwords, reset tokens.

This can easily pass you by if you just import the generated schema from Prisma:

```graphql
# import * from './generated/prisma.graphql'

type Query {
  ...
}

type Mutation {
  ...
}
```

The comment acts as an import statement for the prisma types, while this is good in most cases, for verbosity, it can be harmful in others. Take a `User` type for example:

```graphql
type User implements Node {
  id: ID!
  name: String!
  email: String!
  password: String!
  resetToken: String
  resetTokenExpiry: Float
  permissions: [Permission!]!
  updatedAt: DateTime!
  createdAt: DateTime!
}
```

In this case, any time a query returns a `User` the, client can request the hashed password, or reset token.

This can be fixed by just removing the fields and overwriting the previous type:

```graphql
# import * from './generated/prisma.graphql'

type User {
  id: ID!
  name: String!
  email: String!
  permissions: [Permission!]!
}

type Query {
  ...
}

type Mutation {
  ...
}
```

## Password Reset Flow

Implementing a password reset flow can be boiled down to just implementing a few extra routes in the API. As long as you have the following mutations and steps, you should be good to go:

1. Client-side email field to send the request
2. Perform `requestReset` mutation
3. In this mutation, check if the email is valid
4. Set a `randomBytes` token on the account (**resetToken**)
5. Set an expiry for the token in a timestamp (**resetTokenExpiry**)
6. Send the token to the account holder's email via URL
7. Setup the URL parsing on the client-side to read the token
8. Check if the token is valid
9. Check if the token is expired
10. Prompt for a new password
11. Update the new password, revoke the reset token and expiry
12. Set the cookie, login the user

## Sending Mail

There are really only a few parts to sending mail with Node.js:
  - The templating strategy
  - The mail servers

For development purposes, one of the easiest solutions is to go with a service such as [mailtrap.io](https://mailtrap.io/). They provide you with a demo mailbox to send mail from, and all you need to do is pass in credentials (which should be in an environment file) to your `NodeMailer` client (a helpful library for easily sending mail):
```js
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST // "smtp.mailtrap.io",
  port: process.env.MAIL_PORT // 2525,
  auth: {
    user: process.env.MAIL_USER // "38700db53edc57",
    pass: process.env.MAIL_PASS // "076761e33e4b71"
  }
});
```
Without implementing a templating strategy, you're left to just setting basic inline styles on `html` as a string, which works just fine. You can check out solutions such as [MJML](https://mjml.io/) for scalable alternative templating strategies.

You can send basic emails as follows:
```js
await transport.sendMail({
  fromt: 'me@leander.xyz',
  to: user.email,
  subject: '🙌 Reset your Password! 🙌',
  html: `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
  ">
    <h2>Hey there!</h2>
    <p>
    Your password reset token is here! \n\n <a href="${
      process.env.FRONTEND_URL
    }/reset?resetToken=${resetToken}">Click here to reset your password!</a>
    </p>
    <p>✌, Leander Rodrigues</p>
  </div>`
})
```

## Relationships

- datamodel file
- connect in mutation
- check for userid cookie on request

# Creating a Gate Sign in Component

- routing fixes
- renderprops children or sign in component
