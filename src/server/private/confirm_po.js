var exec = {
    approvePODetail(req, res, next) {
        var po_quotation_approve = require("../../db/models/po_quotation_approve")
        return po_quotation_approve.upsert({
            po_quotation_id: req.body.po_quotation_id,
            manager_approve: true
        })
    }
}

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        try {
            return exec[result](req, res, next)
        } catch (e) {
            console.log(e)
            res.status(500).send(e)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}