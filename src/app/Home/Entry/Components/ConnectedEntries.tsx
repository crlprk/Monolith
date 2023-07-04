'use client'

import { useContext, useEffect, useState } from "react";
import { EntryContext } from "./EntryProvider";
import TitlecardFile from "../../Directory/Components/TitlecardFile";

export default function ConnectedEntries(){
    const {entryData, filePath} = useContext(EntryContext);

    const [associatedFiles, setAssociatedFiles] = useState<any>(null);
    

    useEffect(() => {
        setAssociatedFiles(entryData.associated_files);
    }, [entryData]);

    if (!associatedFiles) {
        return <div>Loading</div>
    }
    return (
        <div>
            <ul>
                {
                    associatedFiles.map((file: string, index: number) => (
                        <li key={file}><TitlecardFile entryPath={file}/></li>
                    ))
                }
            </ul>
        </div>
    )
}