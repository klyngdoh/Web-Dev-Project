var userModel = require('../models/user/user.model.server.js')();
var bcrypt = require("bcrypt-nodejs");
const saltRounds = 10;

module.exports = {

  addUser: function (body, type, req, res) {
    var user = body;
    user.type = type;
    user.rating = 4.0;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;

    userModel.addUser(user).then(function (result) {
      console.log("Result ", result);
      req.login(result, function (err) {
        if (err) {
          res.status(500);
          res.json({message: err});
        } else {
          var user = {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            displayPicUrl: result.displayPicUrl,
            rating: result.rating
          };
          res.json(result);
        }
      });
    }).catch(function (err) {
      console.log(err);
      res.status(500);
      res.json({message: err});
    });
  },

  findUserById: function (userId, sess, res) {
    userModel.findUserById(userId).then(function (user) {
      res.json(user);
    }).catch(function (err) {
      res.status(500);
      res.json({message: err});
    });
  },

  fbLogin: function(user, req, res) {
    console.log("Goint to upsert ,", user);
    user.photos = [];
    user.photos.push(user.photo);
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
    userModel.upsertUser(user).then(function (result) {
      req.login(result, function (err) {
        if (err) {
          res.status(500);
          res.json({message: err});
        } else {
          var user = {
            _id: result._id,
            firstName: result.firstName,
            lastName: result.lastName,
            displayPicUrl: result.displayPicUrl,
            rating: result.rating
          };
          res.json(result);
        }
      });
    }).catch(function(err){
      res.status(500);
      res.json({message: err});
    });
  },

  addComment: function (userId, sess, res) {
    userModel.findUserById(userId).then(function (user) {
      res.json(user);
    }).catch(function (err) {
      res.status(500);
      res.json({message: err});
    });
  }

};
