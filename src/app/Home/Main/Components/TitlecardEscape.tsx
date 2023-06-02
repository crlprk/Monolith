interface TitlecardEscapeProps {
    escapeDir: string;
    onClick?: any;
}

export default function TitlecardEscape({ escapeDir, onClick }: TitlecardEscapeProps) {
    return (
        <button onClick={() => onClick(escapeDir)}>
            <p>Return</p>
        </button>
    );
}