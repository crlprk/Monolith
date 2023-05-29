'use client';

import Link from "next/link"
export default function Home() {
  return (
    <div>
      <Link href={"/Home/Main"}>
        Monolith
      </Link>
    </div>
  )
}

