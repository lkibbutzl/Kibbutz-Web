const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/news', (req, res) => {
  request('https://newsapi.org/v2/everything?sources=the-times-of-india&q=agriculture&apiKey=066d9529cb5141b681d9b6c3a6363be5', (error, response, body) => {
    if (error) {
      console.log(error);
      res.sendStatus(error)
    } // Print the error if one occurred
    console.log('News statusCode:', response && response.statusCode); // Print the response status code if a response was received
    const obj = JSON.parse(body) // Print the HTML for the Google homepage.
    var result = '';
    for (let i = 0; i < obj.articles.length; i++) {
      result += obj.articles[i].title + '\n' + obj.articles[i].description + '\n\n\n\n';
    }
    res.send(result)
  })

  // var obj = JSON.parse(response)
  // obj.articles[0].title
  // obj.articles[0].description
  // https://newsapi.org/v2/everything?sources=the-times-of-india&apiKey=066d9529cb5141b681d9b6c3a6363be5
})


module.exports = router