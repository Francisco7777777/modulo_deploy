import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useAuthServices() {
  const [authLoading, setAuthLoading] = useState(false);
  const navegar = useNavigate();

  const login = async (dados) => {
    try {
      const { matricula, codigo_refeitorio } = dados;
      const url = `http://localhost:3000/api/aluno/buscar?matricula=${matricula}&codigo_refeitorio=${codigo_refeitorio}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success && result.body) {
        console.log("Acesso autorizado para:", result.body.nome);
        localStorage.setItem("auth", JSON.stringify({ user: result.body }));
        navegar("/home");
      } else {
        toast.warn("Matrícula ou Código incorretos!", {
          theme: "light",
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor do Totem:", error);

      toast.error("Servidor indisponível no momento.", {
        theme: "light",
        position: "top-center",
      });
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = (navegar) => {
    // Limpa absolutamente todas as notificações ativas na tela
    toast.dismiss();

    localStorage.removeItem("auth");
    navegar("/");
  };

  return { login, logout, authLoading };
}
