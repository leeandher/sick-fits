import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'

import ErrorMessage from './ErrorMessage'
import Table from './styles/Table'
import SickButton from './styles/SickButton'

const ALL_USERS_AND_PERMISSIONS_QUERY = gql`
  query ALL_USERS_AND_PERMISSIONS_QUERY {
    users {
      id
      name
      email
      permissions
    }
    permissions
  }
`

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $permissions: [Permission]
    $userId: ID!
  ) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`

const Permissions = () => (
  <Query query={ALL_USERS_AND_PERMISSIONS_QUERY}>
    {({ data, loading, error }) => {
      if (loading) return null
      const allPermissions = data.permissions
      return (
        <>
          <ErrorMessage error={error} />
          <div>
            <h2>Manage Permissions</h2>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {allPermissions.map(permission => (
                    <th key={permission}>{permission}</th>
                  ))}
                  <th>👇</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(user => (
                  <UserPermissions
                    user={user}
                    allPermissions={allPermissions}
                    key={user.id}
                  />
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )
    }}
  </Query>
)

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array,
    }).isRequired,
  }

  state = {
    permissions: this.props.user.permissions,
  }

  handlePermissionChange = ({ target }, mutationFunction) => {
    const { permissions } = this.state
    const { value, checked } = target
    // 1. Take a copy of the current permissions
    let updatedPermissions = [...permissions]
    // 2. Update the permission
    if (checked) updatedPermissions.push(value)
    else {
      updatedPermissions = updatedPermissions.filter(
        permission => permission !== value,
      )
    }
    // 3. Update the state, run mutation as callback
    this.setState({ permissions: updatedPermissions }, mutationFunction)
  }

  render() {
    const { permissions } = this.state
    const { user, allPermissions } = this.props
    const { name, email } = user
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          userId: user.id,
          permissions,
        }}
      >
        {(updatePermissions, { error, loading }) => {
          return (
            <>
              {error && (
                <tr>
                  <td colspan="9">
                    <ErrorMessage error={error} />
                  </td>
                </tr>
              )}
              <tr>
                <td>{name}</td>
                <td>{email}</td>
                {allPermissions.map(permission => (
                  <td key={permission}>
                    <label htmlFor={`${user.id}-permission-${permission}`}>
                      <input
                        type="checkbox"
                        id={`${user.id}-permission-${permission}`}
                        checked={permissions.includes(permission)}
                        value={permission}
                        onChange={e =>
                          this.handlePermissionChange(e, updatePermissions)
                        }
                      />
                    </label>
                  </td>
                ))}
                <td>
                  <SickButton
                    type="button"
                    disabled={loading}
                    onClick={updatePermissions}
                  >
                    Updat{loading ? 'ing' : 'e'}
                  </SickButton>
                </td>
              </tr>
            </>
          )
        }}
      </Mutation>
    )
  }
}

export default Permissions
export { ALL_USERS_AND_PERMISSIONS_QUERY, UPDATE_PERMISSIONS_MUTATION }
