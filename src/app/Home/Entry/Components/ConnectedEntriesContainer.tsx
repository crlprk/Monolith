'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ConnectedEntriesContainer() {
    const [isLoaded, setLoaded] = useState(false);
    
    useEffect(() => {
        const searchParams = useSearchParams();
        const filePath = searchParams.get('path');
        setLoaded(true);
    });

    if (!isLoaded) {
        return <div>Loading</div>
    }
    return <p>success</p>
}