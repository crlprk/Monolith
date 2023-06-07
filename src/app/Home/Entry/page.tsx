export default function Page({ searchParams }: { searchParams: { path: string } }) {
    return (
        <div>{searchParams.path}</div>
    )
}