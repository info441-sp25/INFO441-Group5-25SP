import express from "express";
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/myIdentity", function (req, res, next) {
  if(req.session.isAuthenticated) {
    res.json({
        status: "loggedin", 
        userInfo: {
           name: req.session.account.name,
           username: req.session.account.username}
    })
  }else{
      res.json({ status: "loggedout" })
  }
});

// Test route, simulate authentication
router.post('/test-auth', function(req, res) {
  req.session.isAuthenticated = true;
  req.session.account = {
    username: 'testuser'
  };
  res.json({ status: 'success', message: 'Test authentication successful' });
});

export default router;
