const { forwardTo } = require('prisma-binding')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db')
  /*
  
  Since the below function operates exactly the same as on the generated schema,
  we can just forward the request instead of rewriting pointless code.
  This is for quick mockups, or API calls without custom logic.

  async items(parent, args, ctx, info) {
    const items = await ctx.db.query.items()
    return items
  }
  */
}

module.exports = Query
