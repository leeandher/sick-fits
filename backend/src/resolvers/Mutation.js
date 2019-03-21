const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if they are logged in
    // 'info' passes along query, so that it can get the return data
    const item = await ctx.db.mutation.createItem({ data: { ...args } }, info)
    return item
  }
}

module.exports = Mutation
