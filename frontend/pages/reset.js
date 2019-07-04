import React from 'react'

import ResetPassword from '../components/ResetPassword'

const ResetPage = ({ query: { resetToken } }) => (
  <div>
    <ResetPassword resetToken={resetToken} />
  </div>
)

export default ResetPage
