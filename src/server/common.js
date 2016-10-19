var padString = function(target, padString, length, right) {
    while (target.length < length) {
        if (right) {
            target = target + padString
        } else {
            target = padString + target
        }
    }
    return target
}

exports.generate_serial_no = function(type) {
    var serial_number = require('../db/models/serial_number')
    var date = new Date()
    var values = {
        type: type,
        year: parseInt(date.getFullYear().toString().substr(2, 2)),
        month: date.getMonth() + 1
    }
    return serial_number.findOne({
        where: values
    }).then(function(result) {
        if (result == null) {
            values.number = 1
            return serial_number.create(values).then(function() {
                return type + values.year + padString(values.month.toString(), "0", 2) + padString("1", "0", 5)
            })
        } else {
            result.number += 1
            return result.save().then(function() {
                return type + result.year + padString(result.month.toString(), "0", 2) + padString(result.number.toString(), "0", 5)
            })
        }
    })
}

exports.get_next_quotation_no = function(quotation_no) {
    var quotation_version = require('../db/models/quotation_version')

    return quotation_version.findOne({
        where: {
            quotation_no: quotation_no
        }
    }).then(function(result) {
        if (result == null) {
            return serial_number.create({
                quotation_no: quotation_no,
                version: 1
            }).then(function() {
                return quotation_no + "R1"
            })
        } else {
            result.version += 1
            return result.save().then(function() {
                return quotation_no + "R" + result.version
            })
        }
    })
}

exports.log_project_record = function(action, content, account) {
    var project_record = require('../db/models/project_record')
    return project_record.create({
        action: action,
        content: content,
        user_account: account
    })
}