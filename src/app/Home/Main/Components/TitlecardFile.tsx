'use client'

import { WebviewWindow } from "@tauri-apps/api/window";
import Link from "next/link";

interface TitlecardFileProps {
    metadata: any;
}

export default function TitlecardFile({ metadata }: TitlecardFileProps) {
    function onFileClick() {
        let windowLabel = metadata.name as string;
        windowLabel = windowLabel.replace(/\W/g, '');

        const webview = new WebviewWindow(windowLabel, {
            url: 'Home/Main/' + metadata.name
        });
        webview.once('tauri://created', function () {
            console.log("opened: ", metadata.name);
        });
        webview.once('tauri://error', function (e) {
            console.log("failed: ", metadata.name, e);
        });
    }
    return (
        <button onClick={onFileClick}>
            <p>{ metadata.name }</p>
        </button>
    )
}