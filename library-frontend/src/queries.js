import { gql } from '@apollo/client'

export const BOOK_ADDED = gql`
  subscription Subscription {
  bookAdded {
    title
    published
    author {
      name
      id
    }
    genres
  }
}
`

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`

export const findMe = gql`
  query {
    me {
      favoriteGenre
      username
      id
    }
  }
`


export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`

export const ALL_BOOKS= gql`
query AllBooks($genre: String, $author: String) { 
  allBooks (genre: $genre author: $author) {
    title
    published
    author {
      name
      id
    }
  }
}
`


export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name
    born
    bookCount
    id
  }
}
`

export const CREATE_BOOK = gql`
mutation AddBook($title: String!, $published: Int!, $author: String!, $genres: [String]!) {
  addBook(title: $title, published: $published, author: $author, genres: $genres) {
    title
    author {
    name
    id
    }
    published
    genres
    id
  }
}
`

export const EDIT_AUTHOR = gql `
mutation EditAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
  }
}
`