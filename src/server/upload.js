var formidable = require('formidable')
var util = require('util')
var fs = require('fs')

var file = function(req) {
    return new Promise(function(resolve, reject) {
        if (req.method.toLowerCase() == 'post') {
            var form = new formidable.IncomingForm();
            form.uploadDir = "upload/temp";
            form.maxFieldsSize = 2; //10G
            form.hash = "md5"
            form.on('file', function(name, file) {
                fs.exists("upload/files/" + file.hash, function(result) {
                    console.log(result)
                })
                fs.rename(file.path, "upload/files/" + file.hash, function(result) {
                    console.log("rename" + result)
                });
            })
            form.on('error', function(err) {
                console.log('error' + err)
            })
            form.parse(req, function(err, fields, files) {
                console.log(err)
                resolve('received upload:\n\n' + util.inspect(files))
                    //rename the incoming file to the file's name

                console.log("all end")
            })
        } else {
            reject("please post")
        }
    })
}


module.exports = (req, res, next) => {
    var action = req.params.action
    Promise.resolve(action).then(function(result) {
        switch (result) {
            case "file":
                return file(req)
        }
    }).then(function(result) {
        res.send(result)
    }).catch(function(error) {
        res.status(500).send(error.toString())
    })
}