'use client'

import { WebviewWindow } from "@tauri-apps/api/window";

interface TitlecardFileProps {
    entryName: string;
    entryPath: string;
}

export default function TitlecardFile({ entryName, entryPath }: TitlecardFileProps) {
    function onFileClick() {
        let windowLabel = entryName as string;
        windowLabel = windowLabel.replace(/\W/g, '');

        const fileWindow = new WebviewWindow(windowLabel, {
            url: `Home/Entry?path=${encodeURIComponent(entryPath)}`
        });
        fileWindow.once('tauri://created', function () {
            fileWindow.setTitle(entryName);
            console.log("Created new window: ", entryName);
        });
        fileWindow.once('tauri://error', function (e) {
            console.log("failed: ", entryName, e);
        });
    }
    return (
        <button onClick={onFileClick}>
            <p>{ entryName }</p>
        </button>
    )
}