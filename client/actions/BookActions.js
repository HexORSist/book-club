import AppDispatcher from '../dispatchers/AppDispatcher.js';
import {BOOK_GET,BOOKINV_GET} from '../constants/BookConstants.js';

export default {
  gotBook: (book) => {
    AppDispatcher.dispatch({
      actionType: BOOK_GET,
      book: book
    })
  },
  gotBookInv: (bookinv) => {
    AppDispatcher.dispatch({
      actionType: BOOKINV_GET,
      bookinv: bookinv
    })
  }
  
}
