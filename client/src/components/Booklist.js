import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getBooksQuery } from '../queries/queries';
import BookDetails from './BookDetails';

class Booklist extends Component {
    constructor(props){
        super(props)

        this.state = {
            selected: null
        }
    }

    displayBooks(){
        const { data } = this.props;
        if(data.loading){
            return (
                <div>
                    LOADING BOOKS
                </div>
            )
        } else {
            return (
                data.books.map(book => {
                    return (
                        <li key={book.id} onClick={(e) => {this.setState({selected: book.id})}}>{book.name}</li>
                    )
                })
            )
        }
    }
  render() {
    return (
      <div>
          <ul id="book-list">
            {
                this.displayBooks()
            }
          </ul>
          <BookDetails
            bookId={this.state.selected}
          />
      </div>
    );
  }
}

export default graphql(getBooksQuery)(Booklist);