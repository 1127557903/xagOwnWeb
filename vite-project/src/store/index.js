import {
    createStore,
    createLogger
} from "vuex";
import state from "./state";
import mutations from "./mutations";
import getters from "./getters";
import createPersistedState from 'vuex-persistedstate'
import { USER_INFO,TOKEN} from './constants'

const actions = {}
export default createStore({
    state,
    mutations,
    actions,
    getters,
    // 缓存vuex的值和打印日志
    plugins: process.env.NODE_ENV !== 'production' ? [createLogger(), createPersistedState({
        key: 'xuweb_info',
        paths: [USER_INFO,TOKEN]
    })] : [createPersistedState({
        key: 'xuweb_info',
        paths: [USER_INFO,TOKEN]
    })]
});