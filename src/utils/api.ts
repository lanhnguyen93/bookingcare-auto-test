import axios from "axios";

const api = axios.create({
  baseURL: process.env.SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export { api };
