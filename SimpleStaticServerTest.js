
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
  
  function isPass(condition, testName) {
    if (condition == true)
      console.log("Test passed");
      
    else
      console.log("Test failed");
  }
  
  function processHTTP(url, testName) {
    http.get(url, (resp) => {
      console.log(testName + " : Start");
      
      resp.on("data", (chunk) => {
        console.log(chunk.toString());
        resultProcess = chunk.toString();
        
        event.emit(testName);
      });
      
      resp.on("end", () => {
        console.log(testName + " : End");
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