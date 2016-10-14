// Usin TingoDB (a documented database, non RDMS (NoSQL) to store user information)

var Engine = require('tingodb')(),
    assert = require('assert');
var fs = require('fs')

// A supporting module
var M1 = require('./js_modules/m1_operations.js');

// Main event manipulator
var events = require('events');
var eventEmitter = new events.EventEmitter();

// A global var to store information on active account
var ACTIVE_ACCOUNT;


// Check if we have a database already
fs.access('./base/base', fs.constants.W_OK | fs.constants.R_OK, function(err) {
    if (!err) {
      loadExistingAccounts();
    } else {
      console.log('NO DATABASE');
    }
});

function insertNewDocIntoDatabase(sp, user_account_name, key_access) {
  // Write a new account information to database
    var db = new Engine.Db('./base', {});
    var collection = db.collection("base");
    collection.insert({
        user_account_type: sp,
        user_account_name: user_account_name,
        key_access: key_access
    }, (err, result) => {
        if (!err) {
            // set a path to store downloaded data
            var path = './base/content/' + sp + '__' + user_account_name;
            // make a directory using the path above
            fs.mkdir(path, (err) => {
                if (!err) {
                  var account = {'user_account_type': sp, 'user_account_name': user_account_name, 'key_access': key_access};
                  append_new_account(sp, user_account_name, true);
                  M1.Fetching_new_message(account, '');
                }
            });
        }
    });

    // create index to avoid duplicate
    var option = {
        unique: true,
        background: true,
        w: 1
    };
    collection.createIndex('user_account_name', option);
    db.close();
}

function getObjectFromDatabase(sp, user_account_name, callback) {
  // Get a specific object from database out and pass a callback on it
    var db = new Engine.Db('./base', {});
    var collection = db.collection("base");
    var doc = collection.findOne({
        user_account_type: sp,
        user_account_name: user_account_name
    }, function(err, doc) {
        if (!err) return callback(doc);
        console.log('NOT FOUND IN DATABASE');
    });
    db.close();
}

function searchDatabaseWithQuery(callback) {
  // Get all objects from the database
    var db = new Engine.Db('./base', {});
    var collection = db.collection("base");
    collection.find().toArray(function(err, docs) {
        if (!err) return callback(docs);
    });
    db.close();
}
