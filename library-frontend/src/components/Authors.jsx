import { useQuery, useMutation } from '@apollo/client';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries';
import { useState } from 'react'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [ editAuthor ] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  const [born, setBorn] = useState('')
  const [authorname, setAuthorname] = useState('')

  if (result.loading) {
    return <div>loading...</div>
  }
  if (!props.show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
  
    editAuthor({  variables: { name: authorname, setBornTo: Number(born) } })
    console.log('edit author born year...')

    setAuthorname('')
    setBorn('')
  }
  console.log('authorname is', authorname)
  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p></p>
      <h2>Set Birthyear</h2>
      <form onSubmit={submit}>
        <select
        value={ authorname }
        onChange={({ target }) => setAuthorname(target.value)}
        >
        {authors.map(a => 
        <option 
          key={a.name}
          value={a.name}
          >{a.name}</option>
        )}
        </select>
        <div>
            Born
            <input
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
        </div>
      <button>update author</button>
      </form>
    </div>
  )
}

export default Authors
