import { useMutation } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";

export const useSendEmail = () =>
  useMutation({
    mutationFn: (data) => API.post("/email/send", data),
    onSuccess : () => {
        toast.success("Email sent successfully")
    }
  });