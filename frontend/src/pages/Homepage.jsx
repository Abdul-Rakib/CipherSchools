// Homepage.jsx
import { Link } from 'react-router-dom'
import { FiCode, FiZap, FiEye, FiArrowRight } from 'react-icons/fi'
import Footer from './footer/footer'

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-900 to-black text-white">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm backdrop-blur-sm">
                  <FiZap size={16} />
                  <span>Cloud-Based React IDE</span>
                </div>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Build React Apps
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    In Your Browser
                  </span>
                </h1>

                <p className="text-xl text-gray-300 leading-relaxed">
                  A professional, browser-based IDE for React development.
                  Write code, see instant previews, and build amazing apps—all without any setup.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    to="/dashboard"
                    className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
                  >
                    Start Coding Now
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="#features"
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300"
                  >
                    Learn More
                  </a>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      0s
                    </div>
                    <div className="text-sm text-gray-400">Setup Time</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Live
                    </div>
                    <div className="text-sm text-gray-400">Preview</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                      Free
                    </div>
                    <div className="text-sm text-gray-400">To Use</div>
                  </div>
                </div>
              </div>

              {/* Right Content - Code Editor Preview */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                  {/* Window Controls */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="flex-1 text-center text-xs text-gray-400">
                      App.jsx
                    </div>
                  </div>

                  {/* Code Preview */}
                  <div className="p-6 font-mono text-sm">
                    <div className="space-y-2">
                      <div className="text-purple-400">import</div>
                      <div className="text-gray-300 pl-4">
                        <span className="text-blue-400">React</span> from{' '}
                        <span className="text-green-400">'react'</span>;
                      </div>
                      <div className="pt-2"></div>
                      <div className="text-purple-400">function</div>
                      <div className="text-yellow-300 pl-4">App() {'{'}</div>
                      <div className="text-purple-400 pl-8">return</div>
                      <div className="text-gray-300 pl-12">
                        {'<'}
                        <span className="text-pink-400">div</span>
                        {'>'}
                      </div>
                      <div className="text-gray-300 pl-16">
                        {'<'}
                        <span className="text-pink-400">h1</span>
                        {'>'}
                        Hello React IDE!
                        {'</'}
                        <span className="text-pink-400">h1</span>
                        {'>'}
                      </div>
                      <div className="text-gray-300 pl-12">
                        {'</'}
                        <span className="text-pink-400">div</span>
                        {'>'}
                      </div>
                      <div className="text-yellow-300 pl-4">{'}'}</div>
                      <div className="pt-2"></div>
                      <div className="text-purple-400">export default</div>
                      <div className="text-blue-400 pl-4">App;</div>
                    </div>
                  </div>

                  {/* Animated Cursor */}
                  <div className="absolute bottom-20 right-12 w-0.5 h-5 bg-white animate-pulse"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-purple-500 p-4 rounded-xl shadow-lg animate-bounce">
                  <FiCode size={24} />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-xl shadow-lg animate-pulse">
                  <FiEye size={24} />
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Stats Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  10K+
                </div>
                <div className="text-gray-400">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  5K+
                </div>
                <div className="text-gray-400">Active Developers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
                  1M+
                </div>
                <div className="text-gray-400">Lines of Code</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  100K+
                </div>
                <div className="text-gray-400">Hours Saved</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl rounded-3xl p-12 border border-blue-500/20 shadow-2xl">
              <h2 className="text-4xl font-bold mb-4 text-white">
                Ready to Start Coding?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join thousands of developers building amazing React apps in the browser.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold backdrop-blur-sm transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}