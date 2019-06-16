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
  }
}

module.exports = Mutation
