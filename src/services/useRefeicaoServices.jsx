import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

/**
 * Hook Customizado: useRefeicoesServices
 * Responsabilidades:
 *  1. Buscar a lista de refeições disponíveis para o aluno (GET)
 *  2. Agendar uma refeição escolhida pelo aluno (POST)
 *
 * @param {string|number} idAluno - ID do aluno logado
 */
export default function useRefeicoesServices(idAluno) {
  const [refeicoes, setRefeicoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // ==========================================
  // BUSCA DE REFEIÇÕES (GET)
  // Extraída com useCallback para poder ser chamada
  // tanto no carregamento inicial (useEffect) quanto
  // depois de um agendamento bem-sucedido (refresh).
  // ==========================================
  const buscarRefeicoes = useCallback(async () => {
    if (!idAluno) return;

    setCarregando(true);
    try {
      const resposta = await fetch(
        `http://localhost:3000/api/aluno/${idAluno}/refeicoes`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!resposta.ok) {
        throw new Error("Erro ao buscar refeições.");
      }

      const dados = await resposta.json();
      setRefeicoes(dados.refeicoes ?? []);
    } catch (erro) {
      console.error("Erro na requisição: ", erro);
      toast.error("Não foi possível carregar suas refeições!", {
        position: "top-center",
        theme: "light",
      });
    } finally {
      setCarregando(false);
    }
  }, [idAluno]);

  // Carrega a lista assim que houver um idAluno (ou quando ele mudar).
  // A chamada é adiada com queueMicrotask para que o setState feito
  // dentro de buscarRefeicoes não ocorra de forma síncrona dentro do
  // corpo do efeito (evita o aviso react-hooks/set-state-in-effect).
  useEffect(() => {
    queueMicrotask(() => {
      buscarRefeicoes();
    });
  }, [buscarRefeicoes]);

  // ==========================================
  // AGENDAMENTO DE REFEIÇÃO (POST)
  // Centralizado aqui para manter toda a lógica de rede em um único lugar.
  // A Home apenas chama esta função — sem conhecer detalhes da requisição.
  // ==========================================
  const agendarRefeicao = useCallback(
    async (refeicao) => {
      try {
        const resposta = await fetch(
          "http://localhost:3000/api/agendamento/criar",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idAluno,
              idCardapio: refeicao.id,
            }),
          },
        );

        const resultado = await resposta.json();

        if (resultado.success) {
          console.log("Agendamento realizado:", resultado);
          toast.success("Refeição agendada com sucesso!", {
            position: "top-center",
            theme: "light",
          });

          // ------------------------------------------
          // Atualiza SOMENTE o item agendado no estado local,
          // usando os dados que o próprio POST já retornou
          // (resultado.body). Evita um novo GET completo e o
          // flash de "Carregando refeições..." na tela — a
          // transição de status fica suave, controlada via CSS.
          // ------------------------------------------
          setRefeicoes((atual) =>
            atual.map((item) =>
              item.id === refeicao.id
                ? {
                    ...item,
                    status: "Reservada",
                    agendamentoId: resultado.body.id,
                    reservadoEm: resultado.body.criadoEm,
                  }
                : item,
            ),
          );
        } else {
          toast.warn("Não foi possível agendar! ", {
            position: "top-center",
            theme: "light",
          });
        }
      } catch (erro) {
        console.error("Erro ao agendar refeição: ", erro);
        toast.error("Servidor indisponível!", {
          position: "top-center",
          theme: "light",
        });
      }
    },
    [idAluno],
  );

  return { refeicoes, carregando, agendarRefeicao };
}
