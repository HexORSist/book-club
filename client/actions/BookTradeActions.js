import AppDispatcher from '../dispatchers/AppDispatcher.js';
import {BOOKTRADEINV_GET} from '../constants/BookTradeConstants.js';

export default {

  gotBookTradeInv: (booktradeinv) => {
    AppDispatcher.dispatch({
      actionType: BOOKTRADEINV_GET,
      booktradeinv: booktradeinv
    })
  }
  
}
