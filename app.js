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

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log('Server listening at port ' + PORT)
})


app.get('/', (req, res) => {
  console.log("Root Route")
  res.render("./home.hbs")
})


// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');
// app.set('views', __dirname + '/views');
// app.engine('html', engines.mustache);
// app.set('view engine', 'html');
// app.engine('.hbs', exphbs({extname: '.hbs'}));