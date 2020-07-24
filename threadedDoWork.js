'use strict'

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
  module.exports = async function threadedDoWork(iterations) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, {
        workerData: iterations
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  };
} else {
  var factValue = 1
  var start = new Date().getTime()

  for (var i = 0; i < workerData; i++) {
    factValue = factValue * i
  }
  var end = new Date().getTime()
  var elapsed = end - start
  parentPort.postMessage({
    elapsed
  });
}