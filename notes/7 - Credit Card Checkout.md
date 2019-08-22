# Advanced React

_Some helpful notes for developing modern applications in React. These may be a good reference!_

---

## Introduction to Stripe

Stripe is a really useful way for handling credit cards in your online store. The main selling point is that as a developer, you no longer have to deal with the hassle of handling your user's credit cards and associated data, or worry about the charges, taxes, international fees, exchange rates, or any of that stuff. Instead, all you have to do in your application, is pass the user through a **Stripe Checkout**, and then parse the information that comes back from that.

## How Stripe works

By _parse the information_, I really just mean to extract the one important part that comes as a response from the Stripe API; the **charge token**. This is the beautiful part about Stripe, after the user enters their credit card information, Stripe will save that, and set up an associated Credit Card charge for the dollar amount you send to them. Next, you'll receive that charge token, and essentially, just call a function with it as an argument that charges the card! On your end, you never see the card number, CVC, or any of the user's private info, just this charge token that Stripe sets up.

## Setting up Stripe (Frontend)

With React, setting up an entire Stripe checkout flow is really just a few steps:
1. Install the official node module `react-stripe-checkout`, import `StripeCheckout` into your checkout procedure. 
2. Now, you need to setup a Stripe account over at [stripe.com](https://www.stripe.com).
3. Make sure you account is either in _Test_, or _Production_, depending on your needs, and copy the **Publishable API Key**
4. Setup the HOC `StripeCheckout` component with your applications props:
   
```js
  <StripeCheckout
    amount={calcTotalPrice(user.cart)}
    name="My App"
    description={`Order of ${this.totalItems(user.cart)} items!`}
    image={user.cart[0].item.image}
    stripeKey={PUBLISHABLE_STRIPE_KEY}
    currency="CAD"
    email={user.email}
    token={res => this.onToken(res, createOrder)}
  >
    {children}
  </StripeCheckout>
```
The `onToken` method does a lot of the heavy lifting for this application's frontend. The rest of the code is just information to help Stripe with the CC Charge, the `onToken` method is where we will send the actual **charge token** to the backend of our application. In this example, `createOrder` is a function coming from a GraphQL mutation HOC.

## Setting up Stripe (Backend)

On the backend, setting up a stripe has a few more gotchas associated with it:

1. Set up an _OrderItem_ type, based on your actual _Item_ type.
```graphql
type Item {
  id: ID! @id
  title: String!
  description: String!
  image: String
  largeImage: String
  price: Int!
  updatedAt: DateTime! @updatedAt
  createdAt: DateTime! @createdAt
  user: User!
}

type OrderItem {
  id: ID! @id
  title: String!
  description: String!
  image: String!
  largeImage: String!
  price: Int!
  quantity: Int! @default(value: 1)
  user: User
}
```
This is done for the user when they complete the purchase, saving a copy of the items as they were for their records. If the item is ever deleted, or the description/price/title of it were to change, that wouldn't be reflected on their previous order or invoice!


<!-- - Order and OrderItems types (and why theyre important) -->

## Testing with Stripe