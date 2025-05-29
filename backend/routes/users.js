import express from "express";
import models from '../models.js';

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

router.get('/:username', async (req, res) => {
  try {
    console.log('Getting user info for ' + req.params.username);
    const user = await models.User.findOne({ username: req.params.username });

    if (!user) {
      const newUserInfo = new models.User({
        username: req.params.username,
        createdCrosswords: [],
        savedCrosswords: []
      });
      await newUserInfo.save();
      console.log('New user info saved');
      return res.json(newUserInfo)
    }
    res.json({user})
  } catch (error) {
    console.error('Error getting user info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Test route, simulate authentication
router.post('/test-auth', function(req, res) {
  req.session.isAuthenticated = true;
  req.session.account = {
    username: 'testuser'
  };
  res.json({ status: 'success', message: 'Test authentication successful' });
});

export default router;
