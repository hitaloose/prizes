"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { useAuth } from "@/hooks/auth";
import { api } from "@/services/api";
import { handleError } from "@/utils/handle-error";
import { Loading } from "@/components/loading";

type Props = {
  params: {
    id: string;
  };
};

export default function Page(props: Props) {
  const { params } = props;
  const { id } = params;

  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<any>({});

  const handleDidMount = useCallback(async () => {
    setLoading(true);
    try {
      if (id === "new") {
        return;
      }

      const { data } = await api.get("/api/product", { params: { id } });
      setProduct(data.product);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSave = useCallback(async () => {
    try {
      if (!product.name) {
        return;
      }
      if (!product.stock) {
        return;
      }
      setLoading(true);

      const data = {
        name: product.name,
        stock: Number(product.stock),
      };

      if (id === "new") {
        await api.post("/api/product", data);
      } else {
        await api.put("/api/product", data, { params: { id } });
      }

      push("/product");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [id, product.name, product.stock, push]);

  useEffect(() => {
    handleDidMount();
  }, [handleDidMount]);

  return (
    <>
      {loading && <Loading />}

      <div className="flex flex-col gap-2">
        <Input label="Id" disabled value={product.id} />
        <Input
          label="Nome"
          value={product.name}
          onChange={(name) => setProduct((prev: any) => ({ ...prev, name }))}
        />
        <Input
          label="Estoque"
          value={product.stock}
          onChange={(stock) => setProduct((prev: any) => ({ ...prev, stock }))}
        />
        <Button onClick={handleSave}>Salvar</Button>
      </div>
    </>
  );
}
