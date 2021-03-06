/**
* Mini static server made using Node.JS
*
* dateCreated: 20181105
* dateModified: 20181211
* version: 1.0.3
*/
function SimpleStaticServer() {
  "use strict";
  
  const fs = require("fs");
  const http = require("http");
  const path = require("path");
  
  const config = require("./package.json")["config"];
  
  function log(text) {
    if (config["enableLogging"] == "true")
      console.log(text);
  }
  
  function send404Response(resp) {
    resp.write(config["msg404"]);
    resp.end();
  }
  
  function send500Response(resp) {
    resp.write(config["msg500"]);
    resp.end();
  }
  
  function getPathname(url) {
    return url.split("?")[0];
  }
  
  function getParamParagraph(url) {
    let paragraphVal = null;
    
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
  
  function printResource(url, resource, resp) {
    fs.readFile(resource, (err, file) => {
    
      if (err && err.code == "ENOENT") {
        send404Response(resp);
        return;
      }
      
      let paragraphVal = getParamParagraph(url);
      if (typeof paragraphVal == "number") {
      
        let doc = file.toString();
        resp.write(doc.substring(
          0
          , doc.indexOf("\n") * (paragraphVal)
        ));
        
      } else
        resp.write(file)
    
      resp.end();
    });
  }
  
  const processMethod = function() {
    
    const rootURL = config["routes"]["root"];
    let paragraph = 0;
    let url;
    
    return {
      GET: function(req, resp) {
        try {
          
          url = getPathname(req.url);
          if (url == rootURL["path"]) 
            printResource(req.url, rootURL["resource"], resp);
          
          else 
            printResource(req.url, "." + url, resp);
        
        } catch (e) {
          send500Response(resp);
        }
      }
    };
    
  }();
  
  function onProcess(req, resp) {
    try {
      let methods = config["allowedMethods"];
      
      if (methods.length == 1) 
        processMethod[methods[0]](req, resp);
      
    } catch(err) {
      send500Response(resp);
    }
  }
  
  const server = http.createServer(onProcess);
  return {
  
    start: function() {
      server.listen(config["port"]);
      log(config["msgStart"]);
      
      return server;
    }
    , end: function() {
      log(config["msgExit"]);
      server.close();
    }
    
  };
}

module.exports = SimpleStaticServer;