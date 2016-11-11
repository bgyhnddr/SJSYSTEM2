var request = require('../extend/http-request')
var path = '/service/private/view_po/'
export default {
    getPayees(params) {
        return request.get(path + 'getPayees', params)
    },
    getPOs(params) {
        return request.get(path + 'getPOs', params)
    },
    getPO(params) {
        return request.get(path + 'getPO', params)
    },
    getQuotations(params) {
        return request.get(path + 'getQuotations', params)
    },
    getPODetail(params) {
        return request.get(path + 'getPODetail', params)
    },
    getPODrafts(params) {
        return request.get(path + 'getPODrafts', params)
    },
    getPOWaitApproves(params) {
        return request.get(path + 'getPOWaitApproves', params)
    },
    getPOWaitBossApproves(params) {
        return request.get(path + 'getPOWaitBossApproves', params)
    },
    getApproved(params) {
        return request.get(path + 'getApproved', params)
    },
    getPOPaids(params) {
        return request.get(path + 'getPOPaids', params)
    }
}