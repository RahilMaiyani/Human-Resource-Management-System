import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkIn, checkOut, todayAttn } from "../api/attendanceApi";
import API from "../api/axios";

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

export const useAttendanceHistory = (selectedMonth, selectedYear, page) => {
  return useQuery({
    queryKey: ["my-attendance", selectedMonth, selectedYear, page],
    queryFn: async () => {
      const res = await API.get(`/attendance/me?month=${selectedMonth}&year=${selectedYear}&page=${page}`);
      return res.data;
    },
    keepPreviousData: true,
    enabled: !!selectedMonth && !!selectedYear // Only fetch when filters are ready
  });
};