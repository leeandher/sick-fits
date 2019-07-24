import React from 'react'

import Items from '../components/Items'

const ItemsPage = ({ query }) => (
  <div>
    <Items page={parseFloat(query.page) || 1} />
  </div>
)

export default ItemsPage
