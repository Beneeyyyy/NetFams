'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row">
      {/* Left Side - Black */}
      <div className="w-full lg:w-1/2 bg-black p-8 lg:p-16 flex flex-col justify-center relative overflow-hidden h-1/2 lg:h-screen">
        {/* Decorative Elements - Dibuat lebih subtle */}
        <div className="absolute top-10 left-10 w-20 lg:w-28 h-20 lg:h-28 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-28 lg:w-40 h-28 lg:h-40 bg-purple-500/5 rounded-full blur-2xl animate-pulse" />

        <div className="max-w-xl z-10">
          <h1 className="text-5xl lg:text-7xl font-bold leading-none mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300" 
              style={{ fontFamily: 'Slackey, cursive' }}>
            NetFams
          </h1>
          
          <h2 className="text-xl lg:text-2xl text-white mb-4" 
              style={{ fontFamily: 'Slackey, cursive' }}>
            Create your Quality Time Together
          </h2>
          
          <p className="text-sm lg:text-base text-white/80 leading-relaxed max-w-lg">
            Transform your network management experience into a seamless family journey. 
            We bring the comfort of home to your digital infrastructure.
          </p>
        </div>
      </div>

      {/* Right Side - Purple */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 p-8 lg:p-16 flex flex-col justify-between items-center relative h-1/2 lg:h-screen overflow-y-auto">
        {/* Animated background circles - Dibuat lebih subtle */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        {/* Main Features Title */}
        <div className="relative mb-8">
          <h2 className="text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-100 text-center mb-2"
              style={{ fontFamily: 'Slackey, cursive' }}>
            Main Features
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-300 to-white mx-auto rounded-full" />
        </div>

        {/* Features Grid - Made more compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 w-full max-w-3xl relative z-10">
          {/* Feature 1 */}
          <div className="group bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-white/10">
            <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-all duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-purple-200">Family Control</h3>
            <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">Manage network access and usage for every family member with intuitive controls.</p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-white/10">
            <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-all duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-purple-200">Safe Browsing</h3>
            <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">Advanced content filtering to ensure a safe online environment for your family.</p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-white/10">
            <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-all duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-purple-200">Time Management</h3>
            <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">Set smart screen time limits and create healthy digital habits.</p>
          </div>

          {/* Feature 4 */}
          <div className="group bg-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-white/10">
            <div className="bg-purple-500/20 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-all duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 group-hover:text-purple-200">Usage Analytics</h3>
            <p className="text-white/70 group-hover:text-white/90 transition-colors duration-300">Detailed insights into network usage patterns and trends.</p>
          </div>
        </div>

        {/* Buttons - Made more compact */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 my-6">
          <button className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-bold text-sm">
            Let's Get Started
          </button>
          <button className="px-6 py-3 bg-purple-900/50 text-white rounded-lg hover:bg-purple-900/70 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 backdrop-blur-sm font-bold border border-white/10 text-sm">
            About
          </button>
        </div>

        {/* Family Illustration - Made smaller */}
        <div className="flex justify-center w-full max-w-xs mt-4">
          <Image
            src="/family.svg"
            alt="Family Illustration"
            width={300}
            height={300}
            className="object-contain transition-transform duration-500 hover:scale-105 w-full h-auto"
          />
        </div>
      </div>

      {/* Font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Slackey&display=swap');
      `}</style>
    </div>
  );
}