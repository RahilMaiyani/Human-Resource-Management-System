import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export const usePendingLeavesCount = (enabled = false) =>
  useQuery({
    queryKey: ["pendingLeavesCount"],
    queryFn: async () => {
      const { data } = await API.get("/leaves/pending-count");
      return data.count;
    },
    enabled,
    refetchInterval: enabled ? 10000 : false,
  });