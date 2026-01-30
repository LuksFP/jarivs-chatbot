import type { JarvisState } from '@/types/jarvis';

interface JarvisOrbProps {
  state: JarvisState;
  isListening: boolean;
}

export default function JarvisOrb({ state, isListening }: JarvisOrbProps) {
  const getAnimationClass = () => {
    if (state === 'listening' || isListening) return 'orb-listening';
    if (state === 'processing') return 'orb-processing';
    if (state === 'speaking') return 'orb-speaking';
    return 'orb-pulse';
  };

  const getOrbColor = () => {
    if (state === 'listening' || isListening) return 'from-yellow-400 via-yellow-500 to-yellow-400';
    if (state === 'processing') return 'from-orange-400 via-orange-500 to-orange-400';
    if (state === 'speaking') return 'from-purple-400 via-purple-500 to-purple-400';
    if (state === 'error') return 'from-red-400 via-red-500 to-red-400';
    return 'from-cyan-400 via-cyan-500 to-cyan-400';
  };

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative w-72 h-72">
        
        {/* Outer Ring 1 */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 ring-rotate" />
        
        {/* Outer Ring 2 */}
        <div className="absolute inset-6 rounded-full border-2 border-cyan-400/30 ring-rotate-reverse" />
        
        {/* Outer Ring 3 */}
        <div className="absolute inset-12 rounded-full border border-cyan-400/40 ring-rotate" />
        
        {/* Core Orb */}
        <div className={'absolute inset-16 rounded-full bg-gradient-to-br shadow-2xl ' + getOrbColor() + ' ' + getAnimationClass()}>
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent" />
          <div className="absolute inset-0 rounded-full backdrop-blur-sm" />
          
          {/* Inner glow */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
        </div>
        
        {/* Particles effect */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 200}ms`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
        
      </div>
    </div>
  );
}