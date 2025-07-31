export const APP_METADATA = {
  NAME: 'React Flow Diagrammer',
  VERSION: '1.0.0',
  DESCRIPTION: 'A flow and process diagrammer supporting complex projects with nested subflows',
} as const;

export const PERFORMANCE_CONFIG = {
  API_DELAY: 500,
  DEBOUNCE_DELAY: 300,
  AUTO_SAVE_INTERVAL: 5000,
} as const;

export const UI_CONFIG = {
  SIDEBAR_WIDTH: {
    DEFAULT: 320,
    MOBILE: 280,
    TABLET: 300,
  },
  CANVAS_PADDING: 20,
  NODE_SPACING: {
    HORIZONTAL: 200,
    VERTICAL: 100,
  },
} as const;