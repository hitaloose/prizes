"use client";

import { persistStorage } from "@/services/persist-storage";
import { useMemo, useState } from "react";

export const useAuth = () => {
  const [jwt, setJwt] = useState(persistStorage.getItem("JWT") || "");
  const authenticated = useMemo(() => !!jwt, [jwt]);

  const changeJwt = (newJwt: string) => {
    setJwt(newJwt);
    persistStorage.setItem("JWT", newJwt);
  };

  return { jwt, changeJwt, authenticated };
};
