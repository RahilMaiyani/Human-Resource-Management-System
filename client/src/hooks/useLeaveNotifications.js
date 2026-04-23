import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";

export const usePendingLeavesCount = () =>
  useQuery({
    queryKey: ["pending-leaves-count"],
    queryFn: async () => {
      const { data } = await API.get("/leaves/pending-count");
      return data.count;
    },
    refetchInterval: 10000
  });