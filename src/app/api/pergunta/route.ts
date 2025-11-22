import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { step, previousAnswers } = await req.json();

    // Lista completa das 27 perguntas do fluxo guiado
    const questions = [
      // Fase 1 — Identificação do medo
      "Para começarmos direto ao ponto: qual é o medo central que está te travando agora?",
      "Quando você sente esse medo com mais força? Existe alguma situação específica?",
      "Esse tipo de medo geralmente tem uma história. Quando você lembra de ter sentido algo parecido pela primeira vez?",
      "Alguém influenciou esse padrão ao longo da sua vida?",
      "Hoje, quem — mesmo sem perceber — reforça esse medo na sua rotina?",

      // Fase 2 — Custo do medo
      "O que você deixa de fazer quando esse medo aparece? Liste ações ou situações que você evita.",
      "Qual é o impacto emocional disso em você? (Ex.: ansiedade, insegurança, culpa, frustração)",
      "Nos seus relacionamentos, esse medo afeta alguma coisa?",
      "E na sua vida profissional, o que esse medo já te fez perder ou adiar?",
      "Se tudo continuar igual por um ano, qual seria o resultado mais provável na sua vida?",

      // Fase 3 — Quebra de crença
      "Qual é a frase interna que aparece na sua mente quando o medo surge? Esse é o 'pensamento gatilho'.",
      "De 0 a 10, o quanto essa frase parece verdadeira para você hoje?",
      "Que evidências racionais contradizem essa frase? Algo que prove que ela não é 100% verdadeira?",
      "Pense em pessoas que não acreditam nesse tipo de medo. Que comportamentos ou visões elas têm que talvez você admira?",

      // Fase 4 — Análise de padrões
      "Quando você observa sua vida de fora, qual padrão emocional se repete ligado a esse medo?",
      "E nos pensamentos — qual padrão cognitivo aparece nesses momentos?",
      "Quando esse medo surge, você tende mais a fugir, adiar, agradar ou tentar controlar a situação?",

      // Fase 5 — Ciclo atual do medo
      "Quando o medo aparece, como você interpreta a situação?",
      "Qual é a decisão automática que você costuma tomar guiada pelo medo?",
      "E qual é o resultado típico que essa decisão gera na sua vida?",

      // Fase 6 — Mapeamento de cenários
      "Se você acreditar nesse medo e não agir, qual é o cenário mais provável?",
      "Se você agir e der errado, qual seria o pior resultado realista — sem dramatizar?",
      "E se você agir e der certo, o que mudaria na sua vida?",

      // Fase 7 — Novo ciclo de alta performance
      "Se você fosse olhar para tudo isso com mais maturidade emocional, qual seria uma nova percepção sobre essa situação?",
      "Qual decisão seria mais coerente com a vida que você quer construir?",
      "Qual é o primeiro passo simples e prático que você pode executar nas próximas 24 a 72 horas?",

      // Pergunta final antes do laudo
      "Antes de eu gerar o seu laudo completo, existe algum detalhe importante que você acha que eu preciso saber?"
    ];

    // Caso o usuário esteja além do limite → acabou o fluxo
    if (step >= questions.length) {
      return NextResponse.json({
        done: true,
        message: "Fim das perguntas. Pronto para gerar o laudo final."
      });
    }

    const nextQuestion = questions[step];

    return NextResponse.json({
      done: false,
      step,
      question: nextQuestion
    });

  } catch (error) {
    console.error("Erro na API /pergunta:", error);
    return NextResponse.json(
      { error: "Erro ao processar pergunta." },
      { status: 500 }
    );
  }
}
