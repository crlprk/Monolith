'use client';

import { invoke } from '@tauri-apps/api';
import { useSearchParams } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import EntryContainer from './EntryContainer';

export const EntryContext = createContext<any>(null);

export default function EntryProvider() {
    const [entryData, setEntryData] = useState<any>(null);
    const searchParams = useSearchParams();
    const filePath = searchParams.get('path');
    
    useEffect(() => {
        invoke('load_file', { path: filePath })
            .then((response) => {
                console.log("Successfully loaded entry");
                setEntryData(response);
            })
            .catch((error) => {
                console.error('Error reading file: ', error);
            });
    }, []);

    if (!entryData) {
        return <div>Loading</div>
    }
    return (
        <EntryContext.Provider value={{entryData, filePath, setEntryData}}>
            <EntryContainer />
        </EntryContext.Provider>
    )
}