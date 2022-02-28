import axios from 'axios';
import qs from 'qs';
import { API_URL } from 'src/config';
import Web3 from 'web3';
import { IMemberSearchResult, IProfile } from '../interfaces';

export const getUserIDName = async (accessToken: string): Promise<Object> => {
  return (await axios.get(`${API_URL}/api/1/info?access_token=${accessToken}&include_member=1`))
    .data;
};

export const getPublicKey = async (accessToken: string): Promise<Object> => {
  return (await axios.get(`${API_URL}/api/1/profile?access_token=${accessToken}`)).data;
};

const generateSignature = async (privateKey: any): Promise<String> => {
  const web3 = new Web3();
  const hashKey = await web3.eth.accounts.hashMessage(
    String(process.env.REACT_APP_HASH_STRING || 'co3-wallet'),
  );

  const { signature } = await web3.eth.accounts.sign(hashKey, privateKey);
  return signature;
};

export const savePublicKeyAPI = async (
  accessToken: string,
  publicKey: string,
  privateKey: any,
): Promise<Object> => {
  const signature = await generateSignature(privateKey);
  const publicKeyData = qs.stringify({
    update: `{ "blockchain_public_key" : "${publicKey}", "blockchain_public_key__signature": "${signature}" }`,
  });

  return (
    await axios.post(`${API_URL}/api/1/profile?access_token=${accessToken}`, publicKeyData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
  ).data;
};

export const getUserProfile = async (accessToken: string): Promise<Object> => {
  return (await axios.get(`${API_URL}/profile?access_token=${accessToken}`)).data;
};

export const getUserDetailsByAddress = async (
  accessToken: string,
  address: string,
): Promise<any> => {
  return (
    await axios.get(
      `${API_URL}/api/1/member?access_token=${accessToken}&profile_blockchain_public_key=${address}`,
    )
  ).data;
};

export const saveUserPublicKey = async (
  publicKey: string,
  privateKey: any,
  accessToken: string,
): Promise<Object> => {
  const signature = await generateSignature(privateKey);
  const update = {
    blockchain_public_key: publicKey,
    blockchain_public_key__signature: signature,
  };

  return (
    await axios.post(`${API_URL}/profile?access_token=${accessToken}&update=${update}`, {
      headers: {},
    })
  ).data;
};

// build the URL to get the user profile image
export const getProfileImageUrl = (accessToken: string, userData: any): string => {
  const memberId = userData.id || userData;

  return `${API_URL}/api/1/avatar?access_token=${accessToken}&member_id=${memberId}`;
};

// search for members by userame
export const getMemberBySearchString = async (
  accessToken: string,
  query: string,
): Promise<IMemberSearchResult> => {
  return (await axios.get(`${API_URL}/api/1/member?access_token=${accessToken}&q=${query}`)).data;
};

export const getProfileById = async (accessToken: string, id: string): Promise<IProfile> => {
  return (await axios.get(`${API_URL}/api/1/profile?access_token=${accessToken}&member_id=${id}`))
    .data;
};

// search for roles

export const getMyProfileWithRoles = async (accessToken: string): Promise<Object> => {
  return (
    await axios.post(
      `${API_URL}/api/1/validate?include_member=1&identification=true&include_roles=1&access_token=${accessToken}`,
    )
  ).data;
};
