'use client';

import { useContext, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { ConfigContext } from "./ConfigProvider";
import { ConfigType } from "@/util/ConfigType";
import TitlecardFile from "./TitlecardFile";
import TitlecardDirectory from "./TitlecardDirectory";
import TitlecardEscape from "./TitlecardEscape";

interface OrderHierarchyProps {
    currentDir: string;
    escapeDir: string;
    onDirectoryClick?: any;
}

export default function OrderHierarchy({ currentDir, escapeDir, onDirectoryClick }: OrderHierarchyProps) {
    const config = useContext(ConfigContext) as unknown as ConfigType;

    const [isLoaded, setLoaded] = useState(false);
    const [entries, setEntries] = useState<object | unknown>(null);

    //Move ondirectoryclick to directory, pass currentdir as prop so that it saves between switches

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
            {escapeDir != currentDir && <TitlecardEscape escapeDir={escapeDir} onClick={onDirectoryClick} />}
            {
                Object.entries(entries as object).map(([entryName, entryData]) => {
                    if (entryData.File) {
                        return (
                            <TitlecardFile metadata={entryData.File} />
                        )
                    }
                    else {
                        return (
                            <TitlecardDirectory dirName={entryName} dirPath={entryData.Directory} onClick={onDirectoryClick} />
                        )
                    }
                })
            }
        </div>
    );
}