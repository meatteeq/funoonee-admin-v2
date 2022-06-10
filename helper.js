export function redirectFromServerSideTo(ctx, path) {
  ctx?.res?.writeHead(302, { Location: path });
  ctx?.res?.end();
  return { props: {} };
}
