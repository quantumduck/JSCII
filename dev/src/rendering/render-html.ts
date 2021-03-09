import { Coordinates } from "../drawing/interfaces";

const EMPTY_SLOT = {
    character: '&nbsp',
};
interface CharacterSlot {
    character: string;
    reference?: Object;
}


export class DrawArea {
    private background: CharacterSlot[][] = [];
    private foreground: CharacterSlot[][] = [];
    private foregroundOffset: Coordinates = [0, 0];

    private clearBackground() {
        for (const row of this.background) {
            for (const colIndex in row) {
                row[colIndex] = EMPTY_SLOT;
            }
        }
    }

    private writeForegroundToBackground() {
        let [rowIndex, colIndex] = this.foregroundOffset;
        for (const row of this.foreground) {
            for (const charSlot of row) {
                if (charSlot.character) {
                    this.background[rowIndex][colIndex] = charSlot;
                }
                colIndex++;
            }
            rowIndex++;
        }
    }

    private isInForeground([row, col]: Coordinates) {
        return row >= this.foregroundOffset[0] &&
            row < this.foregroundOffset[0] + this.foreground.length &&
            col >= this.foregroundOffset[1] &&
            col < this.foregroundOffset[1] + this.foreground[0].length;
    }

    getObjectAt([row, col]: Coordinates) {
        if (this.isInForeground([row, col])) {
            const result = this.foreground[row][col].reference;
            if (result) {
                return result;
            }
        }

        return this.background[row][col].reference;
    }

    getHtml() {

    }
}
