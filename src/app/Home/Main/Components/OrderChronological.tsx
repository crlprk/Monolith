'use client';

import { useContext, useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import { ConfigContext } from "./ConfigProvider";
import { ConfigType } from "@/util/ConfigType";

export default function OrderChronological() {
    const config = useContext(ConfigContext) as unknown as ConfigType;
    
    useEffect(() => {
        console.log("Switching organizational mode to chronological");
        invoke('locate_all', { homeDirectory: config.files.home_directory })
            .then((response) => {
                console.log('Located all markdown files');
                console.log(response);
            })
            .catch((error) => {
                console.error('Error reading home directory: ', error);
            });
    }, []);
    

    return <div>Chronological</div>
}