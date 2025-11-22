"use client";

import { useState, type FormEvent } from "react";

const DOMAINS = [
  { id: "coragem_emocional", label: "Coragem Emocional" },
  { id: "coragem_relacional", label: "Coragem Relacional" },
  { id: "coragem_profissional", label: "Coragem Profissional" },
  { id: "coragem_identidade", label: "Coragem da Identidade" },
  { id: "coragem_acao", label: "Coragem da Ação (Produtividade)" },
  { id: "coragem_verdade", label: "Coragem da Verdade (Decisões Difíceis)" },
];

type Resultado = {
  fase_1_identificacao_do_medo?: {
    medo_central?: string;
    origem_emocional_provavel?: string;
    quando_comecou?: string;
    quem_modelou_esse_medo?: string;
    quem_reforca_esse_medo_hoje?: string;
  };
  fase_2_custo_do_medo?: {
    comportamentos_bloqueados?: string[];
    consequencias_emocionais?: string[];
    impacto_em_relacionamentos?: string[];
    impacto_profissional?: string[];
    futuro_provavel_se_nada_mudar?: string;
  };
  fase_3_quebra_de_crenca?: {
    pensamento_gatilho?: string;
    o_quao_verdadeiro_eh_de_0_a_10?: string;
    contraargumento_racional?: string;
    exemplos_reais_de_mentalidade_diferente?: string[];
    nova_crenca_reprogramada?: string;
  };
  fase_4_analise_de_padroes?: {
    perfil_atual?: string;
    padroes_emocionais?: string[];
    padroes_cognitivos?: string[];
    padroes_comportamentais?: string[];
    perfil_que_o_usuario_deve_adotar?: string;
  };
  fase_5_ciclo_atual_do_medo?: {
    percepcao?: string;
    decisao?: string;
    acao?: string;
    resultado?: string;
  };
  fase_6_mapeamento_de_cenarios?: {
    cenario_1_paralisar?: string;
    cenario_2_agir_e_dar_errado?: string;
    cenario_3_agir_e_dar_certo?: string;
    melhor_cenario_para_o_proposito?: string;
  };
  fase_7_ciclo_de_alta_performance?: {
    nova_percepcao?: string;
    nova_decisao?: string;
    primeira_acao_pratica?: string;
  };
  convite_para_sessao_com_anildo?: {
    mensagem?: string;
    perfil_indicado_para_sessao?: string;
  };
  raw?: string;
  errorParse?: string;
};

