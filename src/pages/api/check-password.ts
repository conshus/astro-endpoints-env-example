import type { APIRoute } from "astro";
import { env } from "../../utils/env.js";
const { ADMIN_PASSWORD, HOST_PASSWORD, GUEST_PASSWORD } = env;

// const { ADMIN_PASSWORD, HOST_PASSWORD, GUEST_PASSWORD } = import.meta.env;

export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      greeting: "Hello",
    })
  );
};

export const POST: APIRoute = async ({ request }) => {
  // console.log('post req: ', await request.json());
  const data = await request.json();
  const password = data.password;
  const role = data.role.toLowerCase();
  let authorized = false;
  switch (role) {
    case "admin":
      authorized = password === ADMIN_PASSWORD;
      break;
    case "host":
      authorized = password === HOST_PASSWORD;
      break;
    case "guest":
      authorized = password === GUEST_PASSWORD;
      break;
    default:
      authorized = false;
  }

  return new Response(
    JSON.stringify({
      authorized,
    })
  );
};
