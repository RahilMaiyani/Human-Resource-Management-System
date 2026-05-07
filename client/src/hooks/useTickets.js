import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  createTicket, 
  getMyTickets, 
  getAllTickets, 
  addReply, 
  updateTicketStatus 
} from "../api/ticketApi";

export const useCreateTicket = (onSuccess, onError) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: (data) => {
      // V5 SYNTAX FIX: Must wrap array in { queryKey: ... }
      qc.invalidateQueries({ queryKey: ["my-tickets"] });
      onSuccess?.(data);
    },
    onError
  });
};

export const useMyTickets = () => {
  return useQuery({
    queryKey: ["my-tickets"],
    queryFn: getMyTickets,
  });
};

export const useAllTickets = () => {
  return useQuery({
    queryKey: ["all-tickets"],
    queryFn: getAllTickets,
  });
};

export const useAddReply = (onSuccess, onError) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: addReply,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["my-tickets"] });
      qc.invalidateQueries({ queryKey: ["all-tickets"] });
      onSuccess?.(data);
    },
    onError
  });
};

export const useUpdateTicketStatus = (onSuccess, onError) => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: updateTicketStatus,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["my-tickets"] });
      qc.invalidateQueries({ queryKey: ["all-tickets"] });
      onSuccess?.(data);
    },
    onError
  });
};