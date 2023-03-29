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

const createTask = (req,res) => {
  const { title, description, due_date } = req.body;
  const userId = req.session.userId;
  const completed = true;
  let sql = "INSERT INTO tasks (title , description , due_date , completed , user_id) VALUES (?,?,?,?,?)";
  dbconn.query(sql , [ title , description , due_date ,completed , userId] , (err,result) => {
    if(err){
      console.log(err)
    }
    if(result){
      redirectToRoute('/')
      }
    })
}
const registerPage = (req,res) => {
  res.render("register")
}
const loginPage = (req,res) => {
  res.locals.session = req.session;
  res.render("login" , {session : req.session} )
}
const createUser = (req,res) => {
  const { firstName , lastName , username, email , password } = req.body;
        let sql = "INSERT INTO users (username, password, email, firstname , lastname) VALUES (?,?,?,?,?)";
        dbconn.query(sql, [username , password , email , firstName , lastName], (err, result) => {
          if (err) {
            console.log(err);
          } else if (result) {
            res.render('home')
          }
  })
}
const getTasks = (req,res ,id) => {
      let sqlSel = 'SELECT * FROM tasks WHERE user_id = ?';
      dbconn.query(sqlSel, [id] , (errsel,resultsel) => {
        if(errsel){
          console.log(errsel);
        }
        if(resultsel){
          res.render('home' , {results : resultsel , session : req.session , user : req.session.userId})
        }
      })

}


const userLogin = (req,res) => {
  const {username , password} = req.body;
  let sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  dbconn.query(sql, [username, password] , (err,result) => {
    if(err) {
      console.log(err)
    }
    if(result){
      req.session.userId = result[0].id;
      const id = req.session.userId;
      getTasks(req,res,id)
    }
  })
}

const logout = (req,res) => {
  req.session.userId = null;
  res.redirect('/')
}

const updateOne = (req,res) => {
  const id = req.body.id;
  let sql = "UPDATE tasks SET completed = 1 WHERE id = ?";
  dbconn.query(sql , [id], (err,result) => {
    if(err) {
      console.log(err)
    }
    if(result){
      const id = req.session.userId;
      getTasks(req,res,id)
    }
  })
}

const deleteOne = () => {
 console.log("del")
}
const renderHome = (req,res) => {
  let userExists = true;
  console.log(req.session.userId)
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