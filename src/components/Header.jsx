import styles from "./Header.module.css";

import { FaRegUserCircle } from "react-icons/fa";

const Header = ({ exibirUsuario }) => {
  let nomeUsuario = "";

  if (exibirUsuario) {
    const authString = localStorage.getItem("auth");
    const authData = authString ? JSON.parse(authString) : null;
    nomeUsuario = authData?.user?.nome || "Aluno";
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src="/logo_ifce.png" alt="logo-IFCE" className={styles.img} />
      </div>
      {exibirUsuario && (
        <div className={styles.usuario}>
          <FaRegUserCircle className={styles.icos} />
          <p className={styles.span_usuario}>
            {nomeUsuario.split(" ").slice(0, 2).join(" ")}
          </p>
        </div>
      )}
    </header>
  );
};

export default Header;
