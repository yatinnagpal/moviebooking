import axios from "axios";

const API = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:8003/api",
  headers: { "Content-Type": "application/json" },
});

export default API;
