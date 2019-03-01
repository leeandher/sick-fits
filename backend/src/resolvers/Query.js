const Query = {
  dogs(parent, args, ctx, info) {
    return [
      { name: 'Snickers', breed: 'pibble', age: 3 },
      { name: 'Sunny', breed: 'corgo', age: 1 },
      { name: 'Smoak', breed: 'pibble', age: 2 }
    ]
  }
}

module.exports = Query
