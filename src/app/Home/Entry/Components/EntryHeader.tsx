'use client'

import { useContext } from "react";
import { EntryContext } from "./EntryProvider";

export default function EntryHeader() {
    const { entryData, filePath } = useContext(EntryContext);

    return (
        <div>
            <h1>{entryData.title}</h1>
            <h3>{entryData.description}</h3>
        </div>
    )
}