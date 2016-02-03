var express = require('express'),
    _       = require('lodash'),
    config  = require('./config'),
    jwt     = require('jsonwebtoken'),
    userSV  = require('./user.server');

var app = module.exports = express.Router();

// XXX: This should be a database of users :).
/*var users = [{
  id: 1,
  username: 'gonto',
  password: 'gonto'
}];*/

function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresInMinutes: 60*5 });
}

function getUserScheme(req) {
  
  var username;
  var type;
  var userSearch = {};

  // The POST contains a username and not an email
  if(req.body.username) {
    username = req.body.username;
    type = 'username';
    userSearch = { username: username };
  }
  // The POST contains an email and not an username
  else if(req.body.email) {
    username = req.body.email;
    type = 'email';
    userSearch = { email: username };
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  }
}

app.post('/users', function(req, res) {
  
  var userScheme = getUserScheme(req);  

  if (!userScheme.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }

  var userCallback = function(user){
    
    if(user){
      return res.status(400).send("A user with that username already exists");
    }
    
    var profile = _.pick(req.body, userScheme.type, 'password', 'extra');
    
    var adduserCallback = function(profile){
      res.status(201).send({
        id_token: createToken(profile)
      });
    }
    
    userSV.adduser(profile, adduserCallback);
  };
  
  
  userSV.finduser(userScheme.username,userCallback);
});

app.post('/sessions/create', function(req, res) {

  var userScheme = getUserScheme(req);

  if (!userScheme.username || !req.body.password) {
    return res.status(400).send("You must send the username and the password");
  }
  

  var userCallback = function(user){

    if(!user){
      return res.status(401).send({message:"The username or password don't match", user: user});
    }
    
    if (user.password !== req.body.password) {
      return res.status(401).send("The username or password don't match");
    }
  
    res.status(201).send({
      id_token: createToken(user)
    });
  }

  userSV.finduser(userScheme.username,userCallback)

  
});