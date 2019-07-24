import React from 'react'

import UpdateItem from '../components/UpdateItem'

const UpdatePage = ({ query }) => (
  <div>
    <p>Update!</p>
    <UpdateItem id={query.id} />
  </div>
)

export default UpdatePage
