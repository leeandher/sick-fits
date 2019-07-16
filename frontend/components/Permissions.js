import { Query } from 'react-apollo'
import gql from 'graphql-tag'

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
    __type(name: "Permission") {
      name
      enumValues {
        name
      }
    }
  }
`

const Permissions = props => (
  <Query query={ALL_USERS_AND_PERMISSIONS_QUERY}>
    {({ data, loading, error }) => {
      const allPermissions = data.__type.enumValues.map(({ name }) => name)
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
                  <User
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

class User extends React.Component {
  render() {
    const { user, allPermissions } = this.props
    const { name, email, permissions } = user
    return (
      <tr>
        <td>{name}</td>
        <td>{email}</td>
        {allPermissions.map(permission => (
          <td key={permission}>
            <label htmlFor={`${user.id}-permission-${permission}`}>
              <input
                type="checkbox"
                name={`${user.id}-permission-${permission}`}
                checked={permissions.includes(permission)}
              />
            </label>
          </td>
        ))}
        <td>
          <SickButton>Update</SickButton>
        </td>
      </tr>
    )
  }
}

export default Permissions
export { ALL_USERS_AND_PERMISSIONS_QUERY }
