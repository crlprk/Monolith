import Link from 'next/link';

export default function Titlecard({ title, summary, filename }) {
    return (
        <Link href="/app/Entry">
            <h3>
                {title}
            </h3>
            <h4>
                {summary}
            </h4>
        </Link>
    )
}