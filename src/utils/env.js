// console.log("env.js!",import.meta.env);
export let env;

if (import.meta.env.DEV){
    env = import.meta.env;
}

// export env