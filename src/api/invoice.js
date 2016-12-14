var request = require('../extend/http-request')
var path = '/service/private/invoice/'
export default {
  createInvoice(params) {
    return request.post(path + 'createInvoice', params)
  },
  submitInvoiceComments(params) {
    return request.post(path + 'submitInvoiceComments', params)
  },
  deleteInvoiceComments(params) {
    return request.post(path + 'deleteInvoiceComments', params)
  },
  saveInvoiceSnapshot(params) {
    return request.post(path + 'saveInvoiceSnapshot', params)
  }
}
