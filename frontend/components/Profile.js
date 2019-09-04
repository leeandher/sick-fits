import React from 'react'
import styled from 'styled-components'
import { format, formatDistance } from 'date-fns'
import Head from 'next/head'
import formatMoney from '../lib/formatMoney'
import ErrorMessage from './ErrorMessage'
import User from './User'

const ProfileWrapper = styled.div``

const Profile = () => {
  return (
    <User>
      {({ data: { me } }) => (
        <ProfileWrapper>
          <Head>
            <title>Sick Fits | {me.name}</title>
          </Head>
          <p>
            Profile is {formatDistance(Date.now(), Date.parse(me.createdAt))}{' '}
            old
          </p>
          <p>{format(Date.parse(me.createdAt), 'MMMM d, YYY h:mm a')}</p>
          {JSON.stringify(me)}
        </ProfileWrapper>
      )}
    </User>
  )
}

export default Profile
