var request = require('../extend/http-request')
var path = '/service/private/datasource/'
export default {
    getPropertyManagementCos(page, count, filterKey) {
        return request.get(path + 'getPropertyManagementCos', {
            page,
            count,
            filterKey
        })
    },
    submitPropertyManagementCo(params) {
        return request.post(path + 'submitPropertyManagementCo', params)
    },
    deletePropertyManagementCo(params) {
        return request.post(path + 'deletePropertyManagementCo', params)
    },
    getStaffs(page, count, filterKey) {
        return request.get(path + 'getStaffs', {
            page,
            count,
            filterKey
        })
    },
    submitStaff(params) {
        return request.post(path + 'submitStaff', params)
    },
    deleteStaff(params) {
        return request.post(path + 'deleteStaff', params)
    },
    getBuildings(page, count, filterKey) {
        return request.get(path + 'getBuildings', {
            page,
            count,
            filterKey
        })
    },
    submitBuilding(params) {
        return request.post(path + 'submitBuilding', params)
    },
    deleteBuilding(params) {
        return request.post(path + 'deleteBuilding', params)
    },
    getProjectManagers(page, count, filterKey) {
        return request.get(path + 'getProjectManagers', {
            page,
            count,
            filterKey
        })
    },
    submitProjectManager(params) {
        return request.post(path + 'submitProjectManager', params)
    },
    deleteProjectManager(params) {
        return request.post(path + 'deleteProjectManager', params)
    },
    getProjectTypes(page, count, filterKey) {
        return request.get(path + 'getProjectTypes', {
            page,
            count,
            filterKey
        })
    },
    submitProjectType(params) {
        return request.post(path + 'submitProjectType', params)
    },
    deleteProjectType(params) {
        return request.post(path + 'deleteProjectType', params)
    },
    getProjectItems(type, page, count, filterKey) {
        return request.get(path + 'getProjectItems', {
            type,
            page,
            count,
            filterKey
        })
    },
    submitProjectItem(params) {
        return request.post(path + 'submitProjectItem', params)
    },
    deleteProjectItem(params) {
        return request.post(path + 'deleteProjectItem', params)
    },
    getUploadTemplates(item, filterKey) {
        return request.get(path + 'getUploadTemplates', {
            item,
            filterKey
        })
    },
    submitUploadTemplate(params) {
        return request.post(path + 'submitUploadTemplate', params)
    },
    deleteUploadTemplate(params) {
        return request.post(path + 'deleteUploadTemplate', params)
    },
    upUploadTemplate(params) {
        return request.post(path + 'upUploadTemplate', params)
    },
    downUploadTemplate(params) {
        return request.post(path + 'downUploadTemplate', params)
    },
    getJobTemplates(item, filterKey) {
        return request.get(path + 'getJobTemplates', {
            item,
            filterKey
        })
    },
    submitJobTemplate(params) {
        return request.post(path + 'submitJobTemplate', params)
    },
    deleteJobTemplate(params) {
        return request.post(path + 'deleteJobTemplate', params)
    },
    upJobTemplate(params) {
        return request.post(path + 'upJobTemplate', params)
    },
    downJobTemplate(params) {
        return request.post(path + 'downJobTemplate', params)
    },
    getOutSourceContractors(page, count, filterKey) {
        return request.get(path + 'getOutSourceContractors', {
            page,
            count,
            filterKey
        })
    },
    submitOutSourceContractor(params) {
        return request.post(path + 'submitOutSourceContractor', params)
    },
    deleteOutSourceContractor(params) {
        return request.post(path + 'deleteOutSourceContractor', params)
    }
}