// All user related Routes

const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bcrypt = require('bcrypt')



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

router.get('/user/:id', (req, res) => {
  console.log(req.params.id)


  const connection = getConnection()
  const userId = req.params.id
  const queryString = "SELECT * FROM users WHERE id = ?"

  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Query Failed");
      res.sendStatus(500);
      res.end();
    }

    const users = rows.map((row) => {
      return {
        Name: row.name,
        mobile: row.mobile
      }
    })

    console.log('Fetched');
    res.json(users)
  })
})



router.get('/users', (req, res) => {
  console.log(req.params.id)

  const connection = getConnection()
  const userId = req.params.id

  const queryString = "SELECT * FROM users"

  connection.query(queryString, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Query Failed");
      res.sendStatus(500);
      res.end();
    }

    const users = rows.map((row) => {
      return {
        Name: row.name,
        mobile: row.mobile
      }
    })

    console.log('Fetched');
    res.json(users)
  })
})



router.post('/register', (req, res) => {

  console.log('Creating a new User!')

  const name = req.body.name_register;
  const number = req.body.mobile_register
  const password = req.body.password_register
  const hash = bcrypt.hashSync(password, 0)
  console.log(bcrypt.compareSync(password, hash))

  if (number.length < 9 || number.length > 12) {
    res.send("Check your input details and try again.")
    res.end()
  } else {

    connection = getConnection()

    const queryString = "INSERT INTO users (name, mobile, password) VALUES (?,?,?)"
    connection.query(queryString, [name, number, password], (err, results, fields) => {
      if (err) {
        console.log("Failed adding an user" + err);
        res.send(500)
        return
      }
      console.log("Inserted a new user: ", results.insertId);
      console.log("Hash Check: ", bcrypt.compareSync(password, hash))
      res.sendfile("views/register-success.html")
    })
  }


})

router.post('/login', (req, res) => {
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
          res.sendfile("views/login-success.html")
        }
      }
    }
  })

  // console.log(number)
  // console.log(password);

})

module.exports = router