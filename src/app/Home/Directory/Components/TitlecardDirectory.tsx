interface TitlecardDirectoryProps {
    dirPath: string;
    onClick?: any;
}

export default function TitlecardDirectory({ dirPath, onClick }: TitlecardDirectoryProps) {
    let matches = dirPath.match(/[^\\/]+$/);
    let dirName = ""
    if (matches) { dirName = matches[0] }
    return (
        <button onClick={() => onClick(dirPath)}>
            <p>{dirName}</p>
        </button>
    );   
}
