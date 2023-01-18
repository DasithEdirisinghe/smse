const routes = require('./routes');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
app.use(cors());
app.use(bodyParser.json());

//handle routes
routes.endPointsHandler(app);


const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
