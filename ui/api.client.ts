import axios from "axios";
import { createClient } from "shared";

export const api = createClient(
  axios.create({ baseURL: "http://localhost/api" })
);
