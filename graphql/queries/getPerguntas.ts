import { gql } from "@apollo/client";

export const GET_PERGUNTAS_POOL = gql`
  query GetPerguntasPool {
    perguntas(first: 100, where: { ativa: true }) {
      id
    }
  }
`;

export const GET_PERGUNTAS_BY_IDS = gql`
  query GetPerguntasByIds($ids: [ID!]) {
    perguntas(where: { id_in: $ids, ativa: true }) {
      id
      enunciado { html }
      tipo
      dificuldade
      tempoLimite
      dica
      imagem { url }
      pegadinha {
        nome
        tipo
        descricao
      }
      alternativa {
        id
        texto
        correta
        ordem
      }
    }
  }
`;