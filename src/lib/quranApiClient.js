import { serverEnv } from "@/lib/serverEnv";
import axios from "axios";

const headers = {};

if (serverEnv.quranApiKey) {
  headers.Authorization = `Bearer ${serverEnv.quranApiKey}`;
}

export const quranApiClient = axios.create({
  baseURL: serverEnv.quranApiBaseUrl,
  timeout: serverEnv.quranApiTimeoutMs,
  headers,
});
