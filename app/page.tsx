"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

const WHATSAPP_LINK = "https://wa.me/557182903672";
const STORAGE_KEY = "arquitetura_da_coragem_chat_v1";

type Message = {
  sender: "ia" | "user";
  text: string;
};

export default function Chat() {
  const [domain, setDomain] = useState("");
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [laudo, setLaudo] = useState<any>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showResumo, setShowResumo] = useState(false);

  const conviteFinal = `
Com base no padrão emocional e cognitivo que apareceu no seu processo, 
há sinais claros de que esse ciclo não se desfaz apenas com reflexão individual. 
Ele é estruturado, repetitivo e exige intervenção direcionada para ser desmontado de fato.

Isso não significa fraqueza. Pelo contrário: perfis racionais e exigentes como o seu 
tendem a carregar tudo sozinhos por muito tempo, o que cria um desgaste silencioso.

Se você sentir que chegou no limite de tentar resolver isso apenas por conta própria,
podemos aprofundar esse diagnóstico em uma sessão individual.

Trabalho exatamente com esse tipo de estrutura: medo, crença, decisão, identidade e ação.
Caso queira clareza, estratégia emocional e direcionamento específico para o seu caso,
estou à disposição. É só me chamar.
`;

  const domains = [
    { id: "coragem_emocional", label: "Coragem Emocional" },
    { id: "coragem_relacional", label: "Coragem Relacional" },
    { id: "coragem_profissional", label: "Coragem Profissional" },
    { id: "coragem_identidade", label: "Coragem da Identidade" },
    { id: "coragem_acao", label: "Coragem da Ação" },
    { id: "coragem_verdade", label: "Coragem da Verdade" },
  ];

  const fases = [
    { numero: 1, nome: "Identificação do Medo", inicio: 0, fim: 4 },
    { numero: 2, nome: "Custo do Medo", inicio: 5, fim: 9 },
    { numero: 3, nome: "Quebra de Crença", inicio: 10, fim: 13 },
    { numero: 4, nome: "Análise de Padrões", inicio: 14, fim: 16 },
    { numero: 5, nome: "Ciclo Atual do Medo", inicio: 17, fim: 19 },
    { numero: 6, nome: "Mapeamento de Cenários", inicio: 20, fim: 22 },
    { numero: 7, nome: "Novo Ciclo de Alta Performance", inicio: 23, fim: 26 },
  ];

  function faseAtual(step: number) {
    return fases.find((f) => step >= f.inicio && step <= f.fim) || fases[0];
  }

  const fAtual = faseAtual(step);
  const progresso = ((step + 1) / 27) * 100;

  // Carregar progresso do localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        setHydrated(true);
        return;
      }
      const data = JSON.parse(saved);
      if (data.domain) setDomain(data.domain);
      if (typeof data.step === "number") setStep(data.step);
      if (Array.isArray(data.messages)) setMessages(data.messages);
      if (Array.isArray(data.answers)) setAnswers(data.answers);
      if (data.laudo) setLaudo(data.laudo);
      if (data.showResumo) setShowResumo(data.showResumo);
    } catch (err) {
      console.error("Erro ao carregar progresso:", err);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Salvar progresso no localStorage
  useEffect(() => {
    if (!hydrated) return;
    const data = { domain, step, messages, answers, laudo, showResumo };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [domain, step, messages, answers, laudo, showResumo, hydrated]);

  // Reset total
  function resetAll() {
    setDomain("");
    setStep(0);
    setMessages([]);
    setAnswers([]);
    setLaudo(null);
    setShowResumo(false);
    setInput("");
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Iniciar fluxo
  async function iniciarFluxo() {
    if (!domain) return;
    setLoading(true);

    const res = await fetch("/api/pergunta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: 0, previousAnswers: [] }),
    });

    const data = await res.json();

    setMessages([{ sender: "ia", text: data.question }]);
    setStep(0);
    setAnswers([]);
    setLaudo(null);
    setShowResumo(false);
    setLoading(false);
  }

  // Enviar resposta
  async function enviarResposta() {
    if (!input.trim()) return;

    const novaResposta = input.trim();
    const novasRespostas = [...answers, novaResposta];

    setMessages((m) => [...m, { sender: "user", text: novaResposta }]);
    setAnswers(novasRespostas);
    setInput("");

    const nextStep = step + 1;
    setStep(nextStep);
    setLoading(true);

    const res = await fetch("/api/pergunta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ step: nextStep, previousAnswers: novasRespostas }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.done) {
      setMessages((m) => [
        ...m,
        {
          sender: "ia",
          text:
            "Perfeito. Antes de gerar sua Arquitetura da Coragem, vou te mostrar um resumo de tudo que você trouxe.",
        },
      ]);
      setShowResumo(true);
      return;
    }

    setMessages((m) => [...m, { sender: "ia", text: data.question }]);
  }

  // Gerar laudo final
  async function gerarLaudo(respostas: string[]) {
    setLoading(true);

    const res = await fetch("/api/gerar-laudo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain, answers: respostas }),
    });

    const data = await res.json();
    setLaudo(data);
    setShowResumo(false);

    setMessages((m) => [
      ...m,
      { sender: "ia", text: "Seu laudo foi gerado com sucesso. Aqui está o resultado:" },
      { sender: "ia", text: conviteFinal },
    ]);

    setLoading(false);
  }

  function confirmarGerarLaudo() {
    if (!answers.length) return;
    gerarLaudo(answers);
  }

  const getAnswer = (index: number) => answers[index] || "—";

  // PDF profissional
  async function baixarPDF() {
    if (!laudo) return;

    const doc = new jsPDF();

    const logo = await fetch("/logo.png")
      .then((r) => r.blob())
      .then(
        (blob) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          })
      );

    doc.addImage(logo as string, "PNG", 10, 10, 40, 40);

    let y = 60;

    const p = (t: string) => {
      const lines = doc.splitTextToSize(t, 180);
      doc.text(lines, 10, y);
      y += lines.length * 7 + 6;
      if (y > 265) {
        doc.addPage();
        y = 20;
      }
    };

    const titulo = (t: string) => {
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(14);
      doc.text(t, 10, y);
      y += 12;
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
    };

    titulo("Arquitetura da Coragem — Laudo Final");

    Object.entries(laudo).forEach(([key, value]) => {
      if (key === "convite_para_sessao_com_anildo") return;
      const tituloFormatado = key.replace(/_/g, " ").toUpperCase();
      titulo(tituloFormatado);
      p(JSON.stringify(value, null, 2));
    });

    titulo("Convite para Sessão Individual");
    conviteFinal.split("\n").forEach((line) => p(line));

    p(`Contato: ${WHATSAPP_LINK}`);

    doc.save("Arquitetura_da_Coragem_Laudo.pdf");
  }

  // -----------------------------------------
  // INTERFACE
  // -----------------------------------------
  return (
    <main className="min-h-screen w-full bg-[#f7f7f7] flex justify-center px-2 sm:px-4 py-6">
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow-soft rounded-2xl border border-slate-200 p-6 sm:p-8">

          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
                Arquitetura da Coragem
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                Protocolo guiado em 7 fases para mapear medos, crenças e decisões com clareza.
              </p>
            </div>
            <img
              src="/logo.png"
              alt="Logo Arquitetura da Coragem"
              className="h-8 sm:h-10 w-auto opacity-90 object-contain"
            />
          </div>

          {/* Botão recomeçar */}
          {(domain || messages.length > 0 || laudo) && (
            <div className="flex justify-end mb-4">
              <button
                onClick={resetAll}
                className="text-xs text-slate-400 hover:text-red-500 underline"
              >
                Recomeçar do zero
              </button>
            </div>
          )}

          {/* Seleção de domínio */}
          {!domain && messages.length === 0 && !laudo && (
            <section className="mb-6">
              <h2 className="text-base font-medium text-slate-800 mb-2">
                1. Escolha o domínio principal do seu desafio
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Isso não trava o processo, apenas ajuda a direcionar o foco da análise.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {domains.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDomain(d.id)}
                    className={`text-left px-4 py-3 rounded-xl border text-sm md:text-base w-full
                      ${
                        domain === d.id
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white hover:border-emerald-300"
                      }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Botão iniciar */}
          {domain && messages.length === 0 && !laudo && (
            <div className="mt-4">
              <button
                onClick={iniciarFluxo}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-base font-semibold"
              >
                Iniciar conversa guiada
              </button>
            </div>
          )}

          {/* Barra de progresso */}
          {messages.length > 0 && !showResumo && !laudo && (
            <section className="mt-6">
              <p className="text-xs sm:text-sm text-slate-500 mb-1">
                Fase {fAtual.numero} de 7 — {fAtual.nome}
              </p>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </section>
          )}

          {/* Chat */}
          {messages.length > 0 && !showResumo && (
            <section className="mt-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 max-h-[55vh] sm:max-h-[60vh] overflow-y-auto space-y-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.sender === "ia" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-2xl text-sm sm:text-[15px] leading-relaxed max-w-[90%] sm:max-w-[80%]
                        ${
                          m.sender === "ia"
                            ? "bg-white border border-slate-200 text-slate-800"
                            : "bg-emerald-500 text-white"
                        }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}

                {loading && (
                  <p className="text-xs text-slate-400 italic">Digitando…</p>
                )}
              </div>
            </section>
          )}

          {/* Input */}
          {messages.length > 0 && !showResumo && !laudo && (
            <section className="mt-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm sm:text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  placeholder="Digite sua resposta com sinceridade…"
                />
                <button
                  onClick={enviarResposta}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-[15px] font-semibold"
                >
                  Enviar
                </button>
              </div>
            </section>
          )}

          {/* RESUMO */}
          {showResumo && !laudo && (
            <section className="mt-8 bg-white border border-emerald-100 rounded-2xl p-4 sm:p-5 space-y-5">
              <h2 className="text-lg sm:text-xl font-semibold text-emerald-700">
                Resumo do seu processo — Arquitetura da Coragem
              </h2>
              <p className="text-sm text-slate-600">
                Abaixo estão suas respostas distribuídas pelas 7 fases do método. Revise com calma.
                Se estiver coerente com a sua realidade, confirme para gerar o laudo final.
              </p>

              {fases.map((f) => (
                <div key={f.numero} className="border-t border-slate-200 pt-3">
                  <h3 className="text-sm sm:text-[15px] font-semibold text-emerald-700 mb-2">
                    Fase {f.numero} — {f.nome}
                  </h3>
                  {Array.from({ length: f.fim - f.inicio + 1 }).map((_, i) => (
                    <p
                      key={i}
                      className="text-xs sm:text-sm text-slate-700 mb-1"
                    >
                      {f.inicio + i + 1}. {getAnswer(f.inicio + i)}
                    </p>
                  ))}
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <button
                  onClick={() => setShowResumo(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm sm:text-[15px] hover:bg-slate-100"
                >
                  Corrigir respostas
                </button>
                <button
                  onClick={confirmarGerarLaudo}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-[15px] font-semibold"
                >
                  Confirmar e gerar laudo
                </button>
              </div>
            </section>
          )}

          {/* LAUDO FINAL */}
          {laudo && (
            <section className="mt-10 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
                  Laudo Final — Arquitetura da Coragem
                </h2>
                <p className="text-xs text-slate-500 mb-2">
                  Abaixo está o laudo técnico em formato estruturado.
                </p>
                <pre className="text-[11px] sm:text-xs whitespace-pre-wrap bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-800 overflow-x-auto">
                  {JSON.stringify(laudo, null, 2)}
                </pre>
              </div>

              <div className="bg-white border border-emerald-200 rounded-2xl p-4 sm:p-5">
                <h3 className="text-base sm:text-lg font-semibold text-emerald-700 mb-3">
                  Convite para aprofundar este processo
                </h3>
                {conviteFinal.split("\n").map((line, i) =>
                  line.trim() ? (
                    <p key={i} className="text-sm text-slate-700 mb-2">
                      {line}
                    </p>
                  ) : (
                    <div key={i} className="h-2" />
                  )
                )}

                <a
                  href={WHATSAPP_LINK}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-[15px] font-semibold"
                >
                  Falar com Anildo no WhatsApp
                </a>
              </div>

              <div>
                <button
                  onClick={baixarPDF}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm sm:text-[15px] font-semibold"
                >
                  Baixar PDF completo
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
