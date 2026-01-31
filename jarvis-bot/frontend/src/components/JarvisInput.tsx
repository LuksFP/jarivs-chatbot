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
          className="flex-1 bg-[#0a0e27] border border-cyan-500/30 rounded-xl px-6 py-4 
                     text-white placeholder-gray-400
                     focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,255,255,0.3)]
                     disabled:opacity-50 disabled:cursor-not-allowed
                     font-rajdhani text-lg transition-all"
          style={{ color: '#ffffff', caretColor: '#00ffff' }}
        />
        
        {/* Botao Enviar Texto - sempre visivel quando NAO esta no modo voz */}
        {!isVoiceMode && (
          <button
            onClick={onSend}
            disabled={isDisabled || !value.trim()}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 p-4 rounded-xl
                       hover:scale-105 active:scale-95 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                       shadow-[0_0_15px_rgba(0,255,255,0.4)]"
          >
            <Send className="w-6 h-6 text-[#0a0e27]" />
          </button>
        )}
        
        {/* Botao Enviar Audio - aparece quando tem transcricao no modo voz */}
        {isVoiceMode && hasTranscript && onSendVoice && (
          <button
            onClick={onSendVoice}
            className="bg-green-500 p-4 rounded-xl hover:scale-105 active:scale-95 transition-all
                       shadow-[0_0_15px_rgba(0,255,0,0.4)]"
            title="Enviar mensagem de voz"
          >
            <Check className="w-6 h-6 text-white" />
          </button>
        )}
        
        {/* Botao Cancelar Audio */}
        {isVoiceMode && hasTranscript && onCancelVoice && (
          <button
            onClick={onCancelVoice}
            className="bg-red-500 p-4 rounded-xl hover:scale-105 active:scale-95 transition-all
                       shadow-[0_0_15px_rgba(255,0,0,0.4)]"
            title="Cancelar mensagem de voz"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}
        
        {/* Botao Wake Word - so aparece no modo voz */}
        {isVoiceMode && onToggleWakeWord && (
          <button
            onClick={onToggleWakeWord}
            className={`p-4 rounded-xl transition-all border-2
                       ${wakeWordEnabled 
                         ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                         : 'bg-gray-700/50 border-gray-500'
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
        
        {/* Botao Ativar/Desativar Modo Voz */}
        <button
          onClick={onToggleVoice}
          disabled={isDisabled}
          className={`p-4 rounded-xl transition-all border-2
                     ${isVoiceMode 
                       ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]' 
                       : 'bg-[#1a1f3a] border-gray-600'
                     }
                     hover:scale-105 active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          title={isVoiceMode ? 'Desativar modo voz' : 'Ativar modo voz'}
        >
          {isVoiceMode ? (
            <Mic className="w-6 h-6 text-cyan-400" />
          ) : (
            <MicOff className="w-6 h-6 text-gray-400" />
          )}
        </button>
        
      </div>
      
      {/* Indicadores de Status do Modo Voz */}
      {isVoiceMode && (
        <div className="text-center text-sm mt-3 font-rajdhani space-y-1">
          <p className="text-cyan-400 font-semibold animate-pulse">
            {wakeWordEnabled ? '🎤 Diga "JARVIS" para ativar' : '🎤 Modo livre - fale diretamente'}
          </p>
          {hasTranscript && (
            <p className="text-green-400 font-bold">
              ✅ Mensagem pronta - clique no ✓ verde para enviar
            </p>
          )}
        </div>
      )}
      
    </div>
  );
}