/**
 * Text Optimization Utility for Resume
 * Handles dynamic font sizing, content truncation, and layout optimization
 */

interface TextOptimizationConfig {
  maxLength?: number;
  fontSize: 'small' | 'medium' | 'large';
  lineSpacing: 'compact' | 'normal' | 'comfortable';
  autoOptimize: boolean;
}

interface FontSizeConfig {
  small: {
    title: number;
    heading: number;
    body: number;
    caption: number;
  };
  medium: {
    title: number;
    heading: number;
    body: number;
    caption: number;
  };
  large: {
    title: number;
    heading: number;
    body: number;
    caption: number;
  };
}

const FONT_SIZES: FontSizeConfig = {
  small: {
    title: 9,
    heading: 8,
    body: 7,
    caption: 6,
  },
  medium: {
    title: 11,
    heading: 10,
    body: 9,
    caption: 8,
  },
  large: {
    title: 13,
    heading: 12,
    body: 11,
    caption: 10,
  },
};

const LINE_SPACING: Record<string, number> = {
  compact: 1.2,
  normal: 1.4,
  comfortable: 1.6,
};

/**
 * Calculate optimal font size based on content length
 * Longer content = smaller font for better fit
 */
export const calculateOptimalFontSize = (
  contentLength: number,
  baseSize: 'small' | 'medium' | 'large'
): 'small' | 'medium' | 'large' => {
  // Estimate: A4 page can fit ~3000-3500 characters at medium size
  if (contentLength > 4500) {
    return 'small';
  } else if (contentLength > 3500) {
    return baseSize === 'large' ? 'medium' : 'small';
  } else if (contentLength < 2000) {
    return baseSize === 'small' ? 'medium' : baseSize;
  }

  return baseSize;
};

/**
 * Get font size values based on preset
 */
export const getFontSizePixels = (
  type: keyof FontSizeConfig['small'],
  preset: 'small' | 'medium' | 'large'
): number => {
  return FONT_SIZES[preset][type];
};

/**
 * Get line spacing multiplier
 */
export const getLineSpacing = (spacing: 'compact' | 'normal' | 'comfortable'): number => {
  return LINE_SPACING[spacing];
};

/**
 * Truncate text intelligently - keeps complete words
 */
export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;

  let truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.7) {
    truncated = truncated.substring(0, lastSpace);
  }

  return truncated + '...';
};

/**
 * Calculate estimated page count based on content
 */
export const estimatePageCount = (
  contentLength: number,
  fontSize: 'small' | 'medium' | 'large'
): number => {
  // Rough estimation: 
  // Small font: ~4500 chars per page
  // Medium font: ~3000 chars per page
  // Large font: ~2000 chars per page

  const charsPerPage = {
    small: 4500,
    medium: 3000,
    large: 2000,
  };

  return Math.ceil(contentLength / charsPerPage[fontSize]);
};

/**
 * Get CSS class for optimal text rendering
 */
export const getTextOptimizationClass = (
  config: Partial<TextOptimizationConfig>
): string => {
  const fontSize = config.fontSize || 'medium';
  const lineSpacing = config.lineSpacing || 'normal';

  return `text-${fontSize} leading-${lineSpacing}`;
};

/**
 * Create optimized text for a resume section
 * Removes unnecessary whitespace and optimizes line breaks
 */
export const optimizeTextForResume = (text: string): string => {
  return text
    .trim() // Remove leading/trailing whitespace
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Remove multiple blank lines
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
};

/**
 * Calculate if content fits on single page
 */
export const fitsOnSinglePage = (
  contentLength: number,
  fontSize: 'small' | 'medium' | 'large'
): boolean => {
  return estimatePageCount(contentLength, fontSize) <= 1;
};

/**
 * Suggest adjustments to fit on single page
 */
export const suggestPageFitAdjustments = (
  contentLength: number,
  currentFontSize: 'small' | 'medium' | 'large'
): string[] => {
  const suggestions: string[] = [];
  const pageCount = estimatePageCount(contentLength, currentFontSize);

  if (pageCount > 1) {
    if (currentFontSize === 'large') {
      suggestions.push('Try reducing font size to "medium" for better fit');
    }
    if (currentFontSize === 'medium') {
      suggestions.push('Try reducing font size to "small" or reducing content');
    }
    if (currentFontSize === 'small') {
      suggestions.push('Consider removing less important sections or details');
    }
  }

  return suggestions;
};

/**
 * Get optimized resume configuration
 */
export const getOptimizedConfig = (
  resumeContentLength: number,
  preferences: Partial<TextOptimizationConfig>
): TextOptimizationConfig => {
  let fontSize = preferences.fontSize || 'medium';

  // Auto-optimize if enabled
  if (preferences.autoOptimize) {
    fontSize = calculateOptimalFontSize(resumeContentLength, fontSize);
  }

  return {
    fontSize,
    lineSpacing: preferences.lineSpacing || 'normal',
    autoOptimize: preferences.autoOptimize ?? true,
  };
};
