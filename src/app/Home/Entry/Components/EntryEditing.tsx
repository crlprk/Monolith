'use client'

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import { useContext, useState, createElement, Fragment, useEffect, ExoticComponent, ReactElement, ReactNode } from "react";
import { EntryContext } from "./EntryProvider";
import EntryHeader from "./EntryHeader";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeReact from "rehype-react/lib";
import ExitEntryButton from "./ExitEntryButton";

export default function EntryEditing({onExitClick}: any) {
    const { entryData, filePath, setEntryData } = useContext(EntryContext);
    const [editMode, setEditMode] = useState(0);
    const [currentTitle, setCurrentTitle] = useState(entryData.title);
    const [currentDescription, setCurrentDescription] = useState(entryData.description);
    const [currentMarkdown, setCurrentMarkdown] = useState(entryData.markdown);
    const [parsedMarkdown, setParsedMarkdown] = useState<any>(Fragment);

    function mainKeyDownHandler(e: React.KeyboardEvent<HTMLDivElement>) {
        if (e.ctrlKey && e.code === "Tab") {
            setEditMode((editMode + 1) % 2);
        }
    }

    useEffect(() => {
        unified()
                .use(remarkParse)
                .use(remarkGfm)
                .use(remarkMath)
                .use(remarkBreaks)
                .use(remarkRehype)
                .use(rehypeKatex)
                .use(rehypeSanitize)
                .use(rehypeReact, {createElement, Fragment})
                .process(currentMarkdown)
                .then((file) => {
                    setParsedMarkdown(file.result);
                })
    }, [editMode])

    useEffect(() => {
        let tempData = entryData;
            tempData.title = currentTitle;
            tempData.description = currentDescription;
            setEntryData(tempData);
    }, [currentTitle, currentDescription])

    switch (editMode) {
        case 0:      
            if (!parsedMarkdown) {
                return (
                    <div>Loading</div>
                )
            }
            return (
                <div tabIndex={0} onKeyDown={mainKeyDownHandler}>
                    <EntryHeader />
                    <div>
                        <div>{parsedMarkdown}</div>
                        <div>canvas will be here</div>
                    </div>
                    <ExitEntryButton onClick={onExitClick}/>
                </div>
            );
        case 1:
            return (
                <div tabIndex={0} onKeyDown={mainKeyDownHandler}>
                    <label htmlFor="title"></label>
                    <input type="text" name="title" id="title" value={currentTitle} onChange={e => setCurrentTitle(e.target.value)}/>
                    <label htmlFor="description"></label>
                    <input type="text" name="description" id="description" value={currentDescription} onChange={e => setCurrentDescription(e.target.value)} />
                    <label htmlFor="content"></label>
                    <textarea name="markdown" id="content" cols={30} rows={10} value={currentMarkdown} onChange={e => setCurrentMarkdown(e.target.value)} autoComplete="off"></textarea>
                    <ExitEntryButton onClick={onExitClick}/>
                </div>
            );
        default:
            return (
                <p>An error has occurred</p>
            );
    }
}