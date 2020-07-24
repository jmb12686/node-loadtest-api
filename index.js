'use strict'
const express = require('express')
const threadedDoWork = require('./threadedDoWork');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const app = express()

app.get('/', function (req, res) {
  console.debug('Received GET /')
  console.debug('HEADERS:')
  console.debug(req.headers)
  res.send('hello world!')
})


app.get('/eventloop/loadtest/:iterations', function (req, res) {
  console.debug('Received GET /eventloop/loadtest/%s',req.params.iterations)
  var iterations = req.params.iterations
  validate(iterations, res);
  var elapsed = doWork(iterations)
  var message = 'eventloop job took ' + elapsed + ' ms to process ' + iterations + ' iterations';
  sendResponse(message, res);
})

app.get('/threaded/loadtest/:iterations', async function (req, res) {
  console.debug('Received GET /threads/loadtest/%s',req.params.iterations)
  var iterations = req.params.iterations
  validate(iterations, res);
  var {elapsed} = await threadedDoWork(iterations);
  var message = 'threaded job took ' + elapsed + ' ms to process ' + iterations + ' iterations';
  sendResponse(message, res);
})



app.listen(3000, () => console.log('Express is listening on port 3000'))

function sendResponse(message, res) {
  console.log(message);
  res.send({
    message: message
  });
}

function validate(iterations, res) {
  if (isNaN(iterations)) {
    var errorMsg = iterations + ' is not a number.  Cannot perform loadtest!';
    console.error(errorMsg);
    res.status(400).send({
      message: errorMsg
    });
  }
}

function doWork(iterations) {
  var factValue = 1
  var start = new Date().getTime()

  for (var i = 0; i < iterations; i++) {
    factValue = factValue * i
  }
  var end = new Date().getTime()
  var elapsed = end - start
  return elapsed;
}
