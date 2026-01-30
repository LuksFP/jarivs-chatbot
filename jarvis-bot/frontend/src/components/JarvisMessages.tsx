import type { JarvisState, Message } from '@/types/jarvis';
import { Volume2 } from 'lucide-react';

interface JarvisMessagesProps {
  messages: Message[];
  state: JarvisState;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export default function JarvisMessages({ messages, state, messagesEndRef }: JarvisMessagesProps) {
  return (
    <div className="w-full space-y-6 min-h-[200px]">
      {messages.length === 0 ? (
        <div className="glass-effect border-glow rounded-3xl p-16 text-center">
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-cyan-400/10 rounded-full flex items-center justify-center border border-cyan-400/30">
              <svg className="w-10 h-10 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-400 font-rajdhani text-xl font-light tracking-wide">
              Inicie uma conversa com o <span className="text-cyan-400 font-semibold">J.A.R.V.I.S</span>
            </p>
            <p className="text-gray-500 font-rajdhani text-sm">
              Digite sua mensagem ou ative o modo de voz
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <div key={msg.id} className={'animate-fade-in ' + (msg.role === 'user' ? 'flex justify-end' : 'flex justify-start')}>
              <div className={'max-w-[85%] group ' + (msg.role === 'user' ? 'text-right' : 'text-left')}>
                
                <div className="flex items-center gap-2 mb-2 px-1">
                  <div className={'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ' + (msg.role === 'user' ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/50 ml-auto' : 'bg-purple-500/20 text-purple-400 border border-purple-400/50')}>
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <span className={'text-xs font-rajdhani font-semibold uppercase tracking-wider ' + (msg.role === 'user' ? 'text-cyan-400 order-first' : 'text-purple-400')}>
                    {msg.role === 'user' ? 'Você' : 'J.A.R.V.I.S'}
                  </span>
                </div>
                
                <div className={'rounded-2xl p-5 shadow-2xl transition-all duration-300 ' + (msg.role === 'user' ? 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-400/40 group-hover:border-cyan-400/60 group-hover:shadow-cyan-400/20' : 'bg-gradient-to-br from-gray-800/80 to-gray-900/60 border border-gray-700/50 group-hover:border-purple-400/40 group-hover:shadow-purple-400/20')}>
                  <p className={'font-rajdhani text-base leading-relaxed whitespace-pre-wrap break-words ' + (msg.role === 'user' ? 'text-white' : 'text-gray-100')}>
                    {msg.content}
                  </p>
                </div>
                
                <div className={'flex items-center gap-2 mt-2 px-1 text-xs text-gray-500 font-rajdhani ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <span>{new Date(msg.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
              </div>
            </div>
          ))}
          
          {state === 'processing' && (
            <div className="flex justify-start animate-fade-in mb-8">
              <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-2 border-orange-400/40 p-5 rounded-2xl shadow-lg shadow-orange-400/20">
                <div className="flex gap-3 items-center">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce shadow-lg shadow-orange-400/50" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce shadow-lg shadow-orange-400/50" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 bg-orange-400 rounded-full animate-bounce shadow-lg shadow-orange-400/50" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-orange-400 text-sm font-rajdhani font-bold uppercase tracking-wider">
                    J.A.R.V.I.S está processando sua solicitação
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {state === 'speaking' && (
            <div className="flex justify-start animate-fade-in mb-8">
              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-2 border-purple-400/40 p-5 rounded-2xl shadow-lg shadow-purple-400/20">
                <div className="flex gap-3 items-center">
                  <Volume2 className="w-5 h-5 text-purple-400 animate-pulse" />
                  <span className="text-purple-400 text-sm font-rajdhani font-bold uppercase tracking-wider">
                    Reproduzindo resposta em áudio
                  </span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-purple-400 rounded-full animate-pulse"
                        style={{
                          height: `${12 + Math.random() * 12}px`,
                          animationDelay: `${i * 100}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {state === 'listening' && (
            <div className="flex justify-start animate-fade-in mb-8">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-2 border-yellow-400/40 p-5 rounded-2xl shadow-lg shadow-yellow-400/20">
                <div className="flex gap-3 items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                  <span className="text-yellow-400 text-sm font-rajdhani font-bold uppercase tracking-wider">
                    🎤 Escutando... Fale agora!
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-8" />
        </>
      )}
    </div>
  );
}