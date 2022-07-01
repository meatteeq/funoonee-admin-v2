import axios from "axios";
import cookies from "next-cookies";
export function redirectFromServerSideTo(ctx, path) {
  ctx?.res?.writeHead(302, { Location: path });
  ctx?.res?.end();
  return { props: {} };
}

export async function isUserAuthenticated(ctx, isServer) {
  // token,
  axios.defaults.headers.common.Authorization = `Bearer ${
    cookies(ctx).accessToken || ""
  }`;
}
