var padString = function(target, padString, length, right) {
    while (target.length < length) {
        if (right) {
            target = padString + target
        } else {
            target = target + padString
        }
    }
    return target
}

exports.generate_serial_no = function(type, company) {
    var serial_number = require('../db/models/serial_number')
    var values = {
        type: type,
        company: company,
        year: parseInt(new Date().getFullYear().toString().substr(2, 2))
    }
    return serial_number.findOne({
        where: values
    }).then(function(result) {
        if (result == null) {
            values.number = 1
            return serial_number.create(values).then(function() {
                return type + "-" + company + "-" + padString("1", "0", 5) + "-" + values.year
            })
        } else {
            result.number += 1
            return result.save().then(function() {
                return type + "-" + company + "-" + padString(result.number.toString(), "0", 5) + "-" + values.year
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