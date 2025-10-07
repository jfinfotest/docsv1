/**
 * Font configuration for the application
 * This file contains all available fonts that users can select from
 */

export const FONTS = [
    { id: 'Inter', name: 'Inter' },
    { id: 'Roboto', name: 'Roboto' },
    { id: 'Source Sans Pro', name: 'Source Sans Pro' },
    { id: 'Lato', name: 'Lato' },
    { id: 'Montserrat', name: 'Montserrat' },
    { id: 'Poppins', name: 'Poppins' },
    { id: 'Open Sans', name: 'Open Sans' },
    { id: 'Nunito', name: 'Nunito' },
    { id: 'Roboto Mono', name: 'Roboto Mono' },
    { id: 'Merriweather', name: 'Merriweather' },
];

export type FontConfig = {
    id: string;
    name: string;
};
