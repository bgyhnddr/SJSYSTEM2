var request = require('../extend/http-request')
var path = '/service/private/invoice/'
export default {
    createInvoice(params) {
        return request.post(path + 'createInvoice', params)
    }
}