import { HasData, HasStyle } from './interfaces';
import { TextStyle } from './style';

export interface TextData {
    content: string[];
    style: TextStyle;
}

export interface IText {
    setTextStyle(style: TextStyle): void;
    writeCharAt(char: string, rowIndex: number, colIndex: number, isOverwrite?: boolean): void;
    insertLineBreakAt(rowIndex: number, colIndex: number): void;
    deleteCharAt(rowIndex: number, colIndex: number): void;
    getTextGrid(gridRows: number, gridColumns: number): string[][];
};

export class Text implements IText, HasData<TextData> {
    private content: string[] = [];
    private style: TextStyle = {};

    setTextStyle(style: TextStyle) {
        this.style = style;
    }

    writeCharAt(char: string, rowIndex: number, colIndex: number, isOverwrite = false) {
        const overWriteAdjust = isOverwrite ? 1 : 0;
        while(rowIndex >= this.content.length) {
            this.content.push('');
        }
        let activeRow = this.content[rowIndex]
            .padEnd(colIndex + overWriteAdjust, ' ');
        this.content[rowIndex] = ([
            activeRow.substring(0, colIndex),
            activeRow.substring(colIndex + overWriteAdjust),
        ]).join(char);
    }

    insertLineBreakAt(rowIndex: number, colIndex: number) {
        if (rowIndex >= this.content.length) {
            return;
        }
        let activeRow = this.content[rowIndex];
        const preBreakRow = activeRow.substring(0, colIndex);
        const postBreakRow = activeRow.substring(colIndex);
        this.content.splice(rowIndex, 1, preBreakRow, postBreakRow);
    }

    deleteCharAt(rowIndex: number, colIndex: number) {
        if (rowIndex >= this.content.length) {
            return;
        }
        const activeRow = this.content[rowIndex];
        if (colIndex >= activeRow.length) {
            return;
        }
        this.content[rowIndex] = ([
            activeRow.substring(0, colIndex),
            activeRow.substring(colIndex + 1),
        ]).join('').trimEnd();
    }

    getText(): ReadonlyArray<string> {
        return this.content;
    }

    getData() {
        return { content: this.content, style: this.style };
    }

    private arrangeTextNoWrap(rows: number, cols: number, overflowChar: string) {
        const grid: string[][] = [];
        
        for (let ir = 0; ir < rows; ir++) {
            grid.push([]);
            for (let ic = 0; ic < cols; ic++) {
                grid[ir][ic] = this.content[ir][ic] || ' ';
            }
            if (this.content[ir][cols]) {
                grid[ir][cols - 1] = overflowChar;
            }
        }
        if (this.content[rows]) {
            grid[rows - 1][cols - 1] = overflowChar;
        }

        return grid;
    }

    getTextGrid(rowCount: number, colCount: number) {
        // TODO: change this behvaiour according to text settings
        return this.arrangeTextNoWrap(rowCount, colCount, "$");
    }
}
