const searchService = require('../services/sample')

class SampleController {

    static async result(req,res){
        console.log("request is: ",req.body)

        const query = req.body.query
        const field = req.body.field
        // const passedSortOption = req.query.sortOption;
        const request = {
            query: query,
            field: field

        }

        const body = await searchService(request)
        console.log("body", body)
        res.send({
            aggs: body.aggregations,
            hits: body.hits.hits
        });
    }
}

module.exports = SampleController;