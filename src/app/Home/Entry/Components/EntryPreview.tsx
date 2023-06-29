'use client'

import OpenEntryButton from "./OpenEntryButton";
import ConnectedEntries from "./ConnectedEntries";
import PropertiesContainer from "./PropertiesContainer";
import EntryHeader from "./EntryHeader";

export default function EntryPreview({onEnterClick}: any) {
    return (
        <div>
            <div>
                <OpenEntryButton onClick={onEnterClick}/>
                <ConnectedEntries />
            </div>
            <div>
                <EntryHeader />
                <PropertiesContainer />
            </div>
        </div>
    )
}