<template>
    <div>
        <ol class="breadcrumb">
            <li><a v-link="{ path: '/index/DataManagement/ProjectType' }">工程類別</a></li>
            <li class="active">{{$route.params.type}}</li>
        </ol>
    </div>
</template>