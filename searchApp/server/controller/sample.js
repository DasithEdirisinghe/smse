const searchService = require('../services/sample')

class SampleController {

    static async result(req,res){
        console.log("request is: ",req.body)

        const query = req.body.queryData.query
        const field = req.body.queryData.field
        const phrase = req.body.queryData.phrase
        // const passedSortOption = req.query.sortOption;
        const request = {
            query: query,
            field: field,
            phrase: phrase

        }
        console.log("request is: ",request)
        const body = await searchService(request)
        console.log("body", body)
        res.send({
            status: 200,
            message: 'Success',
            data: {
            aggs: body.aggregations,
            hits: body.hits.hits
        }
        });
    }
}

module.exports = SampleController;