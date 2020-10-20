import axios from 'axios';
import qs from 'qs';
import { API_URL } from 'src/config';

export const getUserIDName = async (accessToken: string): Promise<Object> => {
  return (await axios.get(`${API_URL}/api/1/info?access_token=${accessToken}&include_member=1`))
    .data;
};

export const getPublicKey = async (accessToken: string): Promise<Object> => {
  return (await axios.get(`${API_URL}/api/1/profile?access_token=${accessToken}`)).data;
};

export const savePublicKeyAPI = async (accessToken: string, publicKey: string): Promise<Object> => {
  const publicKeyData = qs.stringify({ update: `{ "blockchain_public_key" : "${publicKey}" }` });

  return (
    await axios.post(`${API_URL}/api/1/profile?access_token=${accessToken}`, publicKeyData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  ).data;
};

export const getUserProfile = async (accessToken: string): Promise<Object> => {
  return (await axios.get(`${API_URL}/profile?access_token=${accessToken}`)).data;
};

export const saveUserPublicKey = async (
  publicKey: string,
  accessToken: string,
): Promise<Object> => {
  const update = {
    blockchain_public_key: publicKey,
  };

  return (
    await axios.post(`${API_URL}/profile?access_token=${accessToken}&update=${update}`, {
      headers: {},
    })
  ).data;
};

// build the URL to get the user profile image
export const getProfileImageUrl = (userData: any): string => {
  const memberId = userData.id || userData;

  return `${API_URL}/member_image/show/${memberId}.html?image_type=avatar`;
};

export const getRandomId = () => {
  return `_${Math.random()
    .toString(36)
    .substr(2, 9)}`;
};

export const getRandomCustomNumber = (count: number) => {
  let randomNo = '';
  for (let i = 0; i < count; i = i + 1) {
    randomNo = `${Math.floor(Math.random() * 9)}${randomNo}`;
  }
  return randomNo;
};

export const getTokenName = (tokenList: any, address: string) => {
  const token = tokenList.find((tkn: any) => tkn.contractAddress === address);

  return token && token.name;
};

export const getTokenSymbol = (tokenList: any, address: string) => {
  const token = tokenList.find((tkn: any) => tkn.contractAddress === address);

  return token && (token.token_symbol || token.symbol);
};

export const saveCallbackAPI = async (callbackurl: string, data: any): Promise<Object> => {
  return (
    await axios.post(callbackurl, data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  ).data;
};
