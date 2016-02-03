import React from 'react';
import ReactMixin from 'react-mixin';
import AuthenticatedComponent from './AuthenticatedComponent';
import BookStore from '../stores/BookStore.js';
import BookService from '../services/BookService.js';

export default AuthenticatedComponent(class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getBookState();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    if (!this.state.book) {
      this.requestNextBook();
      
    }
    this.getBookInv();
    BookStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    BookStore.removeChangeListener(this._onChange);
  }
  
  componentWillReceiveProps(nextProps) {
  }


  _onChange() {
    this.setState(this.getBookState());
  }

  requestNextBook() {
    BookService.nextBook();
  }
  
  getBookInv(){
    BookService.bookInv();
  }

  getBookState() {
    return {
      book: BookStore.book,
      bookinv: BookStore.bookinv
    };
  }
  
  render() {
    return (
      <div>
        <BookForm/>
        <BookList booklist={this.state.book}/>
        <BookInvList bookInv={this.state.bookinv}/>
      </div>
    );
  }
});

class BookForm extends React.Component{
  
    constructor(props) {
      super(props);
      this.state={text: ''};
    }

    handleSubmit(e){
      e.preventDefault();
      var search = this.state;
      BookService.nextBook(search);
    }
    
    render(){
      return(
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input
          type="text"
          placeholder="Book Search Name?"
          valueLink={this.linkState('text')}
        />
        <input type="submit" value="Find Books"/>
      </form>
      );
    }
}

ReactMixin(BookForm.prototype, React.addons.LinkedStateMixin);

class BookList extends React.Component {
    constructor(props) {
      super(props);
      this.state={bookNodes: []};
    }
    
    componentWillMount(){
      if (this.props.booklist)
        this.setState({bookNodes: this.props.booklist.items})
    }
    
    componentWillReceiveProps(nextProps) {
      if (nextProps.booklist!=""&&nextProps.booklist!=null) {
        if(nextProps.booklist.hasOwnProperty("items"))
          this.setState({bookNodes: nextProps.booklist.items})
      }
    }
    
    render() {
      var books=[];
      if(this.state.bookNodes.length){
          books=this.state.bookNodes.map(function(book) {
          return (
            <span key={book.id} className="book">
              <img src={book.volumeInfo.imageLinks.smallThumbnail}></img>
              <BookOption book={book}/>
            </span>
          );
        }, this);
    
      }
      
      return (
        <div class="container">
          {books}
        </div>
      );
    }
}
    
class BookOption extends React.Component {
  
  constructor(props) {
    super(props);
    this.state={HTMLent: '\u2713'};
  }

  bookClk(){
    BookService.addUserBook({
      bookid: this.props.book.id,
      bookimgurl: this.props.book.volumeInfo.imageLinks.smallThumbnail
    })

  }
  
  render(){
    return(
      <div className="bookoption" title="Add book to Inventory" onClick={this.bookClk.bind(this)}>{this.state.HTMLent}</div>
    );
  }
    
}

class BookOptionDelete extends React.Component {
  
  constructor(props) {
    super(props);
    this.state={HTMLent: 'X'};
  }
  
  bookClk(){
    BookService.delUserBook(this.props.book.bookid);
  }
  
  render(){
    return(
      <div className="bookoption" title="Remove book from Inventory" onClick={this.bookClk.bind(this)}>{this.state.HTMLent}</div>
    );
  }
    
}

class BookOptionTrade extends React.Component {
  
  constructor(props) {
    super(props);
    this.state={HTMLent: 'T'};
  }
  
  bookClk(){
    BookService.addBookTrade(this.props.book.bookid);
  }
  
  render(){
    return(
      <div className="tradebookoption" title="Trade book" onClick={this.bookClk.bind(this)}>{this.state.HTMLent}</div>
    );
  }
    
}



class BookInvList extends React.Component {
    constructor(props) {
      super(props);
      this.state={bookInvNodes: []};
    }
    
    componentWillMount(){
      if (this.props.bookInv) 
        this.setState({bookInvNodes: this.props.bookInv})
      else
        this.setState({bookInvNodes: []});
    }
    
    componentWillReceiveProps(nextProps) {
      if (nextProps.bookInv) {
        this.setState({bookInvNodes: nextProps.bookInv})
      }
    }
    
    render() {
      var books=[];
      if(this.state.bookInvNodes.length){
          books=this.state.bookInvNodes.map(function(book) {
          return (
            <span key={book.id} className="book">
              <img src={book.imgURL}></img>
              <BookOptionDelete book={book}/>
              <BookOptionTrade book={book}/>
            </span>
          );
        }, this);
    
      }
      
      return (
        <div>
          <hr></hr>
          <h3>My Book Inventory</h3>
          <div class="container">
            {books}
          </div>
        </div>
      );
    }
}
