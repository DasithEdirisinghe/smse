const sampleRoutes = require('./sample');


const endPointsHandler = (app)=>{
    app.use('/api/search',sampleRoutes);
}

module.exports = {endPointsHandler};