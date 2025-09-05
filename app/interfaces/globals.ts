import { Key } from "react";

export interface VolumeItem {
    name: Key;
    treatedPagesCount: number;
    totalPagesCount: number;
    percentage: number | undefined;
    running: boolean;
    completed: boolean;
    downloadLink: string | undefined;
}

export interface TitleItem {
    id: Key;
    name: string;
    volumes: VolumeItem[] | [];
    running: boolean | undefined;
}

export interface JobItem {
    id: Key;
    title: TitleItem;
    eta: number | undefined;
    completed: boolean | undefined;
}
