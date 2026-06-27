/// <reference types="astro/client" />

declare module 'eslint-plugin-jsx-a11y';

interface Route {
    children?: Route[];
    label: string;
    path: string;
}
