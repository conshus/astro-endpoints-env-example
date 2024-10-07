// declare const Buffer
export const prerender = false;
import type { APIRoute } from 'astro';
// import { env } from '../../utils/env.js'
// const { GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO } = env;
// const { GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO } = import.meta.env;
import { getEnvs } from "../../utils/env.js";
import { Octokit } from "@octokit/core";
// const octokit = new Octokit({ auth: GITHUB_PAT });

export const GET: APIRoute = async (context) => {
  console.log("context: ", context);
  const locals = context.locals;
  const { GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO } = getEnvs(locals);
  const octokit = new Octokit({ auth: GITHUB_PAT });
  const originalFile = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: GITHUB_USERNAME,
      repo: GITHUB_REPO,
      path: 'sessions.json',
      headers: {
          'X-GitHub-Api-Version': '2022-11-28'
      }
  });

  // const sessionsContent = Buffer.from(originalFile.data['content'], "base64").toString();
  const sessionsContent = atob(originalFile.data["content"]);

  return new Response(
    JSON.stringify({
      body: sessionsContent,
    })
  );
};

function encodeEventsToBase64(body) {
  // 1. Stringify the events object
  const eventsString = JSON.stringify(body.events);

  // 2. Use TextEncoder to convert the string to a Uint8Array
  const encoder = new TextEncoder();
  const bytes = encoder.encode(eventsString);

  // 3. Use btoa() to convert the Uint8Array to base64 encoded string
  const base64String = btoa(String.fromCharCode(...bytes));

  return base64String;
}

export const POST: APIRoute = async ({ request, locals }) => {
  const { GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO } = getEnvs(locals);
  const octokit = new Octokit({ auth: GITHUB_PAT });

  const body = await request.json();
  // const base64newSessions = Buffer.from(JSON.stringify(body.events)).toString('base64');
  const base64newSessions = encodeEventsToBase64(body);
  const originalFile = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: GITHUB_USERNAME,
    repo: GITHUB_REPO,
    path: 'sessions.json',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const originalFileSHA = originalFile.data['sha'];

  // update file with new data
  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: GITHUB_USERNAME,
    repo: GITHUB_REPO,
    path: 'sessions.json',
    message: `updates sessions - ${Date.now()}`,
    committer: {
      name: 'Dwane Hemmings',
      email: 'hey@dwane.io',
    },
    content: base64newSessions,
    sha: originalFileSHA,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  return new Response(
    JSON.stringify({
      status : 'Success',
    })
  );
};