export default function Home() {
  const [domain, setDomain] = useState<string>("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResultado(null);

    if (!domain || !description.trim()) {
      setError("Selecione um domínio e descreva a situação.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/arquitetura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao gerar laudo.");
      }

      setResultado(data);
    } catch (err: any) {
      setError(err.message || "Erro inesperado ao gerar laudo.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPdf() {
    if (!resultado) return;

    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    const linhas: string[] = [];
    linhas.push("Arquitetura da Coragem - Laudo");
    linhas.push("");
    linhas.push("Situação analisada:");
    linhas.push(description);
    linhas.push("");
    linhas.push("FASE 1 - Identificação do medo");
    if (resultado.fase_1_identificacao_do_medo) {
      const f = resultado.fase_1_identificacao_do_medo;
      if (f.medo_central) linhas.push("Medo central: " + f.medo_central);
      if (f.origem_emocional_provavel)
        linhas.push("Origem provável: " + f.origem_emocional_provavel);
      if (f.quando_comecou)
        linhas.push("Quando começou: " + f.quando_comecou);
      if (f.quem_modelou_esse_medo)
        linhas.push("Quem modelou esse medo: " + f.quem_modelou_esse_medo);
      if (f.quem_reforca_esse_medo_hoje)
        linhas.push(
          "Quem reforça esse medo hoje: " + f.quem_reforca_esse_medo_hoje
        );
    }

    linhas.push("");
    linhas.push("FASE 2 - Custo do medo");
    if (resultado.fase_2_custo_do_medo) {
      const f = resultado.fase_2_custo_do_medo;
      if (f.comportamentos_bloqueados && f.comportamentos_bloqueados.length) {
        linhas.push("Comportamentos bloqueados:");
        f.comportamentos_bloqueados.forEach((c) =>
          linhas.push("- " + c)
        );
      }
      if (f.consequencias_emocionais && f.consequencias_emocionais.length) {
        linhas.push("Consequências emocionais:");
        f.consequencias_emocionais.forEach((c) =>
          linhas.push("- " + c)
        );
      }
      if (f.impacto_em_relacionamentos && f.impacto_em_relacionamentos.length) {
        linhas.push("Impacto em relacionamentos:");
        f.impacto_em_relacionamentos.forEach((c) =>
          linhas.push("- " + c)
        );
      }
      if (f.impacto_profissional && f.impacto_profissional.length) {
        linhas.push("Impacto profissional:");
        f.impacto_profissional.forEach((c) => linhas.push("- " + c));
      }
      if (f.futuro_provavel_se_nada_mudar) {
        linhas.push(
          "Futuro provável se nada mudar: " + f.futuro_provavel_se_nada_mudar
        );
      }
    }

    linhas.push("");
    linhas.push("FASE 3 - Quebra de crença");
    if (resultado.fase_3_quebra_de_crenca) {
      const f = resultado.fase_3_quebra_de_crenca;
      if (f.pensamento_gatilho)
        linhas.push("Pensamento gatilho: " + f.pensamento_gatilho);
      if (f.o_quao_verdadeiro_eh_de_0_a_10)
        linhas.push(
          "O quão verdadeiro parece (0 a 10): " +
            f.o_quao_verdadeiro_eh_de_0_a_10
        );
      if (f.contraargumento_racional)
        linhas.push("Contra-argumento racional: " + f.contraargumento_racional);
      if (
        f.exemplos_reais_de_mentalidade_diferente &&
        f.exemplos_reais_de_mentalidade_diferente.length
      ) {
        linhas.push("Exemplos de mentalidade diferente:");
        f.exemplos_reais_de_mentalidade_diferente.forEach((c) =>
          linhas.push("- " + c)
        );
      }
      if (f.nova_crenca_reprogramada)
        linhas.push("Nova crença reprogramada: " + f.nova_crenca_reprogramada);
    }

    linhas.push("");
    linhas.push("FASE 4 - Análise de padrões");
    if (resultado.fase_4_analise_de_padroes) {
      const f = resultado.fase_4_analise_de_padroes;
      if (f.perfil_atual) linhas.push("Perfil atual: " + f.perfil_atual);
      if (f.padroes_emocionais && f.padroes_emocionais.length) {
        linhas.push("Padrões emocionais:");
        f.padroes_emocionais.forEach((c) => linhas.push("- " + c));
      }
      if (f.padroes_cognitivos && f.padroes_cognitivos.length) {
        linhas.push("Padrões cognitivos:");
        f.padroes_cognitivos.forEach((c) => linhas.push("- " + c));
      }
      if (f.padroes_comportamentais && f.padroes_comportamentais.length) {
        linhas.push("Padrões comportamentais:");
        f.padroes_comportamentais.forEach((c) => linhas.push("- " + c));
      }
      if (f.perfil_que_o_usuario_deve_adotar)
        linhas.push(
          "Perfil que você deve adotar: " + f.perfil_que_o_usuario_deve_adotar
        );
    }

    linhas.push("");
    linhas.push("FASE 5 - Ciclo atual do medo");
    if (resultado.fase_5_ciclo_atual_do_medo) {
      const f = resultado.fase_5_ciclo_atual_do_medo;
      if (f.percepcao) linhas.push("Percepção: " + f.percepcao);
      if (f.decisao) linhas.push("Decisão: " + f.decisao);
      if (f.acao) linhas.push("Ação: " + f.acao);
      if (f.resultado) linhas.push("Resultado: " + f.resultado);
    }

    linhas.push("");
    linhas.push("FASE 6 - Mapeamento de cenários");
    if (resultado.fase_6_mapeamento_de_cenarios) {
      const f = resultado.fase_6_mapeamento_de_cenarios;
      if (f.cenario_1_paralisar)
        linhas.push("Cenário 1 (Paralisar): " + f.cenario_1_paralisar);
      if (f.cenario_2_agir_e_dar_errado)
        linhas.push(
          "Cenário 2 (Agir e dar errado): " + f.cenario_2_agir_e_dar_errado
        );
      if (f.cenario_3_agir_e_dar_certo)
        linhas.push(
          "Cenário 3 (Agir e dar certo): " + f.cenario_3_agir_e_dar_certo
        );
      if (f.melhor_cenario_para_o_proposito)
        linhas.push(
          "Melhor cenário para o propósito: " +
            f.melhor_cenario_para_o_proposito
        );
    }

    linhas.push("");
    linhas.push("FASE 7 - Novo ciclo de alta performance");
    if (resultado.fase_7_ciclo_de_alta_performance) {
      const f = resultado.fase_7_ciclo_de_alta_performance;
      if (f.nova_percepcao)
        linhas.push("Nova percepção: " + f.nova_percepcao);
      if (f.nova_decisao) linhas.push("Nova decisão: " + f.nova_decisao);
      if (f.primeira_acao_pratica)
        linhas.push("Primeira ação prática: " + f.primeira_acao_pratica);
    }

    if (resultado.convite_para_sessao_com_anildo) {
      linhas.push("");
      linhas.push("Convite para sessão com Anildo:");
      const c = resultado.convite_para_sessao_com_anildo;
      if (c.mensagem) linhas.push(c.mensagem);
      if (c.perfil_indicado_para_sessao)
        linhas.push(
          "Perfil indicado: " + c.perfil_indicado_para_sessao
        );
      linhas.push("WhatsApp: https://wa.me/557182903672");
    }

    const pagina = doc.splitTextToSize(linhas.join("\n"), 180);
    doc.text(pagina, 10, 10);
    doc.save("arquitetura-da-coragem-laudo.pdf");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Arquitetura da Coragem
            </h1>
            <p className="text-sm text-slate-400">
              Diagnóstico estruturado de medo e crenças limitantes,
              baseado no método em 7 fases de Anildo Moreira Fontes.
            </p>
          </div>
          <a
            href="https://wa.me/557182903672"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-emerald-400 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/10 transition"
          >
            Falar com Anildo no WhatsApp
          </a>
        </div>
      </header>

      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 py-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          {/* FORM */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-medium">1. Escolha o domínio da coragem</h2>
              <p className="text-sm text-slate-400 mt-1">
                Onde você sente que o medo mais te trava neste momento?
              </p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DOMAINS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDomain(d.id)}
                    className={`text-left rounded-xl border px-3 py-2 text-sm transition ${
                      domain === d.id
                        ? "border-emerald-400 bg-emerald-500/10"
                        : "border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-lg font-medium">
                  2. Descreva a situação em que o medo te trava
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Seja direto. Quanto mais claro, mais preciso o diagnóstico.
                </p>
                <textarea
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500 min-h-[140px] resize-none"
                  placeholder="Exemplo: Quando penso em me expor profissionalmente, sinto que vão me julgar como incompetente..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-900 px-3 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                  {loading ? "Gerando laudo..." : "Gerar Arquitetura da Coragem"}
                </button>

                {resultado && !loading && (
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-100 hover:border-emerald-400 hover:text-emerald-200 transition"
                  >
                    Baixar laudo em PDF
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-500">
                Esta ferramenta não substitui terapia, mas ajuda a enxergar
                com clareza onde o medo está sequestrando sua coragem.
              </p>
            </form>
          </section>

          {/* RESULTADO */}
          <section className="space-y-4">
            {!resultado && !loading && (
              <div className="h-full border border-dashed border-slate-700 rounded-2xl p-6 flex items-center justify-center text-center text-sm text-slate-500">
                O laudo da sua Arquitetura da Coragem aparecerá aqui.
                Preencha as informações ao lado e clique em &quot;Gerar&quot;.
              </div>
            )}

            {loading && (
              <div className="border border-slate-700 rounded-2xl p-6 text-sm text-slate-300 space-y-3">
                <div className="animate-pulse h-4 w-24 bg-slate-700 rounded" />
                <div className="animate-pulse h-3 w-full bg-slate-800 rounded" />
                <div className="animate-pulse h-3 w-5/6 bg-slate-800 rounded" />
                <div className="animate-pulse h-3 w-4/6 bg-slate-800 rounded" />
                <p className="text-xs text-slate-500 mt-4">
                  Analisando o padrão de medo, identificando crenças e
                  estruturando o seu plano em 7 fases...
                </p>
              </div>
            )}

            {resultado && !loading && (
              <div className="space-y-4 text-sm text-slate-200">
                {resultado.fase_1_identificacao_do_medo && (
                  <div className="border border-slate-700 rounded-2xl p-4 bg-slate-900/60 space-y-1">
                    <h3 className="text-sm font-semibold mb-1">
                      Fase 1 – Identificação do medo
                    </h3>
                    {resultado.fase_1_identificacao_do_medo.medo_central && (
                      <p>
                        <span className="text-slate-400">Medo central: </span>
                        {resultado.fase_1_identificacao_do_medo.medo_central}
                      </p>
                    )}
                    {resultado.fase_1_identificacao_do_medo
                      .origem_emocional_provavel && (
                      <p>
                        <span className="text-slate-400">
                          Origem emocional provável:{" "}
                        </span>
                        {
                          resultado.fase_1_identificacao_do_medo
                            .origem_emocional_provavel
                        }
                      </p>
                    )}
                    {resultado.fase_1_identificacao_do_medo.quando_comecou && (
                      <p>
                        <span className="text-slate-400">
                          Quando isso parece ter começado:{" "}
                        </span>
                        {resultado.fase_1_identificacao_do_medo.quando_comecou}
                      </p>
                    )}
                    {resultado.fase_1_identificacao_do_medo
                      .quem_modelou_esse_medo && (
                      <p>
                        <span className="text-slate-400">
                          Quem modelou esse medo:{" "}
                        </span>
                        {
                          resultado.fase_1_identificacao_do_medo
                            .quem_modelou_esse_medo
                        }
                      </p>
                    )}
                    {resultado.fase_1_identificacao_do_medo
                      .quem_reforca_esse_medo_hoje && (
                      <p>
                        <span className="text-slate-400">
                          Quem reforça esse medo hoje:{" "}
                        </span>
                        {
                          resultado.fase_1_identificacao_do_medo
                            .quem_reforca_esse_medo_hoje
                        }
                      </p>
                    )}
                  </div>
                )}

                {resultado.fase_2_custo_do_medo && (
                  <div className="border border-slate-700 rounded-2xl p-4 bg-slate-900/60 space-y-2">
                    <h3 className="text-sm font-semibold">
                      Fase 2 – Custo do medo
                    </h3>
                    {resultado.fase_2_custo_do_medo
                      .comportamentos_bloqueados &&
                      resultado.fase_2_custo_do_medo
                        .comportamentos_bloqueados.length > 0 && (
                        <div>
                          <p className="text-slate-400">
                            Comportamentos bloqueados:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {resultado.fase_2_custo_do_medo.comportamentos_bloqueados.map(
                              (c, i) => (
                                <li key={i}>{c}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {resultado.fase_2_custo_do_medo
                      .consequencias_emocionais &&
                      resultado.fase_2_custo_do_medo
                        .consequencias_emocionais.length > 0 && (
                        <div>
                          <p className="text-slate-400">
                            Consequências emocionais:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {resultado.fase_2_custo_do_medo.consequencias_emocionais.map(
                              (c, i) => (
                                <li key={i}>{c}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {resultado.fase_2_custo_do_medo
                      .impacto_em_relacionamentos &&
                      resultado.fase_2_custo_do_medo
                        .impacto_em_relacionamentos.length > 0 && (
                        <div>
                          <p className="text-slate-400">
                            Impacto em relacionamentos:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {resultado.fase_2_custo_do_medo.impacto_em_relacionamentos.map(
                              (c, i) => (
                                <li key={i}>{c}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {resultado.fase_2_custo_do_medo.impacto_profissional &&
                      resultado.fase_2_custo_do_medo.impacto_profissional
                        .length > 0 && (
                        <div>
                          <p className="text-slate-400">
                            Impacto profissional:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {resultado.fase_2_custo_do_medo.impacto_profissional.map(
                              (c, i) => (
                                <li key={i}>{c}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {resultado.fase_2_custo_do_medo
                      .futuro_provavel_se_nada_mudar && (
                      <p>
                        <span className="text-slate-400">
                          Futuro provável se nada mudar:{" "}
                        </span>
                        {
                          resultado.fase_2_custo_do_medo
                            .futuro_provavel_se_nada_mudar
                        }
                      </p>
                    )}
                  </div>
                )}

                {resultado.fase_3_quebra_de_crenca && (
                  <div className="border border-slate-700 rounded-2xl p-4 bg-slate-900/60 space-y-2">
                    <h3 className="text-sm font-semibold">
                      Fase 3 – Quebra de crença
                    </h3>
                    {resultado.fase_3_quebra_de_crenca.pensamento_gatilho && (
                      <p>
                        <span className="text-slate-400">
                          Pensamento gatilho:{" "}
                        </span>
                        {resultado.fase_3_quebra_de_crenca.pensamento_gatilho}
                      </p>
                    )}
                    {resultado.fase_3_quebra_de_crenca
                      .o_quao_verdadeiro_eh_de_0_a_10 && (
                      <p>
                        <span className="text-slate-400">
                          O quão verdadeiro parece (0 a 10):{" "}
                        </span>
                        {
                          resultado.fase_3_quebra_de_crenca
                            .o_quao_verdadeiro_eh_de_0_a_10
                        }
                      </p>
                    )}
                    {resultado.fase_3_quebra_de_crenca
                      .contraargumento_racional && (
                      <p>
                        <span className="text-slate-400">
                          Contra-argumento racional:{" "}
                        </span>
                        {
                          resultado.fase_3_quebra_de_crenca
                            .contraargumento_racional
                        }
                      </p>
                    )}
                    {resultado.fase_3_quebra_de_crenca
                      .exemplos_reais_de_mentalidade_diferente &&
                      resultado.fase_3_quebra_de_crenca
                        .exemplos_reais_de_mentalidade_diferente.length > 0 && (
                        <div>
                          <p className="text-slate-400">
                            Exemplos de mentalidade diferente:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {resultado.fase_3_quebra_de_crenca.exemplos_reais_de_mentalidade_diferente.map(
                              (c, i) => (
                                <li key={i}>{c}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {resultado.fase_3_quebra_de_crenca
                      .nova_crenca_reprogramada && (
                      <p>
                        <span className="text-slate-400">
                          Nova crença reprogramada:{" "}
                        </span>
                        {
                          resultado.fase_3_quebra_de_crenca
                            .nova_crenca_reprogramada
                        }
                      </p>
                    )}
                  </div>
                )}

                {resultado.fase_4_analise_de_padroes && (
                  <div className="border border-slate-700 rounded-2xl p-4 bg-slate-900/60 space-y-2">
                    <h3 className="text-sm font-semibold">
                      Fase 4 – Análise de padrões
                    </h3>
                    {resultado.fase_4_analise_de_padroes.perfil_atual && (
                      <p>
                        <span className="text-slate-400">Perfil atual: </span>
                        {resultado.fase_4_analise_de_padroes.perfil_atual}
                      </p>
                    )}
                    {resultado.fase_4_analise_de_padroes
                      .padroes_emocionais &&
                      resultado.fase_4_analise_de_padroes.padroes_emocionais
                        .length > 0 && (
                        <div>
                          <p className="text-slate-400">
                            Padrões emocionais:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {resultado.fase_4_analise_de_padroes.padroes_emocionais.map(
                              (c, i) => (
                                <li key={i}>{c}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {resultado.fase_4_analise_de_padroes
                      .padroes_cognitivos &&
                      resultado.fase_4_analise_de_padroes.padroes_cognitivos
                        .length > 0 && (
                        <div>
                          <p className="text-slate-400">
                            Padrões cognitivos:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {resultado.fase_4_analise_de_padroes.padroes_cognitivos.map(
                              (c, i) => (
                                <li key={i}>{c}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {resultado.fase_4_analise_de_padroes
                      .padroes_comportamentais &&
                      resultado.fase_4_analise_de_padroes
                        .padroes_comportamentais.length > 0 && (
                        <div>
                          <p className="text-slate-400">
                            Padrões comportamentais:
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            {resultado.fase_4_analise_de_padroes.padroes_comportamentais.map(
                              (c, i) => (
                                <li key={i}>{c}</li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    {resultado.fase_4_analise_de_padroes
                      .perfil_que_o_usuario_deve_adotar && (
                      <p>
                        <span className="text-slate-400">
                          Perfil indicado para você:{" "}
                        </span>
                        {
                          resultado.fase_4_analise_de_padroes
                            .perfil_que_o_usuario_deve_adotar
                        }
                      </p>
                    )}
                  </div>
                )}

                {resultado.fase_5_ciclo_atual_do_medo && (
                  <div className="border border-slate-700 rounded-2xl p-4 bg-slate-900/60 space-y-1">
                    <h3 className="text-sm font-semibold">
                      Fase 5 – Ciclo atual do medo
                    </h3>
                    {resultado.fase_5_ciclo_atual_do_medo.percepcao && (
                      <p>
                        <span className="text-slate-400">Percepção: </span>
                        {resultado.fase_5_ciclo_atual_do_medo.percepcao}
                      </p>
                    )}
                    {resultado.fase_5_ciclo_atual_do_medo.decisao && (
                      <p>
                        <span className="text-slate-400">Decisão: </span>
                        {resultado.fase_5_ciclo_atual_do_medo.decisao}
                      </p>
                    )}
                    {resultado.fase_5_ciclo_atual_do_medo.acao && (
                      <p>
                        <span className="text-slate-400">Ação: </span>
                        {resultado.fase_5_ciclo_atual_do_medo.acao}
                      </p>
                    )}
                    {resultado.fase_5_ciclo_atual_do_medo.resultado && (
                      <p>
                        <span className="text-slate-400">Resultado: </span>
                        {resultado.fase_5_ciclo_atual_do_medo.resultado}
                      </p>
                    )}
                  </div>
                )}

                {resultado.fase_6_mapeamento_de_cenarios && (
                  <div className="border border-slate-700 rounded-2xl p-4 bg-slate-900/60 space-y-2">
                    <h3 className="text-sm font-semibold">
                      Fase 6 – Mapeamento de cenários
                    </h3>
                    {resultado.fase_6_mapeamento_de_cenarios
                      .cenario_1_paralisar && (
                      <p>
                        <span className="text-slate-400">
                          Cenário 1 – Paralisar:{" "}
                        </span>
                        {
                          resultado.fase_6_mapeamento_de_cenarios
                            .cenario_1_paralisar
                        }
                      </p>
                    )}
                    {resultado.fase_6_mapeamento_de_cenarios
                      .cenario_2_agir_e_dar_errado && (
                      <p>
                        <span className="text-slate-400">
                          Cenário 2 – Agir e dar errado:{" "}
                        </span>
                        {
                          resultado.fase_6_mapeamento_de_cenarios
                            .cenario_2_agir_e_dar_errado
                        }
                      </p>
                    )}
                    {resultado.fase_6_mapeamento_de_cenarios
                      .cenario_3_agir_e_dar_certo && (
                      <p>
                        <span className="text-slate-400">
                          Cenário 3 – Agir e dar certo:{" "}
                        </span>
                        {
                          resultado.fase_6_mapeamento_de_cenarios
                            .cenario_3_agir_e_dar_certo
                        }
                      </p>
                    )}
                    {resultado.fase_6_mapeamento_de_cenarios
                      .melhor_cenario_para_o_proposito && (
                      <p>
                        <span className="text-slate-400">
                          Melhor cenário para o seu propósito:{" "}
                        </span>
                        {
                          resultado.fase_6_mapeamento_de_cenarios
                            .melhor_cenario_para_o_proposito
                        }
                      </p>
                    )}
                  </div>
                )}

                {resultado.fase_7_ciclo_de_alta_performance && (
                  <div className="border border-slate-700 rounded-2xl p-4 bg-slate-900/60 space-y-1">
                    <h3 className="text-sm font-semibold">
                      Fase 7 – Novo ciclo de alta performance
                    </h3>
                    {resultado.fase_7_ciclo_de_alta_performance
                      .nova_percepcao && (
                      <p>
                        <span className="text-slate-400">
                          Nova percepção:{" "}
                        </span>
                        {
                          resultado.fase_7_ciclo_de_alta_performance
                            .nova_percepcao
                        }
                      </p>
                    )}
                    {resultado.fase_7_ciclo_de_alta_performance
                      .nova_decisao && (
                      <p>
                        <span className="text-slate-400">Nova decisão: </span>
                        {
                          resultado.fase_7_ciclo_de_alta_performance
                            .nova_decisao
                        }
                      </p>
                    )}
                    {resultado.fase_7_ciclo_de_alta_performance
                      .primeira_acao_pratica && (
                      <p>
                        <span className="text-slate-400">
                          Primeira ação prática:{" "}
                        </span>
                        {
                          resultado.fase_7_ciclo_de_alta_performance
                            .primeira_acao_pratica
                        }
                      </p>
                    )}
                  </div>
                )}

                {resultado.convite_para_sessao_com_anildo && (
                  <div className="border border-emerald-500/60 rounded-2xl p-4 bg-emerald-500/5 space-y-3">
                    <h3 className="text-sm font-semibold text-emerald-300">
                      Convite para sessão individual com Anildo
                    </h3>
                    {resultado.convite_para_sessao_com_anildo.mensagem && (
                      <p className="text-sm text-emerald-50">
                        {resultado.convite_para_sessao_com_anildo.mensagem}
                      </p>
                    )}
                    {resultado.convite_para_sessao_com_anildo
                      .perfil_indicado_para_sessao && (
                      <p className="text-xs text-emerald-200/80">
                        Perfil indicado:{" "}
                        {
                          resultado.convite_para_sessao_com_anildo
                            .perfil_indicado_para_sessao
                        }
                      </p>
                    )}
                    <a
                      href="https://wa.me/557182903672"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-900 hover:bg-emerald-400 transition mt-1"
                    >
                      Agendar sessão pelo WhatsApp
                    </a>
                  </div>
                )}

                {resultado.raw && (
                  <div className="border border-red-600 rounded-2xl p-4 bg-red-950/50 space-y-2">
                    <h3 className="text-sm font-semibold text-red-200">
                      Resposta bruta da IA
                    </h3>
                    <p className="text-xs text-red-100 whitespace-pre-wrap">
                      {resultado.raw}
                    </p>
                    {resultado.errorParse && (
                      <p className="text-xs text-red-300">
                        Obs.: {resultado.errorParse}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      <footer className="border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Arquitetura da Coragem • Anildo
            Moreira Fontes
          </span>
          <span>
            Ferramenta experimental de autoconhecimento. Procure ajuda
            profissional quando necessário.
          </span>
        </div>
      </footer>
    </main>
  );
}
