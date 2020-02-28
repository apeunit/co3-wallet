import { createActions } from 'redux-actions'
import { GET_USER_PROFILE_DATA, SAVE_ACCESS_TOKEN, UPDATE_USER_PUBKEY} from './ActionTypes'
import { getUserProfile, saveUserPublicKey } from '../../../api/co3uum'

const { saveAccessToken, getUserProfileData, updateUserPubkey } = createActions({
    [SAVE_ACCESS_TOKEN]: (accessToken: string) => {
        localStorage.setItem('co3uum-access-token', accessToken)
        return {
            accessToken: accessToken
        }
    },
    [GET_USER_PROFILE_DATA]: async (accessToken: string) => {
        const data: any = await getUserProfile(accessToken)
        let publicKeySaved: boolean = false
        if (data.result.blockchain_public_key) {
            publicKeySaved = true
        }
        return {
            publicKey: data.result.blockchain_public_key,
            publicKeySaved
        }
    },
    [UPDATE_USER_PUBKEY]: async (publicKey: string, accessToken: string) => {
        const data: any =  await saveUserPublicKey(publicKey, accessToken)
        if(data.status === "ok") {
            return {
                publicKey,
                publicKeySaved: true
            }
        }
    }
})

export { saveAccessToken, getUserProfileData, updateUserPubkey }