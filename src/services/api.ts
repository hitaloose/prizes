import axios from "axios";
import { persistStorage } from "./persist-storage";

export const api = axios.create();

api.interceptors.request.use((config) => {
  const jwt = persistStorage.getItem("JWT");

  if (jwt) {
    config.headers.Authorization = `bearer ${jwt}`;
  }

  return config;
});
