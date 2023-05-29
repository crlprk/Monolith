'use client';

import { useState } from "react";
import OrderHierarchy from "./OrderHierarchy";
import OrderChronological from "./OrderChronological";


export default function Directory() {
    const [orderMode, setOrderMode] = useState(0);

    switch (orderMode) {
        case 1:
            return (
                <div>
                    <button onClick={() => setOrderMode((orderMode + 1) % 2)}>Switch</button>
                    <OrderChronological />
                </div>
            );
    
        default:
            return (
                <div>
                    <button onClick={() => setOrderMode((orderMode + 1) % 2)}>Switch</button>
                    <OrderHierarchy />
                </div>
            );
    }
}