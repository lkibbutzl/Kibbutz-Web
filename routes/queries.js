const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const {
  PythonShell
} = require('python-shell')
const multer = require('multer');

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/Users/sudhakarmani/tnplpocs/facer/kibbutz-predict/input-images')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
var upload = multer({
  storage: storage
});

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

const connection = getConnection()

router.get('/queries', (req, res) => {
  connection.query("SELECT * FROM queries", (err, results, fields) => {
    // console.log(results)
    res.render("queries.hbs", {
      result: results
    })
  })
})

router.post('/callDeepLearning', upload.single('file-to-upload'), (req, res) => {

  const filename = req.body.name_query
  const crop = req.body.crop_query
  console.log("file details " + req)

  let options = {
    mode: 'text',
    pythonOptions: ['-u'], // get print results in real-time
    args: ['--image=' + filename, '--cropname=' + crop]
  };

  PythonShell.run('../kibbutz-predict/crop_diseases.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.log('results: %j', results);
  });



})

router.post('/addQuery', (req, res) => {
  const user = req.body.name_query
  const crop = req.body.crop_query
  const title = req.body.title_query
  const content = req.body.content_query
  // const img = req.body.img_link

  const postQuery = "INSERT INTO queries (user, crop, title, content) VALUES (?,?,?,?)"

  connection.query(postQuery, [user, crop, title, content], (err, results, fields) => {
    if (err) {
      console.log("Failed adding the Post " + err);
      res.send(500);
      return
    }
    console.log("Inserted a new post: ", results.insertId);

    res.redirect('/queries')
  })
})

module.exports = router