
var SimpleStaticServerTest = function() {

  const SimpleStaticServer = require ("./SimpleStaticServer.js");
  
  const http = require("http");
  const fs = require("fs");
  
  let server = new SimpleStaticServer();
  server.start();
  
  function processHTTP(url, testName) {
    http.get(url, (resp) => {
      console.log(testName + " : Start");
      
      resp.on("data", (chunk) => {
        console.log(chunk.toString());
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
    }
    , loadFileNormalURL: function() {
      let url = "http://localhost:9000/testText.txt"
      processHTTP(url, arguments.callee.name);
    }
    , loadFileInvalidURL: function() {
      let url = "http://localhost:9000/testText.js"
      processHTTP(url, arguments.callee.name);
    }
    , paragraphValue: function(value) {
      let url = "http://localhost:9000/?paragraph=" + value;
      processHTTP(url, arguments.callee.name);
    }
  };
  
}();

SimpleStaticServerTest.loadFileRootURL();
SimpleStaticServerTest.loadFileNormalURL();
SimpleStaticServerTest.loadFileInvalidURL();
SimpleStaticServerTest.paragraphValue(0);
SimpleStaticServerTest.paragraphValue(2);