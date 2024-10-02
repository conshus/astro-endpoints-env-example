declare const Buffer
import type { APIRoute } from 'astro';
const { GITHUB_PAT } = import.meta.env;
import { Octokit } from "@octokit/core";
const octokit = new Octokit({ auth: GITHUB_PAT });

export const GET: APIRoute = async () => {
  const originalFile = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'conshus',
      repo: 'astro-endpoints-env-example',
      path: 'sessions.json',
      headers: {
          'X-GitHub-Api-Version': '2022-11-28'
      }
  });

  const sessionsContent = Buffer.from(originalFile.data['content'], "base64").toString();


  return new Response(
    JSON.stringify({
      body: sessionsContent,
    })
  );
};


export const POST: APIRoute = async ({ request }) => {

  const base64newSessions = Buffer.from(request.body).toString('base64');

  const originalFile = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: 'conshus',
    repo: 'astro-endpoints-env-example',
    path: 'sessions.json',
    headers: {
        'X-GitHub-Api-Version': '2022-11-28'
    }
  });

  const originalFileSHA = originalFile.data['sha'];

  // update file with new data
  await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
    owner: 'conshus',
    repo: 'astro-endpoints-env-example',
    path: "sessions.json",
    message: `updates sessions - ${Date.now()}`,
    committer: {
      name: "Dwane Hemmings",
      email: 'hey@dwane.io',
    },
    content: base64newSessions,
    sha: originalFileSHA,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  return new Response(
    JSON.stringify({
      status : 'Success',
    })
  );
};
