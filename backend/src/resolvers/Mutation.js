const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const stripe = require('../stripe')

const { createEmail, transport } = require('../mail')
const { hasPermission } = require('../utils')

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // Check if the request has the userId on it (attached via cookies)
    if (!ctx.request.userId) {
      throw new Error('🙅‍♂️ You must be logged in to do that! 🙅‍♀️')
    }
    // 'info' passes along query, so that it can get the return data
    return ctx.db.mutation.createItem(
      {
        data: {
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info,
    )
  },

  async updateItem(parent, { id, ...args }, ctx, info) {
    if (!ctx.request.userId) throw new Error('🙅‍♀️ You must be logged in! 🙅‍♂️')
    return ctx.db.mutation.updateItem(
      { where: { id }, data: { ...args } },
      info,
    )
  },

  async deleteItem(parent, { id }, ctx, info) {
    const where = { id }
    // 1. Find the item
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`)
    // 2. Check if they own the item or have the permissions
    const ownsItem = item.user.id === ctx.request.userId
    const hasPermissions = ctx.request.user.permissions.some(permission => {
      return ['ADMIN', 'ITEMDELETE'].includes(permission)
    })
    if (!ownsItem || !hasPermissions) {
      throw new Error("🙅‍♀️ You don't have permission to do that! 🙅‍♂️")
    }
    // 3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info)
  },

  async signUp(parent, { name, ...args }, ctx, info) {
    const email = args.email.toLowerCase()
    if (args.password !== args.confirmPassword) {
      throw new Error(`✏️ Passwords do not match! ✏️`)
    }
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          name,
          email,
          password,
          permissions: {
            set: ['USER', 'ADMIN'],
          },
        },
      },
      info,
    )
    // Create the JWT for this specific app
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // Set the JWT on the response as a cookie
    ctx.response.cookie('sf-token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    })
    return user
  },

  async signIn(parent, args, ctx, info) {
    const email = args.email.toLowerCase()
    const user = await ctx.db.query.user({ where: { email } }, `{id password}`)
    if (!user) {
      throw new Error(`😫 No user found with that email (${email})! 😫`)
    }
    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
      throw new Error(`❌ Invalid password, try again! ❌`)
    }

    // Create the JWT for this specific app
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // Set the JWT on the response as a cookie
    ctx.response.cookie('sf-token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    })
    return ctx.db.query.user({ where: { email } }, info)
  },

  async signOut(parent, args, ctx, info) {
    ctx.response.clearCookie('sf-token', {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    })
    return { message: 'See ya!' }
  },

  async requestReset(parent, { email }, ctx, info) {
    // 1. Check if this is a real user
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) {
      throw new Error(`😫 No user found with that email (${email})! 😫`)
    }
    // 2. Set a reset token and expiry on that user
    const resetToken = (await promisify(randomBytes)(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60 // 1h from now
    await ctx.db.mutation.updateUser({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })
    // 3. Email them the reset token
    await transport.sendMail({
      fromt: 'me@leander.xyz',
      to: user.email,
      subject: '🙌 Reset your Sick Fits Password! 🙌',
      html: createEmail(
        `Your password reset token is here! \n\n <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click here to reset your password!</a>`,
      ),
    })

    // 4. Return the message
    return {
      message: `📧 Success! 📧 The reset token has been sent to your email (${email})`,
    }
  },

  async resetPassword(parent, { resetToken, ...args }, ctx, info) {
    // 1. Verify the new password
    if (args.password !== args.confirmPassword) {
      throw new Error(`✏️ Passwords do not match! ✏️`)
    }
    // 2. Find the user with the associated resetToken
    // 3. Check if it's expired
    const [user] = await ctx.db.query.users({
      where: { resetToken, resetTokenExpiry_gt: parseFloat(Date.now()) },
    })
    if (!user) {
      throw new Error(`😫 Reset token is expired or invalid! 😫`)
    }
    // 4. Hash the password
    const password = await bcrypt.hash(args.password, 10)
    // 5. Save it to the user and clear the reset fields
    const updatedUser = await ctx.db.mutation.updateUser(
      {
        where: { id: user.id },
        data: {
          password,
          resetToken: null,
          resetTokenExpiry: null,
        },
      },
      info,
    )
    // Create the JWT for this specific app
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    ctx.response.cookie('sf-token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
    })
    // 8. Return the user
    return updatedUser
  },

  async addToCart(parent, args, ctx, info) {
    const { userId } = ctx.request
    // 1. Make sure they are signed in
    if (!userId) throw new Error('🙅‍♀️ You must be logged in! 🙅‍♂️')
    // 2. Query the user's current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        item: { id: args.id },
        user: { id: userId },
      },
    })
    // 3. Check if that item is already in their cart
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        },
        info,
      )
    }
    // 4. Increment if so, add CartItem if not
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId },
          },
          item: {
            connect: { id: args.id },
          },
        },
      },
      info,
    )
  },

  async removeFromCart(parent, { id }, ctx, info) {
    const { userId } = ctx.request
    // 1. Check if they are logged in
    if (!userId) throw new Error('🙅‍♀️ You must be logged in! 🙅‍♂️')
    // 2. Find the cart item
    const cartItem = await ctx.db.query.cartItem(
      { where: { id } },
      `{
      id
      user {
        id
      }
    }`,
    )
    if (!cartItem) throw new Error('🙅‍♂️ No cart item found! 🤷‍♀️')
    // 3. Make sure they own the cart item
    if (cartItem.user.id !== userId) throw new Error("❌ You can't do that ❌")
    // 4. Delete the cart item from their cart
    return ctx.db.mutation.deleteCartItem({ where: { id } }, info)
  },

  async updatePermissions(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) throw new Error('🙅‍♀️ You must be logged in! 🙅‍♂️')
    // 2. Get the current user
    const currentUser = ctx.request.user
    // 3. Check if they have permissions to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])
    // 4. Update the permissions
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info,
    )
  },

  async createOrder(parent, { token }, ctx, info) {
    // 1. Query the current user, make sure they're signed in
    const { userId } = ctx.request
    if (!userId) throw new Error('🙅‍♀️ You must be logged in! 🙅‍♂️')
    const user = await ctx.db.query.user(
      { where: { id: userId } },
      `{
        id 
        name 
        email 
        cart { 
          id
          quantity
          item { 
            title 
            price 
            id 
            description
            image
            largeImage
          }
        }
      }`,
    )
    // 2. Recalculate the total for the price
    const amount = user.cart.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.item.price,
      0,
    )
    // 3. Create the stripe charge
    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: token,
    })
    // 4. Convert the CartItems to OrderItems
    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        ...cartItem.item,
        quantity: cartItem.quantity,
        user: { connect: { id: userId } },
      }
      delete orderItem.id
      return orderItem
    })
    // 5. Create the Order
    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: userId } },
      },
    })
    // 6. Clear the user's cart, delete the CartItems
    const cartItemIds = user.cart.map(cartItem => cartItem.id)
    await ctx.db.mutation.deleteManyCartItems({ where: { id_in: cartItemIds } })
    // 7. Return the order to the frontend
    return order
  },
}

module.exports = Mutation
