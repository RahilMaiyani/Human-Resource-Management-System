import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";

export const useApplyLeave = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => API.post("/leaves", data),
    onSuccess: () => qc.invalidateQueries(["myLeaves"])
  });
};

export const useMyLeaves = () => {
  return useQuery({
    queryKey: ["myLeaves"],
    queryFn: async () => {
      const res = await API.get("/leaves/me");
      return res.data;
    }
  });
};

export const useAllLeaves = () => {
  return useQuery({
    queryKey: ["allLeaves"],
    queryFn: async () => {
      const res = await API.get("/leaves");
      return res.data;
    }
  });
};

export const useUpdateLeave = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) =>
      API.patch(`/leaves/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries(["allLeaves"])
  });
};

export const useActiveLeaves = () => {
  return useQuery({
    queryKey: ["active-leaves"],
    queryFn: async () => {
      const { data } = await API.get("/leaves/active");
      return data;
    },
  });
};