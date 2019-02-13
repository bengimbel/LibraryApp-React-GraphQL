const graphql = require('graphql');
const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLID, 
    GraphQLInt, 
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
 } = graphql;

// var books = [
//     { name: 'BOOK 1', genre: 'Fantasy', id: '1', authorId: '1'},
//     { name: 'BOOK 2', genre: 'Sci-Fi', id: '2', authorId: '2'},
//     { name: 'BOOK 3', genre: 'Fiction', id: '3', authorId: '3'},
//     { name: 'BOOK 4', genre: 'Sci-Fi', id: '4', authorId: '2'},
//     { name: 'BOOK 5', genre: 'Fiction', id: '5', authorId: '3'},
//     { name: 'BOOK 6', genre: 'Fiction', id: '6', authorId: '3'},
// ]

// var authors = [
//     { name: 'Bob', age: 40, id: '1'},
//     { name: 'Chris', age: 50, id: '2'},
//     { name: 'Dan', age: 60, id: '3'}
// ]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields:() => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                // return _.find(authors, { id: parent.authorId})
                return Author.findById(parent.authorId);
            }
        }
    })
    
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields:() => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args){
                // return _.filter(books, {authorId: parent.id})
                return Book.find({
                    authorId: parent.id
                })
            }
        }
    })
    
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){
            //    return _.find(books, {id: args.id});
            return Book.findById(args.id)
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args){

                // return _.find(authors, {id: args.id});
                return Author.findById(args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                // return books
                return Book.find({})
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                // return authors
                return Author.find({})
            }
        }
    }
})

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args){
               let author = new Author({
                   name: args.name,
                   age: args.age
               });
               return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                return book.save()
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})