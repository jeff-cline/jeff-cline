import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        <div className="text-8xl md:text-9xl font-black gradient-text mb-6">404</div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">
          Lost? Even the Best <span className="text-[#FF8900]">Geeks</span> Take a Wrong Turn.
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          This page doesn&apos;t exist—but your next breakthrough does.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary text-lg animate-pulse-glow">
            Back to Home 🐎🔥
          </Link>
          <Link href="/quiz" className="btn-secondary text-lg">
            Take the Quiz
          </Link>
        </div>
        <p className="text-gray-600 text-sm mt-12">
          FIREHORSE #GIDDYUP — every wrong turn is just a faster route to disruption.
        </p>
      </div>
    </section>
  );
}
