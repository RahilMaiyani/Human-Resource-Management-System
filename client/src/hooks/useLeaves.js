import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";

// APPLY LEAVE
export const useApplyLeave = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data) => API.post("/leaves", data),

    onSuccess: () => {
      toast.success("Leave applied successfully");
      qc.invalidateQueries(["myLeaves"]);
    },

    onError: (err) => {
      toast.error(err?.response?.data?.msg || "Failed to apply leave");
    }
  });
};

// MY LEAVES
export const useMyLeaves = () => {
  return useQuery({
    queryKey: ["myLeaves"],
    queryFn: async () => {
      const res = await API.get("/leaves/me");
      return res.data;
    }
  });
};

// ALL LEAVES
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
    mutationFn: ({ id, status, adminComment }) =>
      API.patch(`/leaves/${id}`, {
        status,
        adminComment
      }),

    onSuccess: () => {
      toast.success("Leave updated successfully");

      qc.invalidateQueries(["allLeaves"]);
      qc.invalidateQueries(["activeLeaves"]);
      qc.invalidateQueries(["myLeaves"]);
    },

    onError: (err) => {
      toast.error(err?.response?.data?.msg || "Failed to update leave");
    }
  });
};

// ACTIVE LEAVES
export const useActiveLeaves = () => {
  return useQuery({
    queryKey: ["activeLeaves"], 
    queryFn: async () => {
      const { data } = await API.get("/leaves/active");
      return data;
    }
  });
};