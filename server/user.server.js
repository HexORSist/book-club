var users=require('./models/user.model').user;
var book=require('./models/user.model').book;

module.exports = {
    finduser:function(user,callback){
        
        users.findOne({'username': user},function(err,data){
            if (err) return console.error(err);
            callback(data);
        });
    },
    
    adduser:function(profile,callback){
        users.create({'username': profile.username,
                      'password': profile.password},
                       function(err,data){
                            if (err) return console.error(err);
                            data.save();
                            callback(data);
                       }
        )
    },
    
    addbookuser:function(userid,bookobj,callback){
        users.findOne({'_id': userid},function(err,data){
            if (err) return console.error(err);

            var _book = new book({bookid:bookobj.bookid,imgURL:bookobj.bookimgurl});
            _book.save(function(err){
                if (err) return console.error(err);
                    data.books.push(_book)
                    //data.books.push(_book);
                    data.save(function(err){
                        if (err) return console.error(err);  
                        callback();
                    });
            });
            
        });
    },
    
    delbookuser:function(userid,book,callback){
        users.findOne({'_id': userid}).populate('books').exec(function(err,data){
            if (err) return console.error(err);
            var index = undefined;
            data.books.forEach(function(elm,idx){
                if(elm.bookid==book.bookid)
                    index=idx;
            })
            if(index!=undefined){
                data.books[index].fortrade=false;
                data.books[index].remove();
                data.save();
                callback();
            }
        });

    },
    
    addbookinv:function(userid,callback){
        users.findOne({'_id':userid}).populate('books').exec(function(err,data){
            if (err) return console.error(err);
            
            if(data){
                callback(data.books)
            }
        });
    },
    
    booktradeadd:function(userid,_book,callback){
        
        var bookcallback = function(){book.findOne({'bookid':_book.bookid},function(bookerr,bookdata){
            if (bookerr) return console.error(bookerr);

            if(bookdata){
                bookdata.fortrade = true;
                bookdata.save();
                callback();
            }
        });
        }
        
        users.findOne({'_id':userid}).populate('books').exec(function(usererr,userdata){
            if (usererr) return console.error(usererr);
            
            userdata.books.forEach(function(elm,idx){
                if(elm.bookid==_book.bookid){
                    userdata.books.remove(elm.id)
                    userdata.save();
                    bookcallback();
                }
            })
        });
        
    },
    
    booktradeinvget:function(callback){
        book.find({fortrade: true},function(err,data){
            if (err) return console.error(err);

            if(data){
                callback(data);
            }
        });
    },
    
    booktaketrade:function(userid,_book,callback){
        users.findOne({'_id': userid},function(usererr,userdata){
            if (usererr) return console.error(usererr);
            
            book.findOne({'bookid': _book.bookid},function(bookerr,bookdata){
                if (bookerr) return console.error(bookerr);
                
                bookdata.fortrade = false;
                bookdata.save();
                userdata.books.push(bookdata);
                userdata.save();
                callback();
                
            });
        });
    }
};