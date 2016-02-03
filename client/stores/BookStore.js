import {BOOK_GET,BOOKINV_GET} from '../constants/BookConstants';
import {LOGOUT_USER} from '../constants/LoginConstants';
import BaseStore from './BaseStore';

class BookStore extends BaseStore {

  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this))
    this._book = '';
    this._bookinv = '';
  }

  _registerToActions(action) {
    switch(action.actionType) {
      case BOOK_GET:
        this._book = action.book;
        this.emitChange();
        break;
      case BOOKINV_GET:
        this._bookinv = action.bookinv;
        this.emitChange();
        break;
      case LOGOUT_USER:
        this._book = null;
        this._bookinv = null;
        this.emitChange();
        break;
      default:
        break;
    };
  }
  
  get bookinv(){
    return this._bookinv;
  }

  get book() {
    return this._book;
  }
}

export default new BookStore();
