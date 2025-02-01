import axios from "axios";

let bearerToken = "";

function setInstanceBearerToken(newToken: string) {
  bearerToken = newToken;
}

const instance = axios.create({
  baseURL: "https://www.inserjeunes.education.gouv.fr/api/v1.0",
  responseType: "json",
  timeout: 20000,
  headers: {
    'Accept': 'application/json'
  }
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${bearerToken}`;
  return config;
});

export { instance, setInstanceBearerToken };
