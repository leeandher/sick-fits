const { forwardTo } = require("prisma-binding")

const { hasPermission } = require("../utils")

const Query = {
  /*
  Since the below function operates exactly the same as on the generated schema,
  we can just forward the request instead of rewriting pointless code.
  This is for quick mockups, or API calls without custom logic.

  async items(parent, args, ctx, info) {
    const items = await ctx.db.query.items()
    return items
  }
  */
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  async users(parent, args, ctx, info) {
    // 1. Check if they are logged in
    if (!ctx.request.userId) throw new Error("🙅‍♀️ You must be logged in! 🙅‍♂️")
    // 2. Check if the user has the proper permissions
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"])
    // 3. Query all the users
    return ctx.db.query.users({}, info)
  },
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) return null
    const where = { id: ctx.request.userId }
    return ctx.db.query.user({ where }, info)
  },
  async orders(parent, args, ctx, info) {
    const { userId, user } = ctx.request
    // 1. Check if they are logged in
    if (!userId) throw new Error("🙅‍♀️ You must be logged in! 🙅‍♂️")
    // 2. Check if they are permitted
    if (!user.permissions.includes("ADMIN")) {
      throw new Error("❌ Sorry, you don't have the proper permissions ❌")
    }
    // 3. Query their orders
    return ctx.db.query.orders({ where: { user: { id: userId } } }, info)
  },
  async order(
    parent,
    {
      where: { id }
    },
    ctx,
    info
  ) {
    const { userId, user } = ctx.request
    // 1. Check if they are logged in
    if (!userId) throw new Error("🙅‍♀️ You must be logged in! 🙅‍♂️")
    // 2. Check if the user made the order
    const order = await ctx.db.query.order({ where: { id } }, `{ user { id } }`)
    // 3. Check if the user can see the order
    const isOrderUser = userId === order.user.id
    if (!isOrderUser) {
      throw new Error(
        "❌ Sorry, but this order was not made by your account! ❌"
      )
    }
    const isPermitted = user.permissions.includes("ADMIN")
    if (!isPermitted) {
      throw new Error("❌ Sorry, you don't have the proper permissions ❌")
    }
    // 4. Return the order
    return ctx.db.query.order({ where: { id } }, info)
  }
}

module.exports = Query
