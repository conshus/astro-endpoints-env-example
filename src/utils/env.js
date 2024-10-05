// console.log("env.js!",import.meta.env);
let CF_PAGES, Deno;
export let env;

if (import.meta.env.DEV){
    console.log("dev mode");
    // const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
    console.log(process.env)
    env = import.meta.env;
} else if (CF_PAGES){
    // check for Cloudflare (could also be process.env or context.env )
    console.log("cloudflare");
    env = {ADMIN_PASSWORD, HOST_PASSWORD, GUEST_PASSWORD, GITHUB_PAT, GITHUB_USERNAME, GITHUB_REPO}
} else if (Deno) {
    // check for Deno
    console.log("Deno");
    env = Deno.env.toObject()

} else if (process) {
    // everywhere else
    console.log("Node");

    env = process.env
}

// export env