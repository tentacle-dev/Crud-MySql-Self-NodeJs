const express = require('express');
const taskController = require('../controllers/taskController')
const router = express.Router();

router.get('/' , taskController.renderHome)
router.get('/register' , taskController.registerPage)
router.get('/login' , taskController.loginPage)
router.post('/createUser' , taskController.createUser)
router.post('/home' , taskController.userLogin)
router.post('/createTask' , taskController.createTask)
router.get('/create' , taskController.createTaskPage)
router.post('/update' , taskController.updateOne)
router.get('/logout' , taskController.logout)

module.exports = router;