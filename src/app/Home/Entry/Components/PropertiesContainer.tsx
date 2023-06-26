'use client'

import { useContext, useEffect, useState } from "react"
import { EntryContext } from "./EntryProvider";
import { EntryType } from "@/util/EntryType";
import { invoke } from "@tauri-apps/api";

export default function PropertiesContainer(){
    const {entryData, filePath} = useContext(EntryContext);

    const [metadata, setMetadata] = useState<object | unknown>(null);
    
    useEffect(() => {
        invoke('load_file_metadata', { path: filePath })
            .then((response) => {
                setMetadata(response);
                console.log(response);
            })
            .catch((error) => {
                console.error('Error reading metadata: ', error);
            });
    }, [])

    if (!metadata) {
        return <div>Loading</div>
    }
    return (
        <p>properties</p>
    )
}