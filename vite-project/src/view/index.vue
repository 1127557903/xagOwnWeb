<template>
    <div>
        <button @click="linkto('/phone','手机')" >手机端</button>
        <button @click="linkto('/pc','电脑')" >电脑端</button>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import store from '@/store'
import {
    UPDATE_EQUIPMENT
} from '@/store/constants';
const router = useRouter()

const linkto = (route,eq) => {
    router.push(route)
    store.commit(UPDATE_EQUIPMENT,eq)
}
</script>
