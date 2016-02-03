import {BOOKTRADEINV_GET} from '../constants/BookTradeConstants';
import {LOGOUT_USER} from '../constants/LoginConstants';
import BaseStore from './BaseStore';

class BookTradeStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this))
    this._booktradeinv = '';
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case BOOKTRADEINV_GET:
        this._booktradeinv = action.booktradeinv;
        this.emitChange();
        break;
      case LOGOUT_USER:
        this._booktradeinv = null;
        this.emitChange();
        break;
      default:
        break;
    };
  }
  
  get booktradeinv(){
    return this._booktradeinv;
  }

}

export default new BookTradeStore();
