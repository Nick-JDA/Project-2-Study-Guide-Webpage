const router = require('express').Router();
const { Users, Topics, Modules, Comments } = require('../models');
const withAuth = require('../utils/auth');

//login route
router.get('/login', (req, res) => {
  console.log('beforeif');
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  console.log('working');
  res.render('login');
});

router.get('/', async (req, res) => {
  try {
    //get modules
    const moduleData = await Modules.findAll({
      include: [{ model: Topics, include: [{ model: Comments }] }],
    });
    //map moduleData to array
    const modules = moduleData.map((module) => module.get({ plain: true }));
    console.log(modules);
    //render modules to homepage
    //will be passing this more data if we want to render more than just modules on homepage
    res.render('homepage', {
      modules,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//might not need this route
router.get('/:id', async (req, res) => {
  try {
    const topicData = await Topics.findAll({
      where: { id: req.params.id },
      include: [{ model: Comments }],
    });
    if (!topicData) {
      res.status(404).json({ message: 'No topic found' });
    }
    //add rendering for view here
    // res.render('', {
    //   topicData,
    //   logged_in: req.session.logged_in,
    // });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
