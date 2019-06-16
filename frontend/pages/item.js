import React from 'react'

import SingleItem from '../components/SingleItem'

const ItemPage = ({ query }) => (
  <div>
    <SingleItem id={query.id} />
  </div>
)

export default ItemPage
