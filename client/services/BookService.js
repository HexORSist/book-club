import request from 'reqwest';
import when from 'when';
import {BOOK_URL,
        BOOK_USER_ADD_URL,
        BOOK_INV_GET_URL,
        BOOK_USER_DEL_URL,
        BOOK_TRADE_ADD} from '../constants/BookConstants';
import BookActions from '../actions/BookActions';
import LoginStore from '../stores/LoginStore.js';

class BookService {
  
  bookInv() {
    request({
      url: BOOK_INV_GET_URL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      }
    })
    .then((response)=> {
      BookActions.gotBookInv(response);
    });
  }


  nextBook(search) {
    request({
      url: BOOK_URL,
      method: 'POST',
      data: search,
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      }
    })
    .then((response)=> {
      if(response=="Encountered error")
        BookActions.gotBook("");
      else
        BookActions.gotBook(response);
    });
  }
  
  addUserBook(book){
    request({
      url: BOOK_USER_ADD_URL,
      method: 'POST',
      data: book,
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      }
    })
    .then((response)=> {
      if(response=='success')
        this.bookInv();
    })
  }
    
  delUserBook(book){
    request({
      url: BOOK_USER_DEL_URL,
      method: 'POST',
      data: {bookid: book},
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      }
    })
    .then((response)=> {
      if(response=='success')
        this.bookInv();
    });
  }
  
  addBookTrade(book){
    request({
      url: BOOK_TRADE_ADD,
      method: 'POST',
      data: {bookid: book},
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      }
    })
    .then((response)=> {
      if(response=='success')
        this.bookInv();
    });
  }
  
}

export default new BookService()
