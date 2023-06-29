'use client'

import { useState } from "react"
import EntryPreview from "./EntryPreview";
import EntryEditing from "./EntryEditing";


export default function EntryContainer() {
    const [displayMode, setDisplayMode] = useState('preview');

    function onEnterClick() {
        console.log("Entering edit mode of entry");
        setDisplayMode('editing');
    }

    switch (displayMode) {
        case 'preview':
            return (
                <EntryPreview onEnterClick={onEnterClick} />
            );
        case 'editing':
            return (
                <EntryEditing />
            );
        default:
            return (
                <p>An error has occurred</p>
            );
    }

}