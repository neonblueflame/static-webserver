
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
      console.log(testName + " passed");
      
    else
      console.log(testName + " failed");
  }
  
  function processHTTP(url, testName) {
    http.get(url, (resp) => {
      console.log(testName + " : Start");
      
      resp.on("data", (chunk) => {
        console.log(chunk.toString());
        resultProcess = chunk.toString();
        
        event.emit("processDone");
      });
      
      resp.on("end", () => {
        console.log(testName + " : End");
      });
    });
  }
  
  return {
    loadFileRootURL: function() {
      let url = "http://localhost:9000"
      processHTTP(url, arguments.callee.name);
      
      event.on("processDone", function() {
        isPass(resultProcess  == resultExpected, arguments.callee.name);
      });
    }
    , loadFileNormalURL: function() {
      let url = "http://localhost:9000/testText.txt"
      processHTTP(url, arguments.callee.name);
      
      event.on("processDone", function() {
        isPass(resultProcess  == resultExpected, arguments.callee.name);
      });
    }
    , loadFileInvalidURL: function() {
      let url = "http://localhost:9000/testText.js"
      processHTTP(url, arguments.callee.name);
      
      event.on("processDone", function() {
        isPass(resultProcess  == "404 error", arguments.callee.name);
      });
    }
    , paragraphValue: function(value) {
      let url = "http://localhost:9000/?paragraph=" + value;
      processHTTP(url, arguments.callee.name);
      
      event.on("processDone", function() {
        isPass(resultProcess  == 
          resultExpected.substring(
              0
            , (resultExpected.indexOf("\n") * value)
          ), arguments.callee.name);
      });
    }
  };
  
}();

SimpleStaticServerTest.loadFileRootURL();
SimpleStaticServerTest.loadFileNormalURL();
SimpleStaticServerTest.loadFileInvalidURL();
SimpleStaticServerTest.paragraphValue(0);
SimpleStaticServerTest.paragraphValue(1);
SimpleStaticServerTest.paragraphValue(2);