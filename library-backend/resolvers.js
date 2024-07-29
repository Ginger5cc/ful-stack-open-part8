const Book = require('./models/book')
const Author = require('./models/author')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()


const resolvers = {
    Query: {
      bookCount: async () => await Book.collection.countDocuments(),
      authorCount : async () => await Author.collection.countDocuments(),
      allBooks: async(root, args) => {
        if (!args.author && !args.genre) {
          const booklist = await Book.find({}).populate('author')
          return booklist
        } else if (args.author && !args.genre) { 
          const authorObject = await Author.findOne({ name: args.author})
          return await Book.find({ author: authorObject._id }).populate('author')
        } else if (!args.author && args.genre) { 
          return await Book.find({ genres: {  $all: args.genre } }).populate('author')
        } else {
          const authorObject = await Author.findOne({ name: args.author})
          return await Book.find({ author: authorObject._id, genres: {  $all: args.genre } }).populate('author')
        }
      },
      allAuthors: async () => await Author.find({}),
      me: (root, args, context) => {
        return context.currentUser
      },
      allGenres: async () => await Book.distinct( "genres" ),
    },
    Author: {
      bookCount: async (root) => {
        const booklist = await Book.find( {author: root._id})
        return booklist.length
      },
    },
    Mutation: {
      addBook: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
        let authorObject = await Author.findOne({ name: args.author}) 
        if (!authorObject) {
          authorObject = new Author ({ name: args.author })
          authorObject.save()
        }
  
        const book = new Book({ ...args, author: authorObject._id})
        try {
          await book.save()
        } catch (error) {
          throw new GraphQLError('Saving user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }

        pubsub.publish('BOOK_ADDED', { bookAdded: book.populate('author') })
        return book.populate('author')
      },
      editAuthor: async (root, args, context) => {
        const currentUser = context.currentUser
        if (!currentUser) {
          throw new GraphQLError('not authenticated', {
            extensions: {
              code: 'BAD_USER_INPUT',
            }
          })
        }
        let authorObject = await Author.findOne({ name: args.name}) 
        authorObject.born = args.setBornTo
  
        try {
          await authorObject.save()
        } catch (error) {
          throw new GraphQLError('Saving number failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }
  
        return authorObject
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
    
        return user.save()
          .catch(error => {
            throw new GraphQLError('Creating the user failed', {
              extensions: {
                code: 'BAD_USER_INPUT',
                invalidArgs: args.username,
                error
              }
            })
          })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
    
        if ( !user || args.password !== 'secret' ) {
          throw new GraphQLError('wrong credentials', {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          })        
        }
    
        const userForToken = {
          username: user.username,
          id: user._id,
        }
    
        return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
      }, 
    },
    Subscription: {
        bookAdded: {
          subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
        },
    },

  }
  
  module.exports = resolvers