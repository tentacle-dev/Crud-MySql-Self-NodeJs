const session = require('express-session');
const dbconn = require('../config')

const createOne = (req,res) => {
  res.render('create')
}
const createTaskPage = (req,res) => {
  let userExists = true;
  console.log(req.session.userId)
  if( typeof req.session.userId === 'undefined' || 'null'){
    userExists = false
  }
  res.render('createTask' , {session : req.session , user : userExists })
}

const createTask = (req, res) => {
  const { title, description, due_date } = req.body;
  const userId = req.session.userId;
  const completed = true;

  console.log("Create task", userId, title, description, due_date);

  const sql = "INSERT INTO tasks (title, description, due_date, completed, user_id) VALUES ($1, $2, $3, $4, $5)";

  dbconn.query(sql, [title, description, due_date, completed, userId], (err, result) => {
    if (err) {
      console.error("Create task error: ", err);
      res.status(500).send("Error creating task");
    } else if (result.rowCount > 0) {
      // Redirect to home page after task is created
      res.redirect('/' , {session : userId});
    } else {
      res.status(500).send("Task creation failed");
    }
  });
};

const registerPage = (req,res) => {
  res.locals.session = req.session;
  res.render("register" , {session : res.session})
}
const loginPage = (req,res) => {
  res.locals.session = req.session;
  res.render("login" , {session : req.session} )
}
const createUser = (req, res) => {
  res.locals.session = req.session;

  const { firstName, lastName, username, email, password } = req.body;
  const sql = "INSERT INTO users (username, password, email, firstname, lastname) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  
  dbconn.query(sql, [username, password, email, firstName, lastName], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error inserting user data");
    } else {
      res.render('home' , {session : req.session}); // Render home page after successful insertion
    }
  });
};
const getTasks = (req, res, id) => {
  const sqlSel = 'SELECT * FROM tasks WHERE user_id = $1';
  console.log("Get tasks" + id)

  dbconn.query(sqlSel, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving tasks");
    } else {
      res.render('home', { results: result.rows, session: req.session, user: req.session.userId });
    }
  });
};



const userLogin = (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = $1 AND password = $2';

  dbconn.query(sql, [username, password], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error logging in");
    } else if (result.rows.length > 0) {
      req.session.userId = result.rows[0].id;
      const id = req.session.userId;
      console.log("userLogin" + id)
      getTasks(req, res, id);  // Fetch user tasks after successful login
    } else {
      res.status(401).send("Invalid credentials");  // Handle invalid login
    }
  });
};


const logout = (req,res) => {
  req.session.userId = null;
  res.redirect('/')
}

const updateOne = (req, res) => {
  const id = req.body.id;
  const sql = "UPDATE tasks SET completed = $1 WHERE id = $2";

  dbconn.query(sql, [1, id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error updating task");
    } else if (result.rowCount > 0) {
      const userId = req.session.userId;
      getTasks(req, res, userId);  // Fetch updated tasks after completing
    } else {
      res.status(404).send("Task not found");
    }
  });
};


const deleteOne = () => {
 console.log("del")
}


const renderHome = (req,res) => {
  let userExists = true;
  console.log("Render Home" + req.session.userId)
  if( typeof req.session.userId === 'undefined' || 'null'){
    userExists = false
  }
  res.render('home' , {session : req.session , user : userExists })
}



module.exports = {
    renderHome,
    logout,
    createOne,
    updateOne,
    deleteOne,
    loginPage,
    registerPage,
    createTaskPage,
    createUser,
    createTask,
    userLogin
}