import { Send, Mic, MicOff, Loader2, X, Shield, ShieldOff } from 'lucide-react';
import type { JarvisState } from '@/types/jarvis';

interface JarvisInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isVoiceMode: boolean;
  onToggleVoice: () => void;
  state: JarvisState;
  onSendVoice?: () => void;
  onCancelVoice?: () => void;
  wakeWordEnabled?: boolean;
  onToggleWakeWord?: () => void;
  hasTranscript?: boolean;
}

export default function JarvisInput({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress, 
  isVoiceMode, 
  onToggleVoice, 
  state, 
  onSendVoice,
  onCancelVoice,
  wakeWordEnabled = true,
  onToggleWakeWord,
  hasTranscript = false
}: JarvisInputProps) {
  const isDisabled = state === 'processing' || state === 'speaking';
  const isListening = state === 'listening';
  
  return (
    <div className="glass-effect border-glow rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center gap-4">
        
        <div className="flex-1 relative group">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder={isVoiceMode ? 'ðŸŽ¤ Modo de voz ativado...' : 'ðŸ’¬ Digite sua mensagem...'}
            disabled={isDisabled || isVoiceMode}
            className="w-full bg-gray-900/70 border-2 border-gray-700/50 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 transition-all duration-300 font-rajdhani text-base disabled:opacity-50 group-hover:border-gray-600"
          />
          {state === 'processing' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 animate-pulse" />
            </div>
          )}
        </div>
        
        <button 
          onClick={onSend} 
          disabled={isDisabled || !value.trim() || isVoiceMode} 
          className="bg-gradient-to-br from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white p-4 rounded-2xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-cyan-400/30 hover:shadow-xl hover:shadow-cyan-400/40 hover:scale-105 active:scale-95"
          title="Enviar mensagem de texto"
        >
          {state === 'processing' ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}
        </button>
        
        {isVoiceMode && isListening && hasTranscript && (
          <>
            {onSendVoice && (
              <button 
                onClick={onSendVoice}
                disabled={isDisabled}
                className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white p-4 rounded-2xl transition-all duration-300 shadow-lg shadow-green-400/30 hover:shadow-xl hover:shadow-green-400/40 hover:scale-105 active:scale-95 animate-pulse"
                title="Enviar mensagem de voz"
              >
                <Send size={22} />
              </button>
            )}
            
            {onCancelVoice && (
              <button 
                onClick={onCancelVoice}
                disabled={isDisabled}
                className="bg-gradient-to-br from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white p-4 rounded-2xl transition-all duration-300 shadow-lg shadow-red-400/30 hover:shadow-xl hover:shadow-red-400/40 hover:scale-105 active:scale-95"
                title="Cancelar gravaÃ§Ã£o"
              >
                <X size={22} />
              </button>
            )}
          </>
        )}
        
        {onToggleWakeWord && isVoiceMode && (
          <button 
            onClick={onToggleWakeWord}
            disabled={isDisabled}
            className={
              wakeWordEnabled
                ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-2xl shadow-xl shadow-purple-400/50 border-2 border-purple-300 transition-all duration-300 hover:scale-105 active:scale-95'
                : 'bg-gray-800/70 border-2 border-gray-700/50 text-gray-400 hover:text-purple-400 hover:border-purple-400/50 p-4 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95'
            }
            title={wakeWordEnabled ? 'Wake Word: ATIVADA (clique para desativar)' : 'Wake Word: DESATIVADA (clique para ativar)'}
          >
            {wakeWordEnabled ? <Shield size={22} /> : <ShieldOff size={22} />}
          </button>
        )}
        
        <button 
          onClick={onToggleVoice} 
          disabled={isDisabled} 
          className={
            isVoiceMode 
              ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-2xl shadow-xl shadow-yellow-400/50 border-2 border-yellow-300 transition-all duration-300 hover:scale-105 active:scale-95 ' + (isListening ? 'animate-pulse' : ')
              : 'bg-gray-800/70 border-2 border-gray-700/50 text-gray-400 hover:text-cyan-400 hover:border-cyan-400/50 p-4 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-30'
          }
          title={isVoiceMode ? 'Desativar modo de voz' : 'Ativar modo de voz'}
        >
          {isVoiceMode ? <Mic size={22} /> : <MicOff size={22} />}
        </button>
        
      </div>
      
      {isVoiceMode && (
        <div className="mt-5 p-4 bg-gradient-to-r from-yellow-500/10 via-yellow-400/10 to-yellow-500/10 border border-yellow-400/30 rounded-2xl backdrop-blur-sm animate-fade-in">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/30 blur-md rounded-full animate-pulse" />
                <Mic className="relative w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-yellow-400 text-sm font-rajdhani font-bold uppercase tracking-wider">
                {isListening ? 'ðŸŽ¤ Gravando... Fale agora!' : 'â¸ï¸ Aguardando...'}
              </p>
            </div>
            
            {isListening && hasTranscript && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-green-300 font-rajdhani">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>BotÃ£o VERDE para enviar</span>
                </div>
                <div className="h-4 w-px bg-yellow-400/30" />
                <div className="flex items-center gap-2 text-xs text-red-300 font-rajdhani">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span>BotÃ£o VERMELHO para cancelar</span>
                </div>
              </div>
            )}
          </div>
          
          {wakeWordEnabled && (
            <div className="mt-3 flex items-center gap-2 text-xs text-purple-300 font-rajdhani">
              <Shield className="w-3 h-3" />
              <span>Wake Word ativada - Diga "JARVIS" na primeira mensagem</span>
            </div>
          )}
          
          {!wakeWordEnabled && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 font-rajdhani">
              <ShieldOff className="w-3 h-3" />
              <span>Wake Word desativada - Pode falar direto!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}