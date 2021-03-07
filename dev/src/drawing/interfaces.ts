export type TextPattern = string[];

export interface HasData<T> {
    getData(): T;
}

export interface HasStyle<T> {
    setStyle(style: T): void;
}
