import * as _env from "$env/static/public";

const getEnv = (value: string) => {
    const env = _env as Record<string, string | undefined>;
    const key = `DEFAULT_${value}`;

    if (key in env) {
        return env[key];
    }
};

const variables = {
    name: "nexara",
    description:
        "Społeczność pasjonatów technologii, wolnego oprogramowania i prywatności. Dążymy do stworzenia inspirującego i wspierającego środowiska, w którym każdy może się rozwijać.",
    hostname: getEnv("HOST"),
    api: getEnv("API"),
};

export const socialLinks = {
    discord: "https://discord.gg/shqVcd6Nqx",
    git: `https://git.${variables.hostname}/${variables.name}/${variables.name}`,
};

export default variables;
