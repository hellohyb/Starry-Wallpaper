<script lang="ts" setup>
const platform = process.platform

</script>

<template>
    <div class="header" v-if="platform !== 'win32'">
    </div>
</template>

<style scoped>
.header{
    width: 100%;
    height: 30px;
    background-color: transparent;
    -webkit-app-region: drag;
    display: flex;
    justify-content: center;
    font-size: 14px;
}
</style>