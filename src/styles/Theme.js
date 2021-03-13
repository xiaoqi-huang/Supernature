import { createMuiTheme } from '@material-ui/core/styles';
import noenPixel from '../fonts/neon-pixel-7.ttf';


const neon = {
    fontFamily: 'neon-pixel-7',
    fontWeight: '400',
    src: `
        url(${noenPixel}) format('truetype')
    `,
};

export const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#1e1972',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            main: '#EAFF5D',
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
    typography: {
        fontFamily: 'neon-pixel-7, sans-serif'
    },
    overrides: {
        MuiCssBaseline: {
            '@global': {
                '@font-face': [neon]
            },
        },
    },
});