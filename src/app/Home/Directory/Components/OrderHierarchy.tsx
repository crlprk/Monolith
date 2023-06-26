'use client';

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import TitlecardFile from "./TitlecardFile";
import TitlecardDirectory from "./TitlecardDirectory";
import TitlecardEscape from "./TitlecardEscape";

interface OrderHierarchyProps {
    currentDir: string;
    escapeDir: string;
    onDirectoryClick?: any;
}

export default function OrderHierarchy({ currentDir, escapeDir, onDirectoryClick }: OrderHierarchyProps) {
    const [isLoaded, setLoaded] = useState(false);
    const [entries, setEntries] = useState<object | unknown>(null);

    useEffect(() => {
        invoke('locate_all_hierarchical_order', { homeDirectory: currentDir })
            .then((response) => {
                console.log('Located all markdown files');
                console.log(response);
                setLoaded(true);
                setEntries(response);
            })
            .catch((error) => {
                console.error('Error reading home directory: ', error);
                // Implement empty response handler, display notice instead
            });
    }, [currentDir]);

    if (!isLoaded) {
        return <div>Loading</div>
    }

    return (
        <div>
            <ul>
                {escapeDir != currentDir && <li><TitlecardEscape escapeDir={escapeDir} onClick={onDirectoryClick} /></li>}
                {
                    Object.entries(entries as object).map(([entryName, entryData]) => {
                        if (entryData.File) {
                            return (
                                <li><TitlecardFile key={entryData.File.path} entryName={entryData.File.name} entryPath={entryData.File.path}/></li>
                            )
                        }
                        else {
                            return (
                                <li><TitlecardDirectory key={entryData.directory} dirName={entryName} dirPath={entryData.Directory} onClick={onDirectoryClick} /></li>
                            )
                        }
                    })
                }
            </ul>
        </div>
    );
}