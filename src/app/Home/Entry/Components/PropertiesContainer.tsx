'use client'

import { useContext, useEffect, useState } from "react"
import { EntryContext } from "./EntryProvider";
import { invoke } from "@tauri-apps/api";

export default function PropertiesContainer() {
    const { entryData, filePath } = useContext(EntryContext);

    const [metadata, setMetadata] = useState<any>(null);

    useEffect(() => {
        invoke('load_file_metadata', { path: filePath })
            .then((response) => {
                console.log("Successfully loaded entry metadata");
                setMetadata(response);
            })
            .catch((error) => {
                console.error('Error reading metadata: ', error);
            });
    }, [])

    if (!metadata) {
        return <div>Loading</div>
    }
    return (
        <div>
            <div>
                <p>Path: </p>
                <p>{metadata.path}</p>
            </div>
            <div>
                <p>Size: </p>
                <p>
                    {
                        metadata.size >= 1e9
                        ? `${(metadata.size / 1e9).toFixed(2)} GB`
                        : metadata.size >= 1e6
                        ? `${(metadata.size / 1e6).toFixed(2)} MB`
                        : metadata.size >= 1e3
                        ? `${(metadata.size / 1e3).toFixed(2)} KB`
                        : `${metadata.size} bytes`
                    }
                </p>
            </div>
            <div>
                <p>Created: </p>
                <p>{metadata.created}</p>
            </div>
            <div>
                <p>Modified: </p>
                <p>{metadata.modified}</p>
            </div>
            <div>
                <p>Accessed: </p>
                <p>{metadata.accessed}</p>
            </div>
        </div>
    )
}