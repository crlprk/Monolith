'use client'

import { useState } from "react"
import OpenEntryButton from "./OpenEntryButton";
import ConnectedEntries from "./ConnectedEntries";
import PropertiesContainer from "./PropertiesContainer";

export default function EntryContainer() {
    const [displayMode, setDisplayMode] = useState('preview');

    switch (displayMode) {
        case 'preview':
            return (
                <div>
                    <div>
                        <OpenEntryButton />
                        <ConnectedEntries />
                    </div>
                    <PropertiesContainer />
                </div>
            );
    
        default:
            return (
                <p>An error has occurred</p>
            );
    }
    
}