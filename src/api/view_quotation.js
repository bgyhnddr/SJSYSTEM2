var request = require('../extend/http-request')
var path = '/service/private/view_quotation/'
export default {
    getQuotation(params) {
        return request.get(path + 'getQuotation', params)
    },
    getProject(params) {
        return request.get(path + 'getProject', params)
    },
    getQuotationJobs(params) {
        return request.get(path + 'getQuotationJobs', params)
    },
    getBuilding(id) {
        return request.get(path + 'getBuilding', {
            id
        })
    },
    getProfitSetting() {
        return request.get(path + 'getProfitSetting')
    },
    getProjectConfirmInfo(id) {
        return request.get(path + 'getProjectConfirmInfo', {
            id
        })
    }
}