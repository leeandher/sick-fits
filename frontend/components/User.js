import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    me {
      id
      email
      name
      permissions
      orders {
        id
      }
      cart {
        id
        quantity
        item {
          id
          title
          price
          image
          description
        }
      }
    }
  }
`

const User = ({ children, ...restOfProps }) => (
  <Query query={CURRENT_USER_QUERY} {...restOfProps}>
    {payload => children(payload)}
  </Query>
)

User.propTypes = {
  children: PropTypes.func.isRequired,
}

export default User
export { CURRENT_USER_QUERY }
