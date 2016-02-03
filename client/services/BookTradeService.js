import request from 'reqwest';
import when from 'when';
import {BOOKTRADE_INV_GET_URL,BOOKTAKETRADE_URL} from '../constants/BookTradeConstants';
import BookTradeActions from '../actions/BookTradeActions';
import LoginStore from '../stores/LoginStore.js';

class BookTradeService {
  
  bookTradeInv() {
    request({
      url: BOOKTRADE_INV_GET_URL,
      method: 'GET',
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      }
    })
    .then((response)=> {
      BookTradeActions.gotBookTradeInv(response);
    });
  }

  bookTakeTrade(book){
    request({
      url: BOOKTAKETRADE_URL,
      method: 'POST',
      data: {bookid: book},
      crossOrigin: true,
      headers: {
        'Authorization': 'Bearer ' + LoginStore.jwt
      }
    })
    .then((response)=> {
      if(response=='success')
       this.bookTradeInv();
    });
  }

}

export default new BookTradeService()
