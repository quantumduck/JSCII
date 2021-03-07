import {TextPattern} from './interfaces';

interface BasicStyle {
    pattern?: TextPattern;
    isWhitespaceTransparent?: boolean;
};

enum TextDirection {
    RIGHT_DOWN,
    RIGHT_UP,
    LEFT_DOWN,
    LEFT_UP,
    DOWN_RIGHT,
    DOWN_LEFT,
    UP_RIGHT,
    UP_LEFT,
};

export interface TextStyle {
    textDirection?: TextDirection;
    isRightJustify?: boolean;
    isBottomJustify?: boolean;
};

export interface BackgroundStyle extends BasicStyle {
    isWidthSymmetric?: boolean;
    isHeightSymmetric?: boolean;
};

export interface LineStyle extends BasicStyle {
    width?: number; // integer >= 1
    isWidthSymmetric?: boolean;
    isLengthSymmetric?: boolean;
};

export interface CornerStyle extends BasicStyle {
    isDiagonal?: boolean;
};

export interface ArrowStyle extends BasicStyle {
    length?: number;
};

export interface BordersStyle {
    corners?: CornerStyle[]; // length 0, 1, or 4
    borders?: LineStyle[]; // length 0, 1, 2, or 4
};

export interface BoxStyle {
    background?: BackgroundStyle;
    borders?: BordersStyle;
};

export interface TextBoxStyle extends BoxStyle {
    text?: TextStyle;
}

export interface ConnectorStyle {
    line?: LineStyle;
    vertical?: LineStyle;
    horizontal?: LineStyle;
    corners?: CornerStyle[];
    start?: ArrowStyle[];
    end?: ArrowStyle[]; 
};

export interface Style {
    box?: BoxStyle;
    text?: TextStyle;
    connector?: ConnectorStyle;
}

export function fill(fillCharacter: string) {
    return { pattern: [fillCharacter] };
};

export function symmetricBackground(pattern: TextPattern): BackgroundStyle {
    return { pattern, isHeightSymmetric: true, isWidthSymmetric: true };
};

export function transparentBackground(): BackgroundStyle {
    return { isWhitespaceTransparent: true };
};

export function line(pattern: TextPattern, width?: number): LineStyle {
    return { pattern, width: width || pattern.length };
};

export function defaultBorders(): BordersStyle {
    return {
        corners: [fill('+')],
        borders: [line(['-']), line(['|'])],
    };
};

export function transparentBorders(): BordersStyle {
    return {
        corners: [transparentBackground()],
        borders: [{ ... transparentBackground(), width: 1}],
    }
};

export function createTransparentBorder(width = 1): BordersStyle {
    return {
        corners: [{ pattern: [] }],
        borders: []
    }
};

export function defaultConnector(): ConnectorStyle {
    return {
        vertical: line(['|']),
        horizontal: line(['-']),
        corners: [fill('+')],
        start: [fill('+')],
        end: [fill('+')],
    }
};

export function defaultArrowConnector(): ConnectorStyle {
    return {
        ...defaultConnector(),
        end: [fill('>'), fill('v'), fill('<'), fill('^')],
    }
};
