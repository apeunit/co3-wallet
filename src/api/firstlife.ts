import axios from 'axios';
import { API_FIRSTLIFE_URL, API_SERVER } from 'src/config';

export const getResourceURL = async (resourceId: string): Promise<Object> => {
  return `${API_FIRSTLIFE_URL}/files/${resourceId}`;
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
  return axios.post(`${API_FIRSTLIFE_URL}/files`, formData, {
    headers: headers,
  });
};
