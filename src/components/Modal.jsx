import { useEffect, useCallback } from "react";
import styles from "./Modal.module.css";

/**
 * Componente Modal
 *
 * Recebe o estado atual do modal e uma função de callback para reportar
 * a escolha do usuário (via teclado) de volta para o componente pai.
 *
 * @param {string|null} estado     - "sair" | "reserva" | null
 * @param {Function} pegarEscolhaUsuario - Callback: recebe "sim" ou "não"
 */
const Modal = ({ estado, pegarEscolhaUsuario }) => {
  // useCallback garante que a referência da função seja estável
  // entre renders. Sem isso, o useEffect recria o listener a cada render
  // porque `pegarEscolhaUsuario` é uma nova função em cada ciclo do pai,
  // causando acúmulo de listeners (race condition).
  const tratarCliqueTeclado = useCallback(
    (evento) => {
      const tecla = evento.key;

      if (tecla === "0") {
        pegarEscolhaUsuario("não");
      }

      if (tecla === "1") {
        pegarEscolhaUsuario("sim");
      }
    },
    [pegarEscolhaUsuario],
  );

  useEffect(() => {
    // Só registra o listener quando o modal estiver visível
    if (!estado) return;

    window.addEventListener("keydown", tratarCliqueTeclado);

    return () => {
      window.removeEventListener("keydown", tratarCliqueTeclado);
    };
  }, [estado, tratarCliqueTeclado]);

  // Não renderiza nada enquanto modal estiver fechado
  if (!estado) return null;

  return (
    <div className={styles.conteiner}>
      <div className={styles.conteudo}>
        <div>
          {estado === "sair" ? (
            <p className={styles.menssagem}>Confirmar saída?</p>
          ) : (
            <p className={styles.menssagem}>
              Confirmar agendamento da refeição?
            </p>
          )}
        </div>
        <div className={styles.conteir_caixa}>
          <div className={styles.daixa_sim}>
            <span>SIM 1</span>
          </div>
          <div className={styles.daixa_nao}>
            <span>NÃO 0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
