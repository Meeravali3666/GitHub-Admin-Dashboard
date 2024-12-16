import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Vibrant blue for primary actions
        },
        secondary: {
            main: '#f50057', // Pink for secondary actions
        },
        background: {
            default: '#f4f5f7', // Light gray background
            paper: '#ffffff', // White cards
        },
        text: {
            primary: '#333333', // Darker text for better readability
            secondary: '#666666', // Muted text for less emphasis
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: 14,
        h4: {
            fontWeight: 700,
            color: '#333333',
        },
        body1: {
            color: '#666666',
        },
        button: {
            textTransform: 'none', // Disable uppercase for buttons
        },
    },
    shape: {
        borderRadius: 12, // Rounded corners for UI elements
    },
    shadows: [
        'none',
        '0px 4px 6px rgba(0, 0, 0, 0.1)', // Add light shadow
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '10px 20px',
                    borderRadius: '8px',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                },
            },
        },
    },
});

export default theme;
