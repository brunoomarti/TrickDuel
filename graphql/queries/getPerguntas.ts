import { gql } from "@apollo/client";

export const GET_PERGUNTAS = gql`
  query GetPerguntas {
    perguntas {
      id
      enunciado {
        html
      }
      tipo
      dificuldade
      tempoLimite
      dica
      imagem {
        url
      }
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
