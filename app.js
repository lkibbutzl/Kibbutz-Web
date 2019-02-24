const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const engines = require('consolidate');
const router = require("./routes/user.js")


const app = express()


app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.use(express.static(__dirname + "/views"))
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(router)

// const loggedIn = router.loggedIn
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log('Server listening at port 3000.')
})


app.get('/', (req, res) => {
  console.log("Root Route")
  // console.log(router.loggedIn);
  res.render("./home.html")
})