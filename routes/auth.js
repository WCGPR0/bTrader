var express = require('express');
var router = express.Router();

var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var db_name = 'need';
var db_url = 'mongodb://localhost:27017/' + db_name;
var db_collection_users = 'users';

var loginUser = function(res, email, pass, db, callback) {
    var cursor = db.collection(db_collection_users).find( {'email':email} );
    cursor.count(function(err, count) {
	assert.equal(null, err);
	if(count === 0){
	    res.json({
		'status' : 'failure',
		'errmsg' : 'There is no account registered with that email'
	    });
	    return;
	}
    });
    cursor.each(function(err, doc) {
	assert.equal(err, null);
	if(doc != null){
	    if(doc.password === pass){
		res.json({
		    'status' : 'success',
		    'uid' : doc._id
		});
	    }
	}
	else{
	    callback();
	}
    });
};

var insertUser = function(email, pass, fname, lname, phone, db) {
    db.collection(db_collection_users).insertOne({
	'email' : email,
	'password' : pass,
	'firstName' : fname,
	'lastName' : lname,
	'phone' : phone
    }).then(function(response) {
	// verify inserted successfully
	assert.equal(1, response.insertedCount);
    });
}

var registerUser = function(res, email, pass, fname, lname, phone, db, callback) {
    // check if username already exists
    db.collection(db_collection_users).find( {'email':email} ).count(function(err, count) {
	assert.equal(null, err);
	if(count === 0){
	    // username doesn't exist, create user & login
	    insertUser(email, pass, fname, lname, phone, db);
	    loginUser(res, email, pass, db, callback);
	}
	else{
	    // username exists, return err
	    res.json({
		'status' : 'failure',
		'errmsg' : 'There is already a registered account associated with that email'
	    });
	}
    });
    
}

/* POST auth*/
router.post('/', function(req, res, next) {
    var req_type = req.body.request;

    if(req_type === "login"){
	var email = req.body.email;
	var pass = req.body.password;

	MongoClient.connect(db_url, function(err, db){
	    assert.equal(null, err);
	    loginUser(res, email, pass, db, function() {
		db.close();
	    });
	});
    }

    if(req_type === "register"){
	var email = req.body.email;
	var pass = req.body.password;
	var fname = req.body.firstName;
	var lname = req.body.lastName;
	var phone = req.body.phoneNumber;
	
	MongoClient.connect(db_url, function(err, db){
	    assert.equal(null, err);
	    registerUser(res, email, pass, fname, lname, phone, db, function() {
		db.close();
	    });
	});
    }

});

module.exports = router;
