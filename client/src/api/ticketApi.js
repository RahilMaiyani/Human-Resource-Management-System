import API from "./axios";

export const createTicket = async (ticketData) => {
  const res = await API.post("/tickets", ticketData);
  return res.data;
};

export const getMyTickets = async () => {
  const res = await API.get("/tickets/my");
  return res.data;
};

export const getAllTickets = async () => {
  const res = await API.get("/tickets/all");
  return res.data;
};

export const addReply = async ({ id, message }) => {
  const res = await API.post(`/tickets/${id}/reply`, { message });
  return res.data;
};

export const updateTicketStatus = async ({ id, status }) => {
  const res = await API.patch(`/tickets/${id}/status`, { status });
  return res.data;
};