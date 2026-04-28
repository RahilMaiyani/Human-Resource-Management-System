import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkIn, checkOut, todayAttn } from "../api/attendanceApi";

export const useCheckIn = (onSuccess, onError) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: checkIn,

    onSuccess: (data) => {
      qc.invalidateQueries(["today-attendance"]);
      onSuccess?.(data);
    },

    onError
  });
};

export const useCheckOut = (onSuccess, onError) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: checkOut,

    onSuccess: (data) => {
      qc.invalidateQueries(["today-attendance"]);
      onSuccess?.(data);
    },

    onError
  });
};

export const useTodayAttendance = () => {
  return useQuery({
    queryKey: ["today-attendance"],
    queryFn: todayAttn,
    staleTime: 0
  });
};