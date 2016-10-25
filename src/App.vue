<template>
    <router-view></router-view>
</template>
<script>
    export default {}
</script>
<style>
    .view {
        transition: all .3s ease;
    }
    
    .fate-enter,
    .fate-leave {
        opacity: 0;
        transform: translate3d(20px, 0, 0);
    }
</style>