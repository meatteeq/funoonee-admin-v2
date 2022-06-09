export const amplifyConfig = {
  aws_project_region: process.env.NEXT_PUBLIC_AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id:
    process.env.NEXT_PUBLIC_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.NEXT_PUBLIC_AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.NEXT_PUBLIC_AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id:
    process.env.NEXT_PUBLIC_AWS_USER_POOLS_WEB_CLIENT_ID,
};

export const auth0Config = {
  client_id: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
  domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
};

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

export const gtmConfig = {
  containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID,
};
const config = {
  token:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNGZjOWUyMC1iMzU1LTQ5MDYtOTM5MS1lMzA1MWI5ODBjM2UiLCJlbWFpbCI6IndhbGVlZC51bWFyQGNvZGVuaW5qYWNvbnN1bHRpbmcuY29tIiwic2NvcGUiOlsiQURNSU4iXSwiaWF0IjoxNjU0MDA1MjAyLCJleHAiOjE2NTY1OTcyMDJ9.oYry7UjAlZSIYm8LhT0f-wAVIoFugb8uP0IpA4q8OG0",

  apiRoute: "https://api.funoonee.com/",
  CLOUDINARY_URL:
    "https://api.cloudinary.com/v1_1/sherrycodeninjas/image/upload",
  CLOUDINARY_UPLOAD_PRESET: "c84iijwi",
};

export default config;
