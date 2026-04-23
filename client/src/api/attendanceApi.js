import API from "./axios";

export const checkIn = async () => {
  const res = await API.post("/attendance/check-in");
  return res.data;
};

export const checkOut = async () => {
  const res = await API.post("/attendance/check-out");
  return res.data;
};