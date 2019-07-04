const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    // 'info' passes along query, so that it can get the return data
    return ctx.db.mutation.createItem({ data: { ...args } }, info)
  },

  async updateItem(parent, { id, ...args }, ctx, info) {
    // TODO: Check if they are logged in
    return ctx.db.mutation.updateItem(
      { where: { id }, data: { ...args } },
      info
    )
  },

  async deleteItem(parent, { id }, ctx, info) {
    const where = { id }
    const item = await ctx.db.query.item({ where }, `{ id title }`)
    // TODO: Check for user permissions on this item
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
            set: ['USER']
          }
        }
      },
      info
    )
    // Create the JWT for this specific uses
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // Set the JWT on the response as a cookie
    ctx.response.cookie('sf-token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
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

    // Create the JWT for this specific uses
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // Set the JWT on the response as a cookie
    ctx.response.cookie('sf-token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    })
    return ctx.db.query.user({ where: { email } }, info)
  },

  async signOut(parent, args, ctx, info) {
    ctx.response.clearCookie('sf-token', {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
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
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })
    console.log(res)
    return { message: resetToken }
    // 3. Email them the reset token
  }

  // async resetPassword(parent, args, ctx, info) {
  // 1. Find the user with the associated resetToken
  // 2. Check if it's expired
  // 3. Verify the new password
  // 4. Save it to the user and clear the reset fields
  // 5. Return the user
  // }
}

module.exports = Mutation
