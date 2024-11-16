const express = require('express');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const app = express();
const path = require('path')
dotenv.config();
const appRoutes = require("./routes/routes")

app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Use true only if using HTTPS
}));
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname , 'views/public')))
app.use(appRoutes);





app.listen(process.env.SERVER_PORT , () => {
    console.log("Server")
})




// const dbroutes = require('./routes/routes')
// const mysql = require('mysql');
// const port = 3000;

// app.use(express.json());

// app.use(
//     express.urlencoded({
//         extended:true
//     })
// );

// app.use(dbroutes)
// // let connection = db.connection();

// // connection.connect(function(err) {
// //     if(err){
// //         return console.error('error : ' + err.message)
// //     }
// //     console.log('Connected')
// // })

// app.get("/" , (req,res) => {
//     res.json({
//         message : 'ok'
//     })
// });

// app.listen(port , () => {
//     console.log("Server :-  Hello There")
// })

