var request = require('../extend/http-request')
var path = '/service/private/create_quotation/'
export default {
    create_quotation(params) {
        return request.post(path + 'create_quotation', params)
    }
}