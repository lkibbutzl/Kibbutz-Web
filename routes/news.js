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
    const obj = JSON.parse(body)
    var result = [];
    for (let i = 0; i < obj.articles.length; i++) {
      // result += obj.articles[i].title + '\n' + obj.articles[i].description + '\n\n\n\n';
      temp = {}
      temp.title = obj.articles[i].title;
      temp.description = obj.articles[i].description
      temp.urlToImage = obj.articles[i].urlToImage
      temp.url = obj.articles[i].url
      result.push(temp)
    }
    res.render('news.hbs', {
      result: result
    })
    // res.json(result)
  })
})


module.exports = router