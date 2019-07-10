const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')

const { createEmail, transport } = require('../mail')

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
              id: ctx.request.userId
            }
          },
          ...args
        }
      },
      info
    )
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
    // Create the JWT for this specific app
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

    // Create the JWT for this specific app
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
    await ctx.db.mutation.updateUser({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })
    // 3. Email them the reset token
    const mailRes = await transport.sendMail({
      fromt: 'me@leander.xyz',
      to: user.email,
      subject: '🙌 Reset your Sick Fits Password! 🙌',
      html: createEmail(
        `Your password reset token is here! \n\n <a href="${
          process.env.FRONTEND_URL
        }/reset?resetToken=${resetToken}">Click here to reset your password!</a>`
      )
    })

    // 4. Return the message
    return {
      message: `📧 Success! 📧 The reset token has been sent to your email (${email})`
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
      where: { resetToken, resetTokenExpiry_gt: parseFloat(Date.now()) }
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
          resetTokenExpiry: null
        }
      },
      info
    )
    // Create the JWT for this specific app
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    ctx.response.cookie('sf-token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    })
    // 8. Return the user
    return updatedUser
  }
}

module.exports = Mutation
