/// <reference types="astro/client" />

declare module 'eslint-plugin-jsx-a11y';

interface ImportMetaEnv {
    readonly SUPABASE_PUBLISHABLE_KEY: string;
    readonly SUPABASE_URL: string;
}

interface Route {
    children?: Route[];
    label: string;
    path: string;
}
