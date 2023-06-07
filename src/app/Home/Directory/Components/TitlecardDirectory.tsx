interface TitlecardDirectoryProps {
    dirName: string;
    dirPath: string;
    onClick?: any;
}

export default function TitlecardDirectory({ dirName, dirPath, onClick }: TitlecardDirectoryProps) {
    return (
        <button onClick={() => onClick(dirPath)}>
            <p>{dirName}</p>
        </button>
    );
}
