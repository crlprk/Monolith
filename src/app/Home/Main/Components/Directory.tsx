'use client';

import { useContext, useState } from "react";
import { ConfigContext } from "./ConfigProvider";
import { ConfigType } from "@/util/ConfigType";
import OrderHierarchy from "./OrderHierarchy";
import OrderChronological from "./OrderChronological";


export default function Directory() {
    const config = useContext(ConfigContext) as unknown as ConfigType;

    const [orderMode, setOrderMode] = useState(0);
    const [escapeDir, setEscapeDirectory] = useState(config.files.home_directory);
    const [currentDir, setCurrentDir] = useState(config.files.home_directory);

    function onDirectoryClick(newDir: string) {
        console.log('Changing current directory to ', newDir);
        setCurrentDir(newDir);
        if (newDir != config.files.home_directory) {
            const t = newDir.slice(0, newDir.lastIndexOf("\\"));
            console.log("Setting escape directory to", t);
            setEscapeDirectory(t);
        }
    }

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
                    <OrderHierarchy currentDir={currentDir} escapeDir={escapeDir} onDirectoryClick={onDirectoryClick} />
                </div>
            );
    }
}