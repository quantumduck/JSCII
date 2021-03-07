import { HasData } from './interfaces';
import {BoxStyle, TextBoxStyle, TextStyle} from './style';
import { IText, Text, TextData } from './text';

export interface TextBoxData extends TextData {
    height: number;
    width: number;
    boxStyle: BoxStyle;
};

export interface IBox {
    resize(length: number, width: number): void;
    setBoxStyle(style: BoxStyle): void;
    setTransparency(isTransparent: boolean): void;
    getDimensions(): [number, number];
 };

export class TextBox implements IText, IBox, HasData<TextBoxData> {
    private style: TextBoxStyle = {};

    constructor(
        private height: number,
        private width: number,
        private text: IText & HasData<TextData> = new Text()
    ) {}

    resize(width: number, height: number) {
        this.height = height;
        this.width = width;
    }

    getDimensions(): [number, number] {
        return [this.width, this.height];
    }

    setBoxStyle(style: TextBoxStyle) {
        this.style = style;
    }

    setTextStyle(style: TextStyle) {
        this.text.setTextStyle(style);
    }

    setTransparency(isTransparent: boolean) {
        this.style.background = this.style.background || {};
        this.style.background.isWhitespaceTransparent = isTransparent;
    }

    writeCharAt(char: string, rowIndex: number, colIndex: number, isOverwrite?: boolean) {
        this.text.writeCharAt(char, rowIndex, colIndex, isOverwrite);
    }

    insertLineBreakAt(rowIndex: number, colIndex: number) {
        this.text.insertLineBreakAt(rowIndex, colIndex);
    }

    deleteCharAt(rowIndex: number, colIndex: number) {
        this.text.deleteCharAt(rowIndex, colIndex);
    }

    getData(): TextBoxData {
        return {
            ...this.text.getData(),
            height: this.height,
            width: this.width,
            boxStyle: this.style,
        };
    }
}
