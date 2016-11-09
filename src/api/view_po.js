var request = require('../extend/http-request')
var path = '/service/private/view_po/'
export default {
    getPayees(params) {
        return request.get(path + 'getPayees', params)
    },
    getPOs(params) {
        return request.get(path + 'getPos', params)
    },
    getPO(params) {
        return request.get(path + 'getPO', params)
    },
    getQuotations(params) {
        return request.get(path + 'getQuotations', params)
    },
    getPODetail(params) {
        return request.get(path + 'getPODetail', params)
    }
}