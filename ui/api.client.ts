import axios from "axios";
import { createClient } from "shared";

export const api = createClient(
  axios.create({ baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}` })
);
