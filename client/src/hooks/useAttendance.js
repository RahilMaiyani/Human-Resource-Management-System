import { useMutation } from "@tanstack/react-query";
import { checkIn, checkOut } from "../api/attendanceApi";

export const useCheckIn = (onSuccess, onError) => {
  return useMutation({
    mutationFn: checkIn,
    onSuccess,
    onError
  });
};

export const useCheckOut = (onSuccess, onError) => {
  return useMutation({
    mutationFn: checkOut,
    onSuccess,
    onError
  });
};