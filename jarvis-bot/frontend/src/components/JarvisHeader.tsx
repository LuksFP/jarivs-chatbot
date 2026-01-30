import type { JarvisState } from '@/types/jarvis';
import { Activity } from 'lucide-react';

interface JarvisHeaderProps {
  state: JarvisState;
  isBackendOnline: boolean;
}

const statusText: Record<JarvisState, string> = {
  idle: 'SISTEMA OPERACIONAL',
  initializing: 'INICIALIZANDO SISTEMAS...',
  listening: 'MODO DE ESCUTA ATIVO',
  processing: 'PROCESSANDO DADOS...',
  speaking: 'TRANSMITINDO RESPOSTA',
  error: 'ERRO DO SISTEMA',
};

export default function JarvisHeader({ state, isBackendOnline }: JarvisHeaderProps) {
  return (
    <div className="glass-effect border-glow p-8 rounded-3xl shadow-2xl">
      <div className="flex items-center justify-between">
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full animate-pulse" />
            <h1 className="relative text-5xl font-orbitron font-black glow-text tracking-[0.3em] text-cyan-400">
              J.A.R.V.I.S
            </h1>
          </div>
          <div className="h-12 w-0.5 bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
          <p className="text-gray-400 font-rajdhani text-sm uppercase tracking-widest">
            Just A Rather Very Intelligent System
          </p>
        </div>
        
        <div className="flex items-center gap-8">
          
          <div className="flex items-center gap-3 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-700/50">
            <div className={isBackendOnline ? 'w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/50' : 'w-2.5 h-2.5 rounded-full bg-red-500'} />
            <span className="text-xs text-gray-300 uppercase tracking-wider font-rajdhani font-semibold">
              {isBackendOnline ? 'API CONECTADA' : 'API OFFLINE'}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Activity className={'w-5 h-5 ' + (state === 'processing' || state === 'listening' ? 'text-cyan-400 animate-pulse' : 'text-gray-500')} />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase font-rajdhani">Status</span>
              <span className={'text-sm font-rajdhani font-bold uppercase tracking-wider ' + (state === 'error' ? 'text-red-400' : state === 'listening' ? 'text-yellow-400' : state === 'processing' ? 'text-orange-400' : state === 'speaking' ? 'text-purple-400' : 'text-cyan-400')}>
                {statusText[state]}
              </span>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  );
}