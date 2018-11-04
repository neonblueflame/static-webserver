function makeServer() {
    "use strict";
    
    const http = require("http");
    const fs = require("fs");
    
    const fileText = "./testText.txt";
    
    function send404Response(res) {
      res.write("404 error");
      res.end();
    }
    
    function send500Response(res) {
      res.write("500 error");
      res.end();
    }
    
    function getPathname(url) {
      return url.split("?")[0];
    }
    
    function getParamParagraph(url) {
      let paragraphVal = 0;
      
      if (url.includes("paragraph")) {      
        let valPos = url.indexOf("paragraph=") + "paragraph=".length;
        let ampPos = url.indexOf("&");
        
        if (ampPos > 0)
          paragraphVal = parseInt(url.substring(valPos, ampPos));
        else
          paragraphVal = parseInt(url.substring(valPos, url.length));
      }
      
      return paragraphVal;
    }
    
    function onProcess(req, res) {
      try {
      
        let paragraph = 0;
        let url = getPathname(req.url);
        
        if (req.method == "GET" && url == "/") {
          fs.readFile(fileText, (err, file) => {
            
            if (getParamParagraph(req.url) > 0) {
              
            }
          
            res.write(file)
            res.end();
          });
        } else {
          send404Response(res);
        }
        
      } catch(e) {
        send500Response(res);
      }
    }
    
    const server = http.createServer(onProcess);
    server.listen(9000);
    console.log("Server started");
    
    return server;
}

module.exports = {
    makeServer: makeServer
};