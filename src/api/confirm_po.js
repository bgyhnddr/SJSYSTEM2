var request = require('../extend/http-request')
var path = '/service/private/confirm_po/'
export default {
    approvePODetail(params) {
        return request.post(path + 'approvePODetail', params)
    }
}