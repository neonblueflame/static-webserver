/**
* Function for testing SimpleStaticServer.
* To run this, go to SimpleStaticServer root directory, 
* enter "node SimpleStaticServerTest.js in a terminal.
*
* To create a new test, create a new function in 
* SimpleStaticServerTest's exposed area (under return). 
* If test is going to be done on HTTP response, create a  * message subject for the test and pass it as argument in 
* processHTTP(). This function will emit an event with the 
* message subject argument and the test function should 
* listen to it, passing a callback function.
*
* dateCreated: 20181105
* dateModified: 20181211
* version: 1.0.4
*/
var SimpleStaticServerTest = function() {

  const SimpleStaticServer = require ("./SimpleStaticServer.js");
  
  const Events = require("events");
  const http = require("http");
  const fs = require("fs");
  
  let server = new SimpleStaticServer();
  server.start();
  
  let event = new Events.EventEmitter();
  let resultExpected = fs.readFileSync("./testText.txt").toString();
  let resultProcess = null;
  
  function isPass(condition) {
    if (condition == true)
      console.log("Test passed");
      
    else
      console.log("Test failed");
  }
  
  function processHTTP(url, subj) {
    http.get(url, (resp) => {
      console.log(subj + " : Start");
      
      resp.on("data", (chunk) => {
        console.log(chunk.toString());
        resultProcess = chunk.toString();
        
        event.emit(subj);
      });
      
      resp.on("end", () => {
        console.log(subj + " : End");
      });
    });
  }
  
  return {
    loadFileRootURL: function() {
      let url = "http://localhost:9000"
      let testName = arguments.callee.name;
      
      processHTTP(url, testName);
      
      event.on(testName, function() {
        isPass(resultProcess  == resultExpected);
      });
    }
  , loadFileNormalURL: function() {
      let url = "http://localhost:9000/testText.txt"
      let testName = arguments.callee.name;
      
      processHTTP(url, testName);
      
      event.on(testName, function() {
        isPass(resultProcess  == resultExpected);
      });
    }
  , loadFileInvalidURL: function() {
      let url = "http://localhost:9000/testText.js"
      let testName = arguments.callee.name;
      
      processHTTP(url, testName);
      
      event.on(testName, function() {
        isPass(resultProcess  == "404 error");
      });
    }
  , paragraphValue: function(value) {
      let url = "http://localhost:9000/?paragraph=" + value;
      let testName = arguments.callee.name + value;
      
      processHTTP(url, testName);
      
      event.on(testName, function() {
        isPass(resultProcess  == 
          resultExpected.substring(
            0
          , (resultExpected.indexOf("\n") * value)
          ));
      });
      
      console.log(resultProcess);
    }
  };
  
}();

SimpleStaticServerTest.loadFileRootURL();
SimpleStaticServerTest.loadFileNormalURL();
SimpleStaticServerTest.loadFileInvalidURL();
SimpleStaticServerTest.paragraphValue(0);
SimpleStaticServerTest.paragraphValue(1);
SimpleStaticServerTest.paragraphValue(2);