"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/button";
import { Link } from "@/components/link";
import { api } from "@/services/api";
import { handleError } from "@/utils/handle-error";
import { Loading } from "@/components/loading";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  const handleDidMount = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/api/product");

      setProducts(data.products);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRemoveClick = useCallback(async (id: string) => {
    try {
      setLoading(true);

      await api.delete(`/api/product`, { params: { id } });
      const { data } = await api.get("/api/product");

      setProducts(data.products);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleDidMount();
  }, [handleDidMount]);

  return (
    <>
      {loading && <Loading />}

      <div>
        <div className="m-2">
          <Link href="/product/new">Incluir</Link>
        </div>

        <table className="w-full">
          <thead className="w-full font-bold">
            <tr>
              <td>Id</td>
              <td>Nome</td>
              <td>Estoque</td>
              <td />
              <td />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>
                  <Link href={`/product/${product.id}`}>Editar</Link>
                </td>
                <td>
                  <Button onClick={() => handleRemoveClick(product.id)}>
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
