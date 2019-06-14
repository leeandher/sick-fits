import React from 'react'
import Link from 'next/link'

import CreateItem from '../components/CreateItem'

const Sell = props => (
  <div>
    <p>Sell!</p>
    <CreateItem />
    <Link href="/">
      <a>Home!</a>
    </Link>
  </div>
)

export default Sell
