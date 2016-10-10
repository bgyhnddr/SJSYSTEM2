<template>
    <div>
        <ol class="breadcrumb">
            <li><a v-link="{ path: '/index/DataManagement/ProjectType' }">工程類別</a></li>
            <li><a v-link="{ path: '/index/DataManagement/ProjectType/'+$route.params.type }">{{$route.params.type}}</a></li>
            <li class="active">{{$route.params.item}}</li>
        </ol>
    </div>
</template>