interface TitlecardFileProps {
    metadata: any;
}

export default function TitlecardFile({ metadata }: TitlecardFileProps) {
    return (
        <div>
            <p>{metadata.name}</p>
        </div>
    )
}