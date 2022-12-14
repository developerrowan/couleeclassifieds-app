import axios, { AxiosResponse } from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}`;

export const getAllJobs = async (limit?: number) => {
  return axios
    .get(`${API_URL}/jobs${limit ? `?limit=${limit}` : ''}`)
    .then((response: AxiosResponse) => {
      return response.data;
    })
    .catch((err: any) => {
      return undefined;
    });
};

export const getDaysAgo = (date: string) => {
  const d = new Date(date);
  const today = new Date();

  /* @ts-ignore */
  const diff = Math.ceil(Math.abs(today - d) / (1000 * 60 * 60 * 24));

  return diff;
};
