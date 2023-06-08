import axios from "axios";
import { createClient } from "shared";

export const api = createClient(
  axios.create({ baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}` })
);

export const serverApi = createClient(
  axios.create({ baseURL: `http://server:5000/api` })
);
