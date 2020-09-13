const express = require('express')
const request = require('request')
var bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000

const twoHoursInSeconds = 7200

function routeRequest(urlForRequest) {
    console.log(`Making a request to ${urlForRequest}...`)
   	request.get(urlForRequest, { json: true }, (err, res, body) => {
		if (err) { 
			return console.log(err)
		}
		console.log(`response: ${body}`)
	})
}

express()
	.use(bodyParser.urlencoded({ extended: true }))
  .post('/timer', (req, res) => {

    const urlForRequest = req.body.url;
    console.log(`Will make a request at ${urlForRequest} in ${twoHoursInSeconds} seconds... `)
    setTimeout(routeRequest.bind(this, urlForRequest), twoHoursInSeconds)

    res.status(200).end("received request")
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
