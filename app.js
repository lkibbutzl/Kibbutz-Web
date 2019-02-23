const express = require('express')
const app = express()
const morgan = require("morgan")
// const mysql = require("mysql")
const bodyParser = require("body-parser")
const router = require("./routes/user.js")


app.use(morgan('combined'))
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(router)

app.get("/", (req, res) => {
  console.log("Root Route")
  res.render("index.html")
})



app.listen(3000, () => {
  console.log("Server is listening on port 3000.");
})

// function getConnection() {
//   return mysql.createConnection({
//     host: 'localhost',
//     user: 'rahul',
//     password: 'Rahul@16roman',
//     database: 'kibbutz'
//   })

// }