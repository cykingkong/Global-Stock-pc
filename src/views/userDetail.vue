<template>
    <div class="user-detailmain w-full ">
        <CHeader />
        <Breadcrumb />

        <div class="userDetail-content max-w-1300px mx-auto py-80px xs:w-full">
            <a-spin :loading="loading" tip="loading..." class="max-w-1300px mx-auto xs:w-full">

                <a-row :gutter="[16, 16]" class="w-full">
                    <a-col :span="8" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                        <div class="l w-full ">
                            <div class=" w-445px h-445px mx-auto">
                                <img v-if="userInfo && userInfo.avatar" class="w-full h-full object-cover" alt="dessert"
                                    :src="userInfo.avatar" />
                            </div>
                            <div class="font-size-28px text-align-center mt-20px">{{ userInfo ? userInfo.name : '-' }}
                            </div>
                        </div>
                    </a-col>
                    <a-col :span="8" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                        <div class="r px-24px">
                            <div v-if="html" v-html="html"></div>
                            <a-button :type="!userInfo.isVote ? 'primary' : 'dashed'" class="w-120px mt-20 "
                                @click="handleClickBtn()">{{
                                    t('cardT4') }}</a-button>
                        </div>
                    </a-col>
                </a-row>
            </a-spin>

        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import CHeader from '@/components/header.vue'
import { textToJsonString } from '../../tool.js'
import Breadcrumb from "@/components/Breadcrumb.vue";
import detail from './detail.js'
import { showSuccessToast, showFailToast } from 'vant';
import api from '@/api/api.js';
import { useCounterStore } from '@/stores/counter'
import { Icon, Message, Spin } from '@arco-design/web-vue'
const userInfo = ref({ isVote: true });
const { t, locale } = useI18n()
const html = ref()
const useStore = useCounterStore()

console.log(locale.value)
const loading = ref(false)
const getVotesDetail = async (id) => {
    api.get('/api/vote/voteUserInfo', { params: { id: id, uuid: useStore.uuid } }).then(res => {
        if (res.data.code == 200) {
            userInfo.value = res.data.data
            console.log(res.data.data[locale.value])
            html.value = textToJsonString(userInfo.value[locale.value == 'pt' ? 'es' : 'en'])
        }
    })
}
watch(() => locale.value, (newVal, oldVal) => {
    console.log(newVal, userInfo.value, userInfo.value.html)
    if (newVal && userInfo.value && userInfo.value.html) {
        html.value = textToJsonString(userInfo.value.html[newVal])
    }
}, { deep: true })
const handleClickBtn = () => {
    if (userInfo.value.isVote) {
        return
    }
    let params = {
        uuid: useStore.uuid,
        id: userInfo.value.id
    }
    api.post('/api/vote/voteUser', params).then(res => {
        if (res.data.code == 10012) {
            showFailToast(t('toast1'));
            return
        }
        if (res.data.code == 200) {
            console.log(res.data)
            showSuccessToast(t('toast2'));
            getVotesDetail(userInfo.value.id)
            return
        }



    })
}
onMounted(() => {
    userInfo.value = JSON.parse(localStorage.getItem('userDetail'))
    getVotesDetail(userInfo.value.id)

})
</script>
<style scoped></style>