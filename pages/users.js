import User from '../components/user'

const UserList = ({ users }) => {
  return <>
      <h1>List of users</h1>
      {users.map(user => {
        return (
          <div key={user.id}>
            <User user={user} />
          </div>
        )
      })}
    </>
}

export default UserList

export const getStaticProps = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  const data = await res.json()
  console.log(data)

  return {
    props: {
      users: data
    }
  }
}
