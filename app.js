const express = require('express')
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const engines = require('consolidate');
const router = require("./routes/user.js")
const exphbs = require('express-handlebars');

const app = express()


const hbs = exphbs.create({
  /* config */ });
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
// app.set('views', __dirname + '/views');
// app.engine('html', engines.mustache);
// app.set('view engine', 'html');
// app.engine('.hbs', exphbs({extname: '.hbs'}));
app.set('view engine', 'hbs');

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
  res.render("./home.hbs")
})