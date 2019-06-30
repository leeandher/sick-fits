const { forwardTo } = require("prisma-binding")

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
  me(parent, args, ctx, info) {
    if (!ctx.request.userId) return null
    const where = { id: ctx.request.userId }
    return ctx.db.query.user({ where }, info)
  }
}

module.exports = Query
