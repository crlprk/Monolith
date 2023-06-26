'use client'

import { useContext, useEffect, useState } from "react";
import { EntryContext } from "./EntryProvider";
import { EntryType } from "@/util/EntryType";
import { invoke } from "@tauri-apps/api";

export default function ConnectedEntries(){
    const {entryData, filePath} = useContext(EntryContext);
    
    const [isLoaded, setLoaded] = useState(false);
    const [associatedFiles, setAssociatedFiles] = useState<object | unknown>(null);
    

    useEffect(() => {
        invoke('load_file_metadata_multi', { files: entryData.associated_files })
            .then((response) => {
                console.log("Successfully loaded connected entries");
                setAssociatedFiles(response);
            })
            .catch((error) => {
                console.error('Error reading connected entries: ', error);
            });
        setLoaded(true);
    }, []);

    if (!isLoaded) {
        return <div>Loading</div>
    }
    return (
        <div>list of connected</div>
    )
}