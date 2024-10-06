// declare const Buffer;
// if (!Buffer) {
//   console.log("no Buffer!");
export const prerender = false;
import { Buffer } from "node:buffer";
// }
import type { APIRoute } from "astro";
// import { env } from '../../utils/env.js'
// const { GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO } = env;
// const { GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO } = import.meta.env;
import { getEnvs } from "../../utils/env.js";

import { Octokit } from "@octokit/core";
// const octokit = new Octokit({ auth: GITHUB_PAT });

// async function getBuffer() {
//   if (typeof Buffer !== "undefined") {
//     return Buffer; // Already available globally
//   }

//   try {
//     const { Buffer } = await import("node:buffer");
//     console.log("Buffer on Cloudflare!");
//     return Buffer;
//   } catch (error) {
//     // Handle the case where 'buffer' is not available
//     console.log("no Buffer on Cloudflare");
//     return Uint8Array;
//   }
// }

export const GET: APIRoute = async (context) => {
  // const Buffer = await getBuffer();
  const locals = context.locals;
  // const { GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO } = context.locals.runtime.env;
  const { GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO } = getEnvs(locals);
  const octokit = new Octokit({ auth: GITHUB_PAT });

  const originalFile = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: GITHUB_USERNAME,
      repo: GITHUB_REPO,
      path: "sessions.json",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // const sessionsContent = Buffer.from(
  //   originalFile.data["content"],
  //   "base64"
  // ).toString();

  const sessionsContent = atob(originalFile.data["content"]);

  return new Response(
    JSON.stringify({
      body: sessionsContent,
    })
  );
};

export const POST: APIRoute = async ({ request, locals }) => {
  // const Buffer = await getBuffer();
  const { GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO } = getEnvs(locals);
  const octokit = new Octokit({ auth: GITHUB_PAT });

  const body = await request.json();
  const base64newSessions = Buffer.from(JSON.stringify(body.events)).toString(
    "base64"
  );

  const originalFile = await octokit.request(
    "GET /repos/{owner}/{repo}/contents/{path}",
    {
      owner: GITHUB_USERNAME,
      repo: GITHUB_REPO,
      path: "sessions.json",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const originalFileSHA = originalFile.data["sha"];

  // update file with new data
  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: GITHUB_USERNAME,
    repo: GITHUB_REPO,
    path: "sessions.json",
    message: `updates sessions - ${Date.now()}`,
    committer: {
      name: "Dwane Hemmings",
      email: "hey@dwane.io",
    },
    content: base64newSessions,
    sha: originalFileSHA,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return new Response(
    JSON.stringify({
      status: "Success",
    })
  );
};
