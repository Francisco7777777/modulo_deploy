import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Slide } from "react-toastify";

/**
 * Hook Customizado: useTempoSessao
 * Finalidade: Controlar o tempo limite de sessão do aluno no Totem.
 * Notifica a cada minuto restante e desloga automaticamente ao expirar.
 *
 * Qualquer tecla pressionada reinicia a contagem do zero.
 *
 * @param {number} minutos - Duração total da sessão em minutos
 */
export default function useTempoSessao(minutos) {
  const navegar = useNavigate();

  useEffect(() => {
    let tempoRestanteSegundos = minutos * 60;

    const notificar = (minuto) =>
      toast.info(`Restam apenas ${minuto} minuto(s) de sessão!`, {
        position: "top-right",
        autoClose: 4000,
        theme: "light",
        transition: Slide,
      });

    // Reinicia a contagem sempre que qualquer tecla for pressionada, indicando atividade do usuário.
    const reiniciarContagem = () => {
      tempoRestanteSegundos = minutos * 60;
    };

    const cronometro = setInterval(() => {
      tempoRestanteSegundos -= 1;
      console.log(tempoRestanteSegundos);

      // Notifica a cada minuto completo restante
      if (tempoRestanteSegundos % 60 === 0 && tempoRestanteSegundos > 0) {
        const minutosRestantes = tempoRestanteSegundos / 60;
        notificar(minutosRestantes);
      }

      // Sessão expirada: limpa e redireciona
      if (tempoRestanteSegundos <= 0) {
        clearInterval(cronometro);
        console.warn("Sessão do Totem expirou por inatividade.");

        localStorage.removeItem("auth");

        // CORREÇÃO: navegar() já cuida do redirecionamento via React Router.
        // window.location.reload() após navegar() causava loop e era redundante.
        navegar("/");
      }
    }, 1000);

    window.addEventListener("keydown", reiniciarContagem);

    return () => {
      clearInterval(cronometro);
      window.removeEventListener("keydown", reiniciarContagem);
    };
  }, [navegar, minutos]);
}
