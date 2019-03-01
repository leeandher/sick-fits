const Mutation = {
  createDog(parent, args, ctx, info) {
    // Create a dog!
    console.log(args)
  }
}

module.exports = Mutation
