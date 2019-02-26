const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const engines = require('consolidate');
const userRouter = require("./routes/user.js")
const newsRouter = require("./routes/news.js")
const exphbs = require('express-handlebars');

const app = express()

const hbs = exphbs.create({
  /* config */
});

app.set('view engine', 'hbs');

app.use(express.static(__dirname + "/views"))
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(userRouter)
app.use(newsRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Server listening at port 3000.')
})


app.get('/', (req, res) => {
  console.log("Root Route")
  res.render("./home.hbs")
})



const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'us-cdbr-iron-east-03.cleardb.net',
  user: 'b4c8f251658732',
  password: '173c0ba0',
  database: 'heroku_07d022536b472a1'
})

function getConnection() {
  return pool
}



app.post('/register', (req, res) => {

  console.log('Creating a new User!')

  const name = req.body.name_register;
  const number = req.body.mobile_register
  const password = req.body.password_register
  const hash = bcrypt.hashSync(password, 0)
  console.log(bcrypt.compareSync(password, hash))
  const connection = getConnection()
  const numberExistsCheckQuery = 'SELECT * FROM users WHERE mobile = ?'

  connection.query(numberExistsCheckQuery, number, (err, results, fields) => {
    if (err) {
      res.sendStatus(500)
    } else {
      if (results.length > 0) {
        res.render("./success-fail.hbs", {
          message: "User already exists.",
          button: "Try logging in",
          link: "/#login"
        })
      } else {

        const queryString = "INSERT INTO users (name, mobile, password) VALUES (?,?,?)"
        connection.query(queryString, [name, number, password], (err, results, fields) => {
          if (err) {
            console.log("Failed adding an user" + err);
            res.send(500)
            return
          }
          console.log("Inserted a new user: ", results.insertId);
          console.log("Hash Check: ", bcrypt.compareSync(password, hash))
          res.render("./success-fail.hbs", {
            message: "Registered successfully",
            button: "Home",
            link: "/"
          })
        })
      }
    }
  })
})


app.post('/login', (req, res) => {
  console.log("Checking if the User's info is valid")

  const number = req.body.number_login
  const password = req.body.password_login


  const connection = getConnection()
  const queryString = 'SELECT * FROM users WHERE mobile = ?'

  connection.query(queryString, number, (err, results, fields) => {
    if (err) {
      res.send(500)
    } else {
      // console.log(results)
      if (results.length > 0) {
        const truePassword = results[0].password
        console.log(password);
        // console.log(hashedPassword); // still Working on hashng
        // console.log(bcrypt.compareSync(password, hashedPassword))
        if (password === truePassword) {
          console.log("Logged In Successfully");
          res.render("./success-fail.hbs", {
            message: "Logged In successfully",
            button: "Home",
            link: "/"
          })
        } else {
          res.render("./success-fail.hbs", {
            message: "Check your password",
            button: "Login here",
            link: "/#login"
          })
        }
      } else {
        res.render("./success-fail.hbs", {
          message: "Seems you are not registered",
          button: "Register here",
          link: "/#register"
        })
      }
    }
  })
})


// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
// app.set('views', __dirname + '/views');
// app.engine('html', engines.mustache);
// app.set('view engine', 'html');
// app.engine('.hbs', exphbs({extname: '.hbs'}));