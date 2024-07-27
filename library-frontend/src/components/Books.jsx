import { useQuery } from '@apollo/client';
import { ALL_GENRES } from '../queries';
import Booksfilter from './Booksfilter';
import { useState } from 'react';

const Books = (props) => {
  const [filter, setFilter] = useState('')
  const result = useQuery(ALL_GENRES)

  if ( result.loading) {
    return <div>loading...</div>
  }
  const genres = result.data.allGenres

  if (!props.show) {
    return null
  }

  return (
    <div>
      <h2>Books</h2>
      <Booksfilter filter={ filter } />
      <button onClick = {() => setFilter('') }>All Genre</button>
      {genres.map( (n, idx) => <button key={idx} onClick = {() => setFilter(n) }>{n}</button>)}
      
    </div>
  )
}

export default Books
