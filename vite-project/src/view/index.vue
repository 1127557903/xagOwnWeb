<template>
    <div>
        <button @click="router.push('/phone')" >手机端</button>
        <button @click="router.push('/pc')" >电脑端</button>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
const router = useRouter()
</script>
