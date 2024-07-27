import { useQuery } from '@apollo/client';
import { findMe } from '../queries';
import Booksfilter from './Booksfilter';



const Recommend = (props) => {
    
  const result = useQuery(findMe)

  if ( result.loading) {
    return <div>loading...</div>
  }

  const myFavGenre = result.data.me.favoriteGenre

    if (!props.show) {
        return null
    }

  return (
    <>
      <h2>Recommendations</h2>
        <div>books in your favourite genre <b>{ myFavGenre }</b></div>
        <Booksfilter filter={myFavGenre} />
    </>
    
  )
}

export default Recommend
