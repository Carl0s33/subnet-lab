import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const PaginaNaoEncontrada = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: Rota não encontrada:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-extrabold">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">Ops! Página não encontrada.</p>
        <a href="/" className="inline-block rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground hover:opacity-90">
          Voltar para a página inicial
        </a>
      </div>
    </div>
  );
};

export default PaginaNaoEncontrada;
