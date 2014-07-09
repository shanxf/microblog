var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
};
module.exports = User;

User.prototype.save = function save(callback) {
  //存入mongodb的文档
  var user = {
  	name: this.name,
  	password: this.password,
  };

  mongodb.open(function(err, db) {
  	if(err) {
  	  return callback(err);
  	}
  	//读取users合集
  	db.collection('users', function(err, collection) {
  	  if(err) {
  	  	mongodb.close();
  	  	return callback(err);
  	  }
  	  //为name属性添加索引
      /*注：书中的写法是：collection.ensureIndex('name', {unique: true});
          但是会报can not use a writeConcern without a provided callback
          改成：
          1、collection.ensureIndex('name',{unique: true},{w: 0}); 最后一个参数表示忽略操作成功或失败
          2、
          collection.ensureIndex('name',{unique: true},function(err,index){
             if(err){
              mongodb.close();
              return callback(err);
             }

          });
      */
      collection.ensureIndex('name',{unique: true},function(err,index){
        if(err){
          mongodb.close();
          return callback(err);
        }
      });
  	  //写入user文档
  	  collection.insert(user, {safe: true}, function(err, user) {
  	  	mongodb.close();
  	  	callback(err, user);
  	  });
  	});
  });
};

User.get = function get(username, callback) {
  mongodb.open(function(err, db) {
  	if(err) {
  	  mongodb.close();
  	  return callback();
  	}
  	//读取users命令
  	db.collection('users', function(err, collection) {
  	  if(err) {
  	  	mongodb.close();
  	  	return callback();
  	  }
  	  //查找name属性为username的文档
  	  collection.findOne({name: username}, function(err, doc) {
  	  	mongodb.close();
  	  	if(doc){
  	  	  //封装文档为user对象
  	  	  var user = new User(doc);
  	  	  callback(err, user);
  	  	}else{
  	  	  callback(err, null);
  	  	}
  	  });
  	});
  });
} 