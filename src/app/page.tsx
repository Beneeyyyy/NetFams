'use client';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="absolute w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000 bottom-[-200px] right-[-200px]" />
      </div>

      {/* Left Side - Centered Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative h-1/2 lg:h-screen animate-fadeInLeft bg-black">
        <div className="relative z-10 px-6 lg:px-12 max-w-xl mx-auto">
          <div className="mb-8 animate-fadeInUp">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse delay-75" />
              <div className="w-3 h-3 rounded-full bg-purple-400 animate-pulse delay-150" />
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-none mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-300 to-purple-200 tracking-tight" 
                style={{ fontFamily: 'Slackey, cursive' }}>
              NetFams
            </h1>
            
            <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full mb-4" />
            
            <h2 className="text-xl lg:text-2xl text-white/90 font-light mb-4 leading-relaxed" 
                style={{ fontFamily: 'Inter, sans-serif' }}>
              Create your Quality Time 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300"> Together</span>
            </h2>
            
            <p className="text-sm lg:text-base text-white/60 leading-relaxed max-w-lg font-light">
              Transform your network management experience into a seamless family journey. 
              We bring the comfort of home to your digital infrastructure.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex space-x-3 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <button className="group px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/20 text-sm">
              <span className="flex items-center space-x-2">
                Get Started
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            <button className="px-6 py-2.5 bg-white/5 text-white rounded-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/10 hover:border-white/20 text-sm">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Centered Content */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center relative h-1/2 lg:h-screen bg-gradient-to-br from-purple-900/30 to-black/80 backdrop-blur-sm animate-fadeInRight">
        <div className="w-full max-w-xl px-6 lg:px-12">
          <h2 className="text-2xl lg:text-3xl font-light text-white/90 text-center mb-6 animate-fadeInUp"
              style={{ fontFamily: 'Inter, sans-serif', animationDelay: '400ms' }}>
            Main Features
          </h2>

          {/* Features Grid - More Compact */}
          <div className="grid grid-cols-2 gap-3 w-full relative z-10">
            {[
              {
                title: "Family Control",
                description: "Manage network access for family.",
                icon: "👨‍👩‍👧‍👦",
                delay: "600ms"
              },
              {
                title: "Safe Browsing",
                description: "Advanced content filtering.",
                icon: "🛡️",
                delay: "800ms"
              },
              {
                title: "Time Management",
                description: "Smart screen time limits.",
                icon: "⏰",
                delay: "1000ms"
              },
              {
                title: "Usage Analytics",
                description: "Network usage insights.",
                icon: "📊",
                delay: "1200ms"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative animate-fadeInUp"
                style={{ animationDelay: feature.delay }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-xl -z-10" />
                <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10 group-hover:border-white/20 hover:-translate-y-1">
                  <div className="text-2xl mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-medium text-white/90 mb-1">{feature.title}</h3>
                  <p className="text-xs text-white/60 font-light">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Family Illustration - Adjusted Size */}
          <div className="mt-6 w-full max-w-[120px] mx-auto relative group animate-fadeInUp" style={{ animationDelay: '1400ms' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-500" />
            <Image
              src="/family.svg"
              alt="Family Illustration"
              width={120}
              height={120}
              className="w-full h-auto relative z-10 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      {/* Fonts & Animations */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Slackey&family=Inter:wght@300;400;500;600&display=swap');
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }

        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}