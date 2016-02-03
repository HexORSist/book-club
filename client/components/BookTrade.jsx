import React from 'react';
import ReactMixin from 'react-mixin';
import AuthenticatedComponent from './AuthenticatedComponent';
import BookTradeStore from '../stores/BookTradeStore.js';
import BookTradeService from '../services/BookTradeService.js';

export default AuthenticatedComponent(class BookTrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getBookTradeState();
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    if (!this.state.book) {
      this.getBookTradeInv();
    }

    BookTradeStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    BookTradeStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState(this.getBookTradeState());
  }

  getBookTradeInv(){
    BookTradeService.bookTradeInv();
  }

  getBookTradeState() {
    return {
      booktradeinv: BookTradeStore.booktradeinv
    };
  }
  
  render() {
    return (
      <div>
        <BookTradeInvList bookTradeInv={this.state.booktradeinv}/>
      </div>
    );
  }
});


class BookOptionTrade extends React.Component {
  
  constructor(props) {
    super(props);
    this.state={HTMLent: 'T'};
  }
  
  bookClk(){
    BookTradeService.bookTakeTrade(this.props.book.bookid);
  }
  
  render(){
    return(
      <div className="bookoption" title="Take Trade" onClick={this.bookClk.bind(this)}>{this.state.HTMLent}</div>
    );
  }
    
}



class BookTradeInvList extends React.Component {
    constructor(props) {
      super(props);
      this.state={bookTradeInvNodes: []};
    }
    
    componentWillMount(){
      if (this.props.bookTradeInv) 
        this.setState({bookTradInvNodes: this.props.bookTradeInv})
      else
        this.setState({bookTradeInvNodes: []});
    }
    
    componentWillReceiveProps(nextProps) {
      if (nextProps.bookTradeInv) {
        this.setState({bookTradeInvNodes: nextProps.bookTradeInv})
      }
    }
    
    render() {
      var books=[];
      if(this.state.bookTradeInvNodes.length){
          books=this.state.bookTradeInvNodes.map(function(book) {
          return (
            <span key={book.id} className="book">
              <img src={book.imgURL}></img>
              <BookOptionTrade book={book}/>
            </span>
          );
        }, this);
    
      }
      
      return (
        <div>
          <h3>Books For Trade</h3>
          <hr></hr>
          <div class="container">
            {books}
          </div>
        </div>
      );
    }
}
