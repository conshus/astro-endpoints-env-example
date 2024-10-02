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
  