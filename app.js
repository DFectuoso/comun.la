var express  = require('express'),
    swig     = require('swig'),
    conf     = require('./conf'),
    passport = require('passport'),
    flash 	 = require('connect-flash');;

var server = express();

// Prepare Store
var RedisStore = require('connect-redis')(express);

// Template engine
var swigHelpers = require('./views/helpers');

swigHelpers(swig);

server.engine('html', swig.renderFile);
server.set('view engine', 'html');
server.set('views', './views');
server.set('view cache', false);

// Swig cache just on produccion
if(conf.env === 'production'){
	swig.setDefaults({ cache: 'memory' });
}else{
	swig.setDefaults({ cache: false });
}

// Static assets
server.use(express.static('./public'));

// Server config
server.configure(function() {
	// server.use(express.logger());
	server.use(express.cookieParser());
	server.use(express.json());
	server.use(express.urlencoded());
	server.use(express.multipart());

	server.use(express.session({
		store: new RedisStore(conf.redis.options),
		secret: conf.redis.secret
	}));

	server.use(passport.initialize());
	server.use(passport.session());
	server.use(flash());
});

var localPassportConnection = require('./passport/localStrategy');
localPassportConnection(passport);

// home Controller
var homeController  = require('./controllers/home');
homeController(server);

// Models
// load model to prompt connection to the data base
require('./lib/model');
require('./models/user');


//// PARAM PARAMS PARAMS ////
var User    = require('./models/user');
var Section = require('./models/section');
var Post    = require('./models/post');

server.param('userId', function(req,res, next, id){
  User.findOne({_id:id}, function (e, user){
    if (e) return res.send(500, e);
    if (!user) return res.send(404, e);
    req.requestUser = user;
    next();
  });
});

server.param('sectionId', function(req,res, next, id){
  Section.findOne({_id:id}, function (e, section){
    if (e) return res.send(500, e);
    if (!section) return res.send(404, e);
    req.section = section;
    next();
  });
});

server.param('sectionSlug', function(req,res, next, slug){
  Section.findOne({slug:slug}, function (e, section){
    if (e) return res.send(500, e);
    if (!section) return res.send(404, e);
    req.section = section;
    next();
  });
});

server.param('postId', function(req,res, next, id){
  var query = Post.findOne({_id:id});
  query.populate("user");
  query.populate("section");
  query.exec(function (e, post){
    if (e) return res.send(500, e);
    if (!post) return res.send(404, e);
    req.post = post;
    next();
  });
});

////// END PARAMS

server.listen(3000);
console.log('server running at http://localhost.com:3000');
