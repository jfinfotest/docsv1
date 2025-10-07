/**
 * PrismJS theme configuration for code syntax highlighting
 * This file contains all available PrismJS themes from the prism-themes npm package
 * For a full list of themes, see: https://github.com/PrismJS/prism-themes
 */

// Helper function to get the correct path for prism themes from node_modules
const getPrismThemePath = (filename: string) => {
    const basePath = import.meta.env.BASE_URL || '/';
    return `${basePath}prism-themes/${filename}`.replace(/\/+/g, '/');
};

// Core PrismJS themes (from prismjs package)
const getCoreThemePath = (filename: string) => {
    const basePath = import.meta.env.BASE_URL || '/';
    return `${basePath}prism-core/${filename}`.replace(/\/+/g, '/');
};

export const PRISM_THEMES = [
    // --- Core Themes (from prismjs) ---
    { id: 'prism-default', name: 'Default', url: getCoreThemePath('prism.min.css') },
    { id: 'prism-coy', name: 'Coy', url: getCoreThemePath('prism-coy.min.css') },
    { id: 'prism-dark', name: 'Dark', url: getCoreThemePath('prism-dark.min.css') },
    { id: 'prism-funky', name: 'Funky', url: getCoreThemePath('prism-funky.min.css') },
    { id: 'prism-okaidia', name: 'Okaidia', url: getCoreThemePath('prism-okaidia.min.css') },
    { id: 'prism-solarized-light', name: 'Solarized Light', url: getCoreThemePath('prism-solarizedlight.min.css') },
    { id: 'prism-tomorrow', name: 'Tomorrow Night', url: getCoreThemePath('prism-tomorrow.min.css') },
    { id: 'prism-twilight', name: 'Twilight', url: getCoreThemePath('prism-twilight.min.css') },
    
    // --- Prism-Themes Collection (https://github.com/PrismJS/prism-themes) ---
    { id: 'prism-a11y-dark', name: 'A11y Dark', url: getPrismThemePath('prism-a11y-dark.min.css') },
    { id: 'prism-atom-dark', name: 'Atom Dark', url: getPrismThemePath('prism-atom-dark.min.css') },
    { id: 'prism-base16-atelier-sulphurpool-light', name: 'Atelier Sulphurpool', url: getPrismThemePath('prism-base16-ateliersulphurpool.light.min.css') },
    { id: 'prism-cb', name: 'CB (Code B)', url: getPrismThemePath('prism-cb.min.css') },
    { id: 'prism-coldark-cold', name: 'Coldark Cold', url: getPrismThemePath('prism-coldark-cold.min.css') },
    { id: 'prism-coldark-dark', name: 'Coldark Dark', url: getPrismThemePath('prism-coldark-dark.min.css') },
    { id: 'prism-coy-without-shadows', name: 'Coy Without Shadows', url: getPrismThemePath('prism-coy-without-shadows.min.css') },
    { id: 'prism-darcula', name: 'Darcula', url: getPrismThemePath('prism-darcula.min.css') },
    { id: 'prism-dracula', name: 'Dracula', url: getPrismThemePath('prism-dracula.min.css') },
    { id: 'prism-duotone-dark', name: 'Duotone Dark', url: getPrismThemePath('prism-duotone-dark.min.css') },
    { id: 'prism-duotone-earth', name: 'Duotone Earth', url: getPrismThemePath('prism-duotone-earth.min.css') },
    { id: 'prism-duotone-forest', name: 'Duotone Forest', url: getPrismThemePath('prism-duotone-forest.min.css') },
    { id: 'prism-duotone-light', name: 'Duotone Light', url: getPrismThemePath('prism-duotone-light.min.css') },
    { id: 'prism-duotone-sea', name: 'Duotone Sea', url: getPrismThemePath('prism-duotone-sea.min.css') },
    { id: 'prism-duotone-space', name: 'Duotone Space', url: getPrismThemePath('prism-duotone-space.min.css') },
    { id: 'prism-ghcolors', name: 'GitHub', url: getPrismThemePath('prism-ghcolors.min.css') },
    { id: 'prism-gruvbox-dark', name: 'Gruvbox Dark', url: getPrismThemePath('prism-gruvbox-dark.min.css') },
    { id: 'prism-gruvbox-light', name: 'Gruvbox Light', url: getPrismThemePath('prism-gruvbox-light.min.css') },
    { id: 'prism-holi-theme', name: 'Holi Theme', url: getPrismThemePath('prism-holi-theme.min.css') },
    { id: 'prism-hopscotch', name: 'Hopscotch', url: getPrismThemePath('prism-hopscotch.min.css') },
    { id: 'prism-lucario', name: 'Lucario', url: getPrismThemePath('prism-lucario.min.css') },
    { id: 'prism-material-dark', name: 'Material Dark', url: getPrismThemePath('prism-material-dark.min.css') },
    { id: 'prism-material-light', name: 'Material Light', url: getPrismThemePath('prism-material-light.min.css') },
    { id: 'prism-material-oceanic', name: 'Material Oceanic', url: getPrismThemePath('prism-material-oceanic.min.css') },
    { id: 'prism-night-owl', name: 'Night Owl', url: getPrismThemePath('prism-night-owl.min.css') },
    { id: 'prism-nord', name: 'Nord', url: getPrismThemePath('prism-nord.min.css') },
    { id: 'prism-one-dark', name: 'One Dark', url: getPrismThemePath('prism-one-dark.min.css') },
    { id: 'prism-one-light', name: 'One Light', url: getPrismThemePath('prism-one-light.min.css') },
    { id: 'prism-pojoaque', name: 'Pojoaque', url: getPrismThemePath('prism-pojoaque.min.css') },
    { id: 'prism-shades-of-purple', name: 'Shades of Purple', url: getPrismThemePath('prism-shades-of-purple.min.css') },
    { id: 'prism-solarized-dark-atom', name: 'Solarized Dark Atom', url: getPrismThemePath('prism-solarized-dark-atom.min.css') },
    { id: 'prism-synthwave84', name: 'Synthwave \'84', url: getPrismThemePath('prism-synthwave84.min.css') },
    { id: 'prism-vs', name: 'VS', url: getPrismThemePath('prism-vs.min.css') },
    { id: 'prism-vsc-dark-plus', name: 'VSC Dark Plus', url: getPrismThemePath('prism-vsc-dark-plus.min.css') },
    { id: 'prism-xonokai', name: 'Xonokai', url: getPrismThemePath('prism-xonokai.min.css') },
    { id: 'prism-z-touch', name: 'Z-Touch', url: getPrismThemePath('prism-z-touch.min.css') },
];

export const DEFAULT_PRISM_THEME = 'prism-dracula';

export type PrismThemeConfig = {
    id: string;
    name: string;
    url: string;
};
