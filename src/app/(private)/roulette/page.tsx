"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { api } from "@/services/api";
import { handleError } from "@/utils/handle-error";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { Loading } from "@/components/loading";

export default function Page() {
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);
  const [roulettes, setRoulettes] = useState<any[]>([]);

  const handleDidMount = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/roulette");

      setRoulettes(data.roulettes);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRemoveClick = useCallback(async (id: string) => {
    try {
      setLoading(true);

      await api.delete(`/api/roulette`, { params: { id } });
      const { data } = await api.get("/api/roulette");

      setRoulettes(data.roulettes);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCopyLink = useCallback((id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/prize/${id}`);
    toast.success("Link copiado para area de transferencia");
  }, []);

  useEffect(() => {
    handleDidMount();
  }, [handleDidMount]);

  return (
    <>
      {loading && <Loading />}

      <div>
        <div className="m-2">
          <Link href="/roulette/new">Incluir</Link>
        </div>

        <table className="w-full">
          <thead className="w-full font-bold">
            <tr>
              <td>Id</td>
              <td>Cliente</td>
              <td>Produto sorteado</td>
              <td>Data do sorteio</td>
              <td />
              <td />
            </tr>
          </thead>
          <tbody>
            {roulettes.map((roulette) => (
              <tr key={roulette.id}>
                <td>{roulette.id}</td>
                <td>{roulette.costumer_name}</td>
                <td>{roulette.product?.name || "Sorteio não realizado"}</td>
                <td>{roulette.prize_date || "Sorteio não realizado"}</td>
                <td>
                  <Button onClick={() => handleCopyLink(roulette.id)}>
                    Copiar link
                  </Button>
                </td>
                <td>
                  <Button onClick={() => handleRemoveClick(roulette.id)}>
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
