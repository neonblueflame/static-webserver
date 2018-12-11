# Simple static server
A mini static server made using Node.JS

To run the server, import SimpleStaticServer and create its instance. Then, call start() using its instance.
<br />
Ex:
<br />
`const SimpleStaticServer = require ("./SimpleStaticServer.js");`

`let server = new SimpleStaticServer();`
<br />
`server.start();`

Or, run npm start. This will run Main.js (see package.json)
<br />
`npm start`

To run the unit test, open a terminal then, run npm test. This will run SimpleStaticServerTest.js (see package.json) and also, starts the server.
<br />
`npm test`