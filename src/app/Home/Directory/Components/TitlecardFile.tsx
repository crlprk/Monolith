'use client'

import { WebviewWindow } from "@tauri-apps/api/window";

interface TitlecardFileProps {
    metadata: any;
}

export default function TitlecardFile({ metadata }: TitlecardFileProps) {
    function onFileClick() {
        let windowLabel = metadata.name as string;
        windowLabel = windowLabel.replace(/\W/g, '');

        const fileWindow = new WebviewWindow(windowLabel, {
            url: `Home/Entry?path=${encodeURIComponent(metadata.path)}`
        });
        fileWindow.once('tauri://created', function () {
            fileWindow.setTitle(metadata.name);
            console.log("Created new window: ", metadata.name);
        });
        fileWindow.once('tauri://error', function (e) {
            console.log("failed: ", metadata.name, e);
        });
    }
    return (
        <button onClick={onFileClick}>
            <p>{ metadata.name }</p>
        </button>
    )
}