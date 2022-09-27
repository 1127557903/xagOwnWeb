import { USER_INFO,TOKEN,EQUIPMENT } from "./constants"

const getters = {
    [USER_INFO](state){
        return state.userInfo
    },
    [TOKEN](state){
        return state.token
    },
    [EQUIPMENT](state){
        return state.equipment
    },
}

export default getters
