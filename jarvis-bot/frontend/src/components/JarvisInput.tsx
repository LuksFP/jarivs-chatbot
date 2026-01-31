import { Send, Mic, MicOff, Check, X, Shield, ShieldOff } from 'lucide-react';
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
  hasTranscript = false,
}: JarvisInputProps) {
  const isDisabled = state === 'processing' || state === 'speaking';

  return (
    <div className="glass-effect border-glow p-6 rounded-2xl">
      
      {(state === 'processing' || state === 'speaking') && (
        <div className="h-1 bg-jarvis-dark rounded-full overflow-hidden mb-4">
          <div className="h-full bg-gradient-to-r from-jarvis-primary to-jarvis-accent animate-pulse" 
               style={{ width: state === 'speaking' ? '100%' : '60%' }} />
        </div>
      )}
      
      <div className="flex gap-3 items-center">
        
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={onKeyPress}
          disabled={isDisabled || isVoiceMode}
          placeholder={isVoiceMode ? 'Modo de voz ativo...' : 'Digite sua mensagem...'}
          className="flex-1 bg-jarvis-dark/50 border border-jarvis-primary/30 rounded-xl px-6 py-4 
                     text-white placeholder-gray-500
                     focus:outline-none focus:border-jarvis-primary focus:glow-cyan
                     disabled:opacity-50 disabled:cursor-not-allowed
                     font-rajdhani text-lg transition-all"
        />
        
        {!isVoiceMode && (
          <button
            onClick={onSend}
            disabled={isDisabled || !value.trim()}
            className="bg-gradient-to-r from-jarvis-primary to-jarvis-accent p-4 rounded-xl
                       hover:scale-105 active:scale-95 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       glow-cyan"
          >
            <Send className="w-6 h-6 text-jarvis-dark" />
          </button>
        )}
        
        {isVoiceMode && hasTranscript && onSendVoice && (
          <button
            onClick={onSendVoice}
            className="bg-green-500 p-4 rounded-xl hover:scale-105 active:scale-95 transition-all glow-cyan"
            title="Enviar mensagem de voz"
          >
            <Check className="w-6 h-6 text-white" />
          </button>
        )}
        
        {isVoiceMode && hasTranscript && onCancelVoice && (
          <button
            onClick={onCancelVoice}
            className="bg-red-500 p-4 rounded-xl hover:scale-105 active:scale-95 transition-all"
            title="Cancelar mensagem de voz"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}
        
        {isVoiceMode && onToggleWakeWord && (
          <button
            onClick={onToggleWakeWord}
            className={`p-4 rounded-xl transition-all border-2
                       ${wakeWordEnabled 
                         ? 'bg-blue-500/20 border-blue-500' 
                         : 'bg-gray-500/20 border-gray-500'
                       }
                       hover:scale-105 active:scale-95`}
            title={wakeWordEnabled ? 'Wake word ativada' : 'Wake word desativada'}
          >
            {wakeWordEnabled ? (
              <Shield className="w-6 h-6 text-blue-400" />
            ) : (
              <ShieldOff className="w-6 h-6 text-gray-400" />
            )}
          </button>
        )}
        
        <button
          onClick={onToggleVoice}
          disabled={isDisabled}
          className={`p-4 rounded-xl transition-all border-2
                     ${isVoiceMode 
                       ? 'bg-jarvis-primary/20 border-jarvis-primary glow-cyan' 
                       : 'bg-jarvis-dark/50 border-jarvis-primary/30'
                     }
                     hover:scale-105 active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          title={isVoiceMode ? 'Desativar modo voz' : 'Ativar modo voz'}
        >
          {isVoiceMode ? (
            <Mic className="w-6 h-6 text-jarvis-primary" />
          ) : (
            <MicOff className="w-6 h-6 text-gray-400" />
          )}
        </button>
        
      </div>
      
      {isVoiceMode && (
        <div className="text-center text-sm mt-3 font-rajdhani space-y-1">
          <p className="text-cyan-400 font-semibold animate-pulse">
            🎤 {wakeWordEnabled ? 'Diga "JARVIS" para ativar' : 'Modo livre - fale diretamente'}
          </p>
          {hasTranscript && (
            <p className="text-green-400 font-bold">
              ✅ Mensagem pronta - clique no ✓ para enviar
            </p>
          )}
        </div>
      )}
      
    </div>
  );
}