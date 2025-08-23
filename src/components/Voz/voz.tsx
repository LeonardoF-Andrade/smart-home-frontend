import { useEffect, useRef } from "react";

const VoiceRecognitionListener: React.FC = () => {
  const recognitionRef = useRef<InstanceType<
    typeof window.SpeechRecognition | typeof window.webkitSpeechRecognition
  > | null>(null);

  const isSpeakingRef = useRef(false);

  const isProcessingCommandRef = useRef(false);

  const speakMessage = (msg: string) => {
    const utter = new SpeechSynthesisUtterance(msg);
    utter.lang = "pt-BR";

    const restartRecognition = () => {
      isSpeakingRef.current = false;
      isProcessingCommandRef.current = false;
      setTimeout(() => {
        if (recognitionRef.current) {
          console.log("↩️ Reiniciando mic após TTS");
          recognitionRef.current.start();
        }
      }, 200);
    };

    utter.onstart = () => {
      isSpeakingRef.current = true;
    };

    utter.onend = restartRecognition;
    utter.onerror = (e) => {
      console.error("Erro no TTS:", e);
      restartRecognition();
    };

    window.speechSynthesis.speak(utter);
  };

  useEffect(() => {
    const SRClass =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SRClass) {
      console.warn("SpeechRecognition não suportado");
      return;
    }

    const recognition = new SRClass();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "pt-BR";

    recognition.onstart = () => console.log("🟢 Reconhecimento iniciado");
    recognition.onerror = (e: any) => {
      console.error("Erro no reconhecimento:", e.error);
    };
    recognition.onend = () => {
      console.log("🔴 Reconhecimento encerrado");
    };

    recognition.onresult = async (event: any) => {
      isProcessingCommandRef.current = true;
      recognition.stop();

      const fallbackTimeout = setTimeout(() => {
        if (isProcessingCommandRef.current) {
          console.log("⚠️ Fallback: reiniciando reconhecimento");
          isProcessingCommandRef.current = false;
          isSpeakingRef.current = false;
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }
      }, 5000);

      const last = event.results.length - 1;
      let text = event.results[last][0].transcript
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
      console.log("🎤 Capturado:", text);

      const wrappedSpeakMessage = (msg: string) => {
        clearTimeout(fallbackTimeout);
        speakMessage(msg);
      };

      const lightMap: Record<string, string> = {
        quarto: "quarto",
        sala: "sala",
        banheiro: "banheiro",
        cozinha: "cozinha",
        jardim: "jardim",
      };

      if (text === "oi casa") {
        return wrappedSpeakMessage("Oi Léo, como posso ajudar?");
      }

      if (text === "socorro") {
        await fetch(`http://localhost:3000/iluminacao/socorro`, {
          method: "GET",
        });
        return wrappedSpeakMessage("Socorro ativado!");
      }

      const m = text.match(
        /^(acender|ligar|desligar|apagar|abrir|fechar)\s+(.+)$/
      );
      if (!m) return wrappedSpeakMessage("Comando não reconhecido");

      const [, verb, alvo] = m;
      const ligar = /^(acender|ligar|abrir)$/.test(verb);

      if (alvo === "tudo") {
        await fetch(
          `http://localhost:3000/iluminacao/${ligar ? "onall" : "offall"}`,
          { method: "POST" }
        );
        return wrappedSpeakMessage(
          ligar ? "Todas as luzes acesas" : "Todas as luzes apagadas"
        );
      }

      if (alvo === "portao") {
        await fetch("http://localhost:3000/utils/gate/status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: ligar }),
        });
        return wrappedSpeakMessage(ligar ? "Portão aberto" : "Portão fechado");
      }

      if (alvo === "alarme") {
        await fetch("http://localhost:3000/utils/alarm/status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: ligar }),
        });
        return wrappedSpeakMessage(
          ligar ? "Alarme ativado" : "Alarme desativado"
        );
      }

      if (alvo === "porta") {
        await fetch("http://localhost:3000/utils/door/status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: ligar }),
        });
        return wrappedSpeakMessage(ligar ? "Porta aberta" : "Porta fechada");
      }

      if (alvo === "varal") {
        await fetch("http://localhost:3000/utils/drying/status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: ligar }),
        });
        return wrappedSpeakMessage(ligar ? "Varal aberto" : "Varal fechado");
      }

      if (alvo === "janela") {
        await fetch("http://localhost:3000/utils/window/status", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: ligar }),
        });
        return wrappedSpeakMessage(ligar ? "Janela aberta" : "Janela fechada");
      }

      const rota = lightMap[alvo];
      if (rota) {
        await fetch(`http://localhost:3000/iluminacao/${rota}`, {
          method: "POST",
        });
        return wrappedSpeakMessage(
          `Luz do ${alvo} ${ligar ? "acesa" : "apagada"}`
        );
      }

      wrappedSpeakMessage("Alvo não mapeado");
    };

    recognition.start();

    return () => {
      recognition.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  return null;
};

export default VoiceRecognitionListener;
