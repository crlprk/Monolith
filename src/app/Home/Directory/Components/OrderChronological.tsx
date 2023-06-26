'use client';

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import TitlecardFile from "./TitlecardFile";

interface OrderChronologicalProps {
    currentDir: string;
}

export default function OrderChronological({ currentDir }: OrderChronologicalProps) {
    const [isLoaded, setLoaded] = useState(false);
    const [entries, setEntries] = useState<object[] | unknown>(null);

    useEffect(() => {
        invoke('locate_all_chronological_order', { homeDirectory: currentDir })
            .then((response) => {
                console.log('Located all markdown files in', currentDir);
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
                {Array.isArray(entries) && entries.map(entryData => (
                    <li><TitlecardFile key={entryData.path} entryName={entryData.name} entryPath={entryData.path} /></li>
                ))}
            </ul>
        </div>
    );
}