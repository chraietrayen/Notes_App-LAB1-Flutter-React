// src/services/appwrite-config.js
import { Client } from "appwrite";
import { 
  APPWRITE_ENDPOINT, 
  APPWRITE_PROJECT_ID 
} from "@env";

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Note: setKey() is NOT available in client-side SDKs (React Native/Web)
// You must set collection permissions in Appwrite Console instead

export default client;
