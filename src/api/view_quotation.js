var request = require('../extend/http-request')
var path = '/service/private/view_quotation/'
export default {
  getQuotation(params) {
    return request.get(path + 'getQuotation', params)
  },
  getProject(params) {
    return request.get(path + 'getProject', params)
  },
  getInvoice(params) {
    return request.get(path + 'getInvoice', params)
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
  },
  getQuotationHistory(params) {
    return request.get(path + 'getQuotationHistory', params)
  },
  getProjectContract(params) {
    return request.get(path + 'getProjectContract', params)
  },
  getProjectAttachments(params) {
    return request.get(path + 'getProjectAttachments', params)
  },
  getProjectHours(params) {
    return request.get(path + 'getProjectHours', params)
  },
  getProjectOutSources(params) {
    return request.get(path + 'getProjectOutSources', params)
  },
  getProjectAccounting(params) {
    return request.get(path + 'getProjectAccounting', params)
  },
  saveProjectAcounting(params) {
    return request.post(path + 'saveProjectAcounting', params)
  },
  confirmProjectAcounting(params) {
    return request.post(path + 'confirmProjectAcounting', params)
  },
  getProjectInvoices(params) {
    return request.get(path + 'getProjectInvoices', params)
  },
  getProjects(params) {
    return request.get(path + 'getProjects', params)
  },
  getPreparedBy(params) {
    return request.get(path + 'getPreparedBy', params)
  },
  getComments(params) {
    return request.get(path + 'getComments', params)
  },
  getInvoiceComments(params) {
    return request.get(path + 'getInvoiceComments', params)
  },
  getHourReport(params) {
    return request.get(path + 'getHourReport', params)
  },
  getUsers(page, count, filterKey) {
    return request.get(path + 'getUsers', {
      page,
      count,
      filterKey
    })
  },
  getPODetail(params) {
    return request.get(path + 'getPODetail', params)
  }
}
