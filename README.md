# static-webserver
A mini static server made using Node.JS

To run the server, import SimpleStaticServer and create its instance. Then, call start() sing its instance.
Ex:
const SimpleStaticServer = require ("./SimpleStaticServer.js");

let server = new SimpleStaticServer();
server.start();

To run the unit test, open a terminal then, enter "node SimpleStaticServerTest". This also starts the server.
