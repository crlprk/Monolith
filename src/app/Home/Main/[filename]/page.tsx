export default function Page({ params }: { params: { filename: string } }) {
    return (
        <div>
            <p>{params.filename}</p>
        </div>
    )
}