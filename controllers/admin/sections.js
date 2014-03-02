var controller = require('stackers');

var User = require('../../models/user');
var Section = require('../../models/section');

var userAdminController = controller({
  path : 'admin/sections',
  child : true
});

userAdminController.beforeEach(User.isLoggedIn);
userAdminController.beforeEach(function(req, res, next){
  if( req.user.can('sections', 'edit')) next(); else res.send('403');
});


userAdminController.get('', function (req, res) {
  var query = Section.find({},function(err, sections){
    if(err) return res.send(500, err);

    res.data.sections = sections;
    res.render('admin/sections/list', req);
  });
});


userAdminController.get('/new', function (req, res) {
	res.render('admin/sections/new', req);
});

userAdminController.post('/new', function (req, res) {
  var cityBody = (req.body.city === undefined)?false:true;
  var mainBody = (req.body.main === undefined)?false:true;

  var section = new Section({
    name	: req.body.name,
    slug	: req.body.slug,
    city	: cityBody,
    main	: mainBody,
	});

	section.save(function(err){
		if(err)
			return res.send(500, err);
		res.redirect('/admin/sections');
	});
});

userAdminController.get('/:sectionId', function (req, res) {
  res.render('admin/sections/info', req);
});

userAdminController.post('/:sectionId', function (req, res) {
  var cityBody = (req.body.city === undefined)?false:true;
  var mainBody = (req.body.main === undefined)?false:true;

  req.section.main = mainBody;
  req.section.city = cityBody;
  req.section.name = req.body.name;
  req.section.slug = req.body.slug;

  req.section.save(function(err){
    if(err)
      return res.send(500, err);
    res.redirect('/admin/sections');
  });
});

module.exports = userAdminController;
