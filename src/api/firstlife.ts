import axios from 'axios';
import { API_FIRSTLIFE_URL, API_FIRSTLIFE_URL_STORAGE, API_SERVER } from 'src/config';

export const getResourceURL = async (resourceId: string): Promise<Object> => {
  return `${API_FIRSTLIFE_URL_STORAGE}/files/thumb/${resourceId}`;
};

export const getThumbUrl = (url: string): string => {
  if (!url) return '';
  return url.replace('/files', '/files/thumb');
};

export const getPermalink = (resourceUploadReply: any): string => {
  const index = resourceUploadReply.result.n - 1;

  return resourceUploadReply.ops[index].permalink;
};

export const getOriginalName = (resourceUploadReply: any): string => {
  const index = resourceUploadReply.result.n - 1;

  return resourceUploadReply.ops[index].originalname;
};

export const saveResource = async (accessToken: string | null, resource: any): Promise<Object> => {
  // headers
  const headers = {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${accessToken}`,
    authentication_server: API_SERVER,
    status: 'Public',
  };
  // form data
  const formData = new FormData();
  formData.append('files', resource);

  // data key files
  return axios.post(`${API_FIRSTLIFE_URL_STORAGE}/files`, formData, {
    headers: headers,
  });
};

/*
  Save Crowdsale Data in FirstLife
*/
export const createEntity = async (
  accessToken: string | null,
  data: any,
  //activityId: string,
): Promise<Object> => {
  // headers
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    authentication_server: API_SERVER,
    status: 'Public',
  };

  return axios.post(`${API_FIRSTLIFE_URL}/v6/fl/Things`, JSON.stringify(data), {
    headers: headers,
  });
};

/*
  Save Pickup Basket Data in FirstLife
*/
export const updateEntity = async (
  accessToken: string | null,
  data: any,
  activityId: string,
): Promise<Object> => {
  // headers
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    authentication_server: API_SERVER,
    status: 'Public',
  };

  return axios.put(`${API_FIRSTLIFE_URL}/v6/fl/Things/${activityId}`, JSON.stringify(data), {
    headers: headers,
  });
};

/*
  Save Crowdsale Data in FirstLife
*/
export const saveEntity = async (
  accessToken: string | null,
  data: any,
  activityId?: string | null,
): Promise<Object> => {
  // headers
  if (activityId) {
    return updateEntity(accessToken, data, activityId);
  }
  return createEntity(accessToken, data);
};

/*
  Get Crowdsale List From FirstLife
*/
export const getCrowdsaleList = async (
  accessToken: string | null,
  activityId: string,
): Promise<Object> => {
  // headers
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    authentication_server: API_SERVER,
    status: 'Public',
  };

  return axios.get(`${API_FIRSTLIFE_URL}/v6/fl/Things/${activityId}`, {
    headers: headers,
  });
};

/*
  Get ACA List From FirstLife
*/
export const getACAList = async (accessToken: string | null): Promise<Object> => {
  // headers
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
    authentication_server: API_SERVER,
    status: 'Public',
  };

  return axios.get(`${API_FIRSTLIFE_URL}/v6/fl/Things/search?types=CO3_ACA`, {
    headers: headers,
  });
};
