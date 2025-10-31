// src/api.js
import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:8000",     // Adjust as per backend location
  headers: { "Content-Type": "application/json" }
});
