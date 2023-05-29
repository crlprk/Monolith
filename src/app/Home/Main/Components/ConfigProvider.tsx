'use client';

import { createContext, useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import Directory from "./Directory";

export const ConfigContext = createContext(null);

export default function ConfigProvider() {
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        invoke('load_config')
            .then((response) => {
                console.log("Successfully read config file");
                setConfig(response);
            })
            .catch((error) => {
                console.error('Error reading config file: ', error);
            });
    }, []);

    if (!config) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <ConfigContext.Provider value={config}>
            <Directory />
        </ConfigContext.Provider>
    )
}