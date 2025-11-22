import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const { domain, answers } = await req.json();

    if (!domain || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Domínio e respostas são obrigatórios." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada no servidor." },
        { status: 500 }
      );
    }

    const perguntasResumo = `
As respostas abaixo foram dadas, na ordem, às seguintes perguntas:

1. Medo central
2. Quando sente esse medo com mais força
3. Primeira lembrança desse padrão
4. Quem influenciou esse padrão
5. Quem reforça esse medo hoje
6. O que deixa de fazer quando o medo aparece
7. Impacto emocional
8. Impacto em relacionamentos
9. Impacto profissional
10. Futuro provável se nada mudar em 1 ano
11. Pensamento gatilho
12. Quão verdadeiro parece (0 a 10)
13. Evidências racionais que contradizem
14. Exemplo de pessoas com outra mentalidade
15. Padrão emocional recorrente
16. Padrão de pensamento recorrente
17. Tendência comportamental (fugir, adiar, agradar, controlar)
18. Como interpreta a situação quando o medo aparece
19. Decisão automática guiada pelo medo
20. Resultado típico gerado
21. Cenário se continuar acreditando no medo e não agir
22. Cenário se agir e der errado (realista)
23. Cenário se agir e der certo
24. Nova percepção com mais maturidade emocional
25. Decisão coerente com a vida que quer construir
26. Primeiro passo prático em 24–72 horas
27. Detalhe final relevante para o laudo
`;

    const respostasFormatadas = answers
      .map((resp: string, index: number) => `Resposta ${index + 1}: ${resp}`)
      .join("\n");

    const systemPrompt = `
Você é a inteligência central da ferramenta "Arquitetura da Coragem", criada por Anildo Moreira Fontes.

Seu papel:
- Usar todas as respostas do usuário para gerar um laudo estruturado em 7 fases.
- Mapear medo, crenças, padrões e cenários com clareza.
- Entregar um diagnóstico racional, direto, sem mimimi, mas humano e respeitoso.
- Preparar a pessoa para um processo terapêutico individual, sem apelo barato.

TOM:
- Direto, claro, estruturado.
- Público majoritariamente feminino, racional e cansado de superficialidade.
- Linguagem adulta, firme, mas com elegância emocional.
- Misture "você" e forma neutra (a pessoa, o padrão) de forma natural.

MODELO DE RESPOSTA:
Você deve responder em JSON PURO, seguindo EXATAMENTE esta estrutura:

{
  "fase_1_identificacao_do_medo": {
    "medo_central": "",
    "origem_emocional_provavel": "",
    "quando_comecou": "",
    "quem_modelou_esse_medo": "",
    "quem_reforca_esse_medo_hoje": ""
  },
  "fase_2_custo_do_medo": {
    "comportamentos_bloqueados": [],
    "consequencias_emocionais": [],
    "impacto_em_relacionamentos": [],
    "impacto_profissional": [],
    "futuro_provavel_se_nada_mudar": ""
  },
  "fase_3_quebra_de_crenca": {
    "pensamento_gatilho": "",
    "o_quao_verdadeiro_eh_de_0_a_10": "",
    "contraargumento_racional": "",
    "exemplos_reais_de_mentalidade_diferente": [],
    "nova_crenca_reprogramada": ""
  },
  "fase_4_analise_de_padroes": {
    "perfil_atual": "",
    "padroes_emocionais": [],
    "padroes_cognitivos": [],
    "padroes_comportamentais": [],
    "perfil_que_o_usuario_deve_adotar": ""
  },
  "fase_5_ciclo_atual_do_medo": {
    "percepcao": "",
    "decisao": "",
    "acao": "",
    "resultado": ""
  },
  "fase_6_mapeamento_de_cenarios": {
    "cenario_1_paralisar": "",
    "cenario_2_agir_e_dar_errado": "",
    "cenario_3_agir_e_dar_certo": "",
    "melhor_cenario_para_o_proposito": ""
  },
  "fase_7_ciclo_de_alta_performance": {
    "nova_percepcao": "",
    "nova_decisao": "",
    "primeira_acao_pratica": ""
  },
  "convite_para_sessao_com_anildo": {
    "mensagem": "",
    "perfil_indicado_para_sessao": ""
  }
}

REGRAS:
- SEMPRE responda SOMENTE com JSON válido.
- Não use markdown, não use \`\`\`, não escreva nada fora do JSON.
- Seja específico e objetivo, sem frases vazias.
- O convite para a sessão deve ser firme, profissional e respeitoso. Nada apelativo.
- Inclua no texto do convite a possibilidade de contato pelo WhatsApp de Anildo, mas não coloque o link em si no JSON (o front-end já sabe o link).
`;

    const userPrompt = `
Domínio da coragem trabalhado: ${domain}

${perguntasResumo}

Respostas do usuário:

${respostasFormatadas}

Use essas respostas para preencher cada campo do JSON, de forma coerente com a realidade dessa pessoa.
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content ?? "";

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (e) {
      return NextResponse.json({
        raw: content,
        errorParse:
          "Não foi possível interpretar a resposta da IA como JSON. Verifique o formato retornado.",
      });
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Erro na rota /api/gerar-laudo:", error);
    return NextResponse.json(
      { error: "Erro ao processar geração de laudo." },
      { status: 500 }
    );
  }
}
