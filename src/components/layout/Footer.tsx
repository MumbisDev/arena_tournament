import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-brutal-black text-brutal-white border-t-4 border-brutal-vermillion">
      {/* Main Footer */}
      <div className="max-w-container mx-auto px-lg py-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
          {/* Brand - Takes up more space */}
          <div className="md:col-span-5 md:border-r-3 md:border-neutral-700 md:pr-xl">
            <Link
              to="/"
              className="flex items-center gap-3 mb-lg group"
            >
              <div className="w-12 h-12 bg-brutal-vermillion border-2 border-brutal-white flex items-center justify-center">
                <span className="font-display text-3xl text-brutal-white">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-3xl text-brutal-white tracking-wider">
                  ARENA
                </span>
                <span className="font-mono text-mono-xs text-brutal-vermillion tracking-[0.3em] -mt-1">
                  TOURNAMENT
                </span>
              </div>
            </Link>
            <p className="font-mono text-mono-sm text-neutral-400 leading-relaxed max-w-sm">
              The premier platform for competitive gaming tournaments. 
              Create, join, and compete at the highest level.
            </p>
            <div className="mt-lg flex items-center gap-4">
              <span className="font-mono text-mono-xs text-neutral-500 uppercase tracking-widest">
                Status:
              </span>
              <span className="flex items-center gap-2 font-mono text-mono-xs text-brutal-white uppercase tracking-widest">
                <span className="w-2 h-2 bg-semantic-success animate-pulse" />
                Operational
              </span>
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-lg">
            {/* Navigation */}
            <div>
              <h3 className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-widest mb-md border-b border-neutral-700 pb-2">
                [01] Navigate
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="font-mono text-mono-sm text-neutral-400 hover:text-brutal-white hover:pl-2 transition-all"
                  >
                    &gt; Discover
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="font-mono text-mono-sm text-neutral-400 hover:text-brutal-white hover:pl-2 transition-all"
                  >
                    &gt; Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/create-tournament"
                    className="font-mono text-mono-sm text-neutral-400 hover:text-brutal-white hover:pl-2 transition-all"
                  >
                    &gt; Host Event
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-widest mb-md border-b border-neutral-700 pb-2">
                [02] Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-mono text-mono-sm text-neutral-400 hover:text-brutal-white hover:pl-2 transition-all"
                  >
                    &gt; Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-mono text-mono-sm text-neutral-400 hover:text-brutal-white hover:pl-2 transition-all"
                  >
                    &gt; Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-mono text-mono-sm text-neutral-400 hover:text-brutal-white hover:pl-2 transition-all"
                  >
                    &gt; Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-widest mb-md border-b border-neutral-700 pb-2">
                [03] Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-mono text-mono-sm text-neutral-400 hover:text-brutal-white hover:pl-2 transition-all"
                  >
                    &gt; Terms
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-mono text-mono-sm text-neutral-400 hover:text-brutal-white hover:pl-2 transition-all"
                  >
                    &gt; Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-mono text-mono-sm text-neutral-400 hover:text-brutal-white hover:pl-2 transition-all"
                  >
                    &gt; Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-3 border-neutral-700">
        <div className="max-w-container mx-auto px-lg py-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-mono-xs text-neutral-500 uppercase tracking-widest">
            © 2025 Arena Platform // All Rights Reserved
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-mono-xs text-neutral-600 uppercase tracking-widest">
              v1.0.0
            </span>
            <span className="font-mono text-mono-xs text-neutral-600">|</span>
            <span className="font-mono text-mono-xs text-neutral-600 uppercase tracking-widest">
              Global
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
