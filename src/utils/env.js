// console.log("env.js!",import.meta.env);
let CF_PAGES, Deno;
export let env;



if (Deno !== undefined){
  const denoenv = Deno.env.toObject();
  console.log("denoenv:", denoenv);
  
}

if (import.meta.env.DEV){
    console.log("dev mode");
    // const isDenoDeploy = Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
    // console.log(process.env)
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


export function getEnvs(locals, context) {
    console.log("function getEnvs!!");
    console.log("Deno: ", Deno);
    console.log({ locals, context });

    console.log("import.meta.env: ",import.meta.env);
    console.log("process.env: ",process.env);
    if (import.meta.env.DEV) {
      console.log("in development mode");
      console.log({ locals, context });
      return import.meta.env;
    } else if (locals.runtime.env.CF_PAGES) {
      console.log("on cloudflare");
      return locals.runtime.env;
    }
  }

// export env