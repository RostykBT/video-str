import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="text-center sm:text-left">
          <h1 className="text-4xl font-bold mb-4">LiveKit Video Streaming</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Choose how you want to interact with the video room
          </p>
        </div>

        <div className="flex gap-6 items-center flex-col sm:flex-row flex-wrap justify-center">
          <Link
            href="/room"
            className="rounded-lg border-2 border-blue-500 bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center justify-center gap-3 text-lg font-semibold h-16 px-8 min-w-48"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Join Room
          </Link>

          <Link
            href="/stream"
            className="rounded-lg border-2 border-red-500 bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center gap-3 text-lg font-semibold h-16 px-8 min-w-48"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Start Streaming
          </Link>

          <Link
            href="/cast"
            className="rounded-lg border-2 border-purple-500 bg-purple-500 hover:bg-purple-600 text-white transition-colors flex items-center justify-center gap-3 text-lg font-semibold h-16 px-8 min-w-48"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Screen Cast
          </Link>

          <Link
            href="/grid"
            className="rounded-lg border-2 border-green-500 bg-green-500 hover:bg-green-600 text-white transition-colors flex items-center justify-center gap-3 text-lg font-semibold h-16 px-8 min-w-48"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Grid View
          </Link>
        </div>

        <div className="text-center sm:text-left mt-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 max-w-2xl">
            <h2 className="text-xl font-semibold mb-3">How to use:</h2>
            <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Join Room:</strong> View and participate in the video conference with others</li>
              <li><strong>Start Streaming:</strong> Stream your webcam directly to the room with enhanced controls</li>
              <li><strong>Screen Cast:</strong> Share your screen with minimal, clean interface using modern components</li>
              <li><strong>Grid View:</strong> Monitor all video streams in a fixed 3×3 grid layout for overview</li>
            </ul>
          </div>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
