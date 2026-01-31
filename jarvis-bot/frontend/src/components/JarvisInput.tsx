import { Send, Mic, MicOff, Check, X } from 'lucide-react';
import type { JarvisState } from '@/types/jarvis';

interface JarvisInputProps { value: string; onChange: (value: string) => void; onSend: () => void; onKeyPress: (e: React.KeyboardEvent) => void; isVoiceMode: boolean; onToggleVoice: () => void; state: JarvisState; onSendVoice?: () => void; onCancelVoice?: () => void; wakeWordEnabled?: boolean; onToggleWakeWord?: () => void; hasTranscript?: boolean; }

export default function JarvisInput({ value, onChange, onSend, onKeyPress, isVoiceMode, onToggleVoice, state, onSendVoice, onCancelVoice, hasTranscript = false }: JarvisInputProps) {
  const isDisabled = state === 'processing' || state === 'speaking';

  return (
    <div className="glass-effect border-glow p-6 rounded-2xl">
      {(state === 'processing' || state === 'speaking') && (<div className="h-1 bg-jarvis-dark rounded-full overflow-hidden mb-4"><div className="h-full bg-gradient-to-r from-jarvis-primary to-jarvis-accent animate-pulse" style={{ width: state === 'speaking' ? '100%' : '60%' }} /></div>)}
      <div className="flex gap-3 items-center">
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onKeyPress={onKeyPress} disabled={isDisabled || isVoiceMode} placeholder={isVoiceMode ? 'Modo de voz ativo - fale!' : 'Digite sua mensagem...'} className="flex-1 bg-[#0a0e27] border border-cyan-500/30 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed font-rajdhani text-lg transition-all" style={{ color: '#ffffff', caretColor: '#00ffff' }} />
        {!isVoiceMode && (<button onClick={onSend} disabled={isDisabled || !value.trim()} className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-[0_0_15px_rgba(0,255,255,0.4)]" title="Enviar mensagem"><Send className="w-6 h-6 text-[#0a0e27]" /></button>)}
        {isVoiceMode && onSendVoice && (<button onClick={onSendVoice} disabled={!hasTranscript} className={`p-4 rounded-xl transition-all ${hasTranscript ? 'bg-green-500 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(0,255,0,0.4)]' : 'bg-gray-600 opacity-50 cursor-not-allowed'}`} title="Enviar mensagem de voz"><Check className="w-6 h-6 text-white" /></button>)}
        {isVoiceMode && onCancelVoice && (<button onClick={onCancelVoice} disabled={!hasTranscript} className={`p-4 rounded-xl transition-all ${hasTranscript ? 'bg-red-500 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,0,0,0.4)]' : 'bg-gray-600 opacity-50 cursor-not-allowed'}`} title="Limpar transcricao"><X className="w-6 h-6 text-white" /></button>)}
        <button onClick={onToggleVoice} disabled={isDisabled} className={`p-4 rounded-xl transition-all border-2 ${isVoiceMode ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]' : 'bg-[#1a1f3a] border-gray-600'} hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`} title={isVoiceMode ? 'Desativar modo voz' : 'Ativar modo voz'}>{isVoiceMode ? (<Mic className="w-6 h-6 text-cyan-400" />) : (<MicOff className="w-6 h-6 text-gray-400" />)}</button>
      </div>
    </div>
  );
}
