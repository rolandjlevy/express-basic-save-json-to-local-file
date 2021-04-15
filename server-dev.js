const app = require("./index");
const port = process.env.PORT_DEV || 4000; 

app.listen(port, () => console.log('Listening on port', port));