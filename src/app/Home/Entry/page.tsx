import EntryProvider from "./Components/EntryProvider";

export default function Page({ searchParams }: { searchParams: { path: string } }) {
    return (
        <EntryProvider />
    )
}