/**
 * Application Theme Constants
 * Central source of truth for design tokens (colors, spacing, etc.)
 */

export const THEME = {
    light: {
        // The main background color used in PageBackground.tsx
        background: '#EDE8D0',
        // Primary text color
        text: '#000000',

        // Tailwind utility classes for easy usage in components
        classes: {
            text: 'text-black',
            bg: 'bg-[#EDE8D0]',
            hover: 'hover:text-gray-700'
        }
    }
}

export default THEME;
