"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/button";
import { Input } from "@/components/input";
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
  const [roulette, setRoulette] = useState<any>({});

  const handleDidMount = useCallback(async () => {
    setLoading(true);
    try {
      if (id === "new") {
        return;
      }

      const { data } = await api.get("/api/roulette", { params: { id } });
      setRoulette(data.roulette);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleSave = useCallback(async () => {
    try {
      if (!roulette.costumer_name) {
        return;
      }
      setLoading(true);

      const data = {
        costumer_name: roulette.costumer_name,
      };

      if (id === "new") {
        await api.post("/api/roulette", data);
      } else {
        await api.put("/api/roulette", data, { params: { id } });
      }

      push("/roulette");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [id, push, roulette.costumer_name]);

  useEffect(() => {
    handleDidMount();
  }, [handleDidMount]);

  return (
    <>
      {loading && <Loading />}

      <div className="flex flex-col gap-2">
        <Input label="Id" disabled value={roulette.id} />
        <Input
          label="Nome do cliente"
          value={roulette.costumer_name}
          onChange={(costumer_name) =>
            setRoulette((prev: any) => ({ ...prev, costumer_name }))
          }
        />
        <Button onClick={handleSave}>Salvar</Button>
      </div>
    </>
  );
}
