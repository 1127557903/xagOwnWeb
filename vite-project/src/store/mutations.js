import { UPDATE_USER_INFO,UPDATE_TOKEN,UPDATE_EQUIPMENT } from "./constants"


const mutations = {
    [UPDATE_USER_INFO](state,val={}) {
        state.userInfo = {...state.userInfo,...val}
    },
    [UPDATE_TOKEN](state,val='') {
        state.token = val
    },
    [UPDATE_EQUIPMENT](state,val='') {
        state.equipment = val
    },
}

export default mutations
