import { createActions } from 'redux-actions';
import { getUserProfile, saveUserPublicKey } from '../../../api/co3uum';
import {
  GET_USER_PROFILE_DATA,
  SAVE_ACCESS_TOKEN,
  SAVE_AID,
  UPDATE_USER_PUBKEY,
} from './ActionTypes';

const {
  saveAccessToken,
  getUserProfileData,
  updateUserPubkey,
  getLocation,
  saveAid,
} = createActions({
  [SAVE_AID]: (activityID: string) => {
    return {
      activityID: activityID,
    };
  },
  [SAVE_ACCESS_TOKEN]: (accessToken: string) => {
    return {
      accessToken: accessToken,
    };
  },
  [GET_USER_PROFILE_DATA]: async (accessToken: string) => {
    const data: any = await getUserProfile(accessToken);
    let publicKeySaved: boolean = false;
    if (data.result.blockchain_public_key) {
      publicKeySaved = true;
    }

    return {
      publicKey: data.result.blockchain_public_key,
      publicKeySaved,
    };
  },
  [UPDATE_USER_PUBKEY]: async (publicKey: string, accessToken: string) => {
    const data: any = await saveUserPublicKey(publicKey, accessToken);
    if (data.status === 'ok') {
      return {
        publicKey,
        publicKeySaved: true,
      };
    }
  },
  GET_LOCATION: () => {},
});

export { saveAccessToken, getUserProfileData, updateUserPubkey, getLocation, saveAid };
