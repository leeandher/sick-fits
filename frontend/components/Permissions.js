import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import ErrorMessage from './ErrorMessage'
import Table from './styles/Table'

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
      const permissionValues = data.__type.enumValues.map(({ name }) => name)
      console.log(permissionValues)
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
                </tr>
              </thead>
              <tbody>test</tbody>
            </Table>
          </div>
        </>
      )
    }}
  </Query>
)

export default Permissions
export { ALL_USERS_AND_PERMISSIONS_QUERY }
