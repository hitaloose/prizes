import axios from "axios";
import { toast } from "react-toastify";

export const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    toast.error(error.response?.data.message);
    return;
  }

  toast.error("Ocorreu um erro desconhecido");
};
