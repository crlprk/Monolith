'use client'

import { useEffect, useState } from "react"
import EntryPreview from "./EntryPreview";
import EntryEditing from "./EntryEditing";


export default function EntryContainer() {
    const [displayMode, setDisplayMode] = useState("");

    function onEnterClick() {
        console.log("Entering edit mode of entry");
        setDisplayMode('editing');
    }

    function onExitClick() {
        console.log("Exiting edit mode of entry");
        setDisplayMode('preview');
    }

    useEffect(() => {
        const storedDisplayMode = window.sessionStorage.getItem("displayMode");
        const parsedDisplayMode = storedDisplayMode ? storedDisplayMode : "preview";
        setDisplayMode(parsedDisplayMode);
        console.log("retreiving: " + parsedDisplayMode);
    }, []);

    switch (displayMode) {
        case 'preview':
            window.sessionStorage.setItem("displayMode", "preview");
            return (
                <EntryPreview onEnterClick={onEnterClick} />
            );
        case 'editing':
            window.sessionStorage.setItem("displayMode", "editing");
            return (
                <EntryEditing onExitClick={onExitClick} />
            );
        default:
            return (
                <p>An error has occurred</p>
            );
    }

}