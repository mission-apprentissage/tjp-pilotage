import axios from "axios";

import { config } from "../../../../../config/config";
import { formatUaiData } from "./formatUaiData";

const instance = axios.create({
  baseURL: "https://www.inserjeunes.education.gouv.fr/api/v1.0",
  responseType: "json",
  timeout: 20000,
});

export const login = async () => {
  const response = await instance.post("/login", undefined, {
    headers: {
      username: config.PILOTAGE_INSERJEUNES_USERNAME,
      password: config.PILOTAGE_INSERJEUNES_PASSWORD,
    },
  });
  const { access_token: token } = response.data;
  return token;
};

instance.interceptors.response.use(undefined, async (err) => {
  const { config, response } = err;
  if (config.retried || ![500, 401, undefined].includes(response?.status)) {
    return Promise.reject(err);
  }

  console.log("Retry with new token");
  config.retried = true;
  const token = await login();
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  return axios({
    ...config,
    headers: {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    },
  });
});

export const getUaiData = async ({
  uai,
  millesime,
}: {
  uai: string;
  millesime: string;
}) => {
  try {
    const response = await instance.get(`/UAI/${uai}/millesime/${millesime}`);
    const data = JSON.parse(response.data);
    return formatUaiData(data);
  } catch (e) {
    if (axios.isAxiosError(e)) return undefined;
    throw e;
  }
};

export const inserJeunesApi = { getUaiData };
