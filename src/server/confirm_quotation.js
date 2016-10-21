var confirmQuotation = function(req, res, next) {
    var project = require('../db/models/project')
    var project_state = require('../db/models/project_state')

    project.hasOne(project_state)

    project.findOne({
        where: {
            id: id
        }
    })
}

module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        try {
            switch (result) {
                case "confirmQuotation":
                    return confirmQuotation(req, res, next)
            }
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}