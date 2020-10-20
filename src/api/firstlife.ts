import axios from 'axios';
import { API_FIRSTLIFE_URL, API_FIRSTLIFE_URL_STORAGE, API_SERVER } from 'src/config';

export const getResourceURL = async (resourceId: string): Promise<Object> => {
  return `${API_FIRSTLIFE_URL_STORAGE}/files/${resourceId}`;
};

export const getPermalink = (resourceUploadReply: any): string => {
  const index = resourceUploadReply.result.n - 1;
  return resourceUploadReply.ops[index].permalink;
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

export const saveCrowdsaleData = async (
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
