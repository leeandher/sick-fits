import React from 'react'

import PleaseSignIn from '../components/PleaseSignIn'
import Profile from '../components/Profile'

const ProfilePage = ({ query }) => (
  <div>
    <PleaseSignIn>
      <Profile />
    </PleaseSignIn>
  </div>
)

export default ProfilePage
