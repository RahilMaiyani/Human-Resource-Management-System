import { useState, useEffect, useRef } from "react";
import { X, Send, CheckCircle, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAddReply, useUpdateTicketStatus } from "../hooks/useTickets";

const TicketDetailModal = ({ ticket, onClose }) => {
  const { user } = useAuth();
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [ticket?.replies]);

  const { mutate: sendReply, isPending: isSending } = useAddReply(() => {
    setReplyText("");
  });

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateTicketStatus();

  if (!ticket) return null;

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    sendReply({ id: ticket._id, message: replyText });
  };

  const handleCloseTicket = () => {
    if (window.confirm("Are you sure this issue is completely resolved?")) {
      updateStatus({ id: ticket._id, status: "Closed" });
      onClose(); // Close the modal and return to dashboard
    }
  };

  const handleAdminStatusChange = (e) => {
    updateStatus({ id: ticket._id, status: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* HEADER SECTION */}
        <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 flex justify-between items-start shrink-0">
          <div className="flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="text-xs font-bold px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-md">
                {ticket.category}
              </span>
              
              {/* ADMIN STATUS CONTROLS */}
              {user.role === "admin" && ticket.status !== "Closed" ? (
                <select 
                  value={ticket.status}
                  onChange={handleAdminStatusChange}
                  disabled={isUpdatingStatus}
                  className="text-xs font-bold px-2 py-0.5 rounded-md border border-slate-300 bg-white text-slate-700 focus:ring-2 focus:ring-indigo-500 cursor-pointer outline-none transition-all"
                >
                  <option value="Open">Open</option>
                  <option value="In-Progress">In-Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              ) : (
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md ${
                  ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                  ticket.status === 'Closed' ? 'bg-slate-200 text-slate-600' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {ticket.status}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">{ticket.subject}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 bg-white rounded-full shadow-sm hover:shadow transition-all border border-slate-200 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CHAT BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-50/50">
          <div className="flex flex-col items-start max-w-[85%]">
            <span className="text-xs font-bold text-slate-400 mb-1 ml-1">Original Request</span>
            <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {ticket.description}
            </div>
          </div>

          {ticket.replies?.map((reply, index) => {
            const isMe = reply.senderId === user._id;
            const isAdmin = reply.role === 'admin';

            return (
              <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] ${isMe ? "ml-auto" : "mr-auto"}`}>
                <span className={`text-xs font-bold mb-1 mx-1 ${isAdmin && !isMe ? "text-indigo-500" : "text-slate-400"}`}>
                  {isMe ? "You" : reply.senderName + (isAdmin ? " (Admin)" : "")}
                </span>
                
                <div className={`p-3.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow-sm ${
                  isMe 
                    ? "bg-indigo-600 text-white rounded-tr-sm" 
                    : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm"
                }`}>
                  {reply.message}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* FOOTER ACTIONS */}
        {ticket.status !== "Closed" ? (
          <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex flex-col gap-3">
            
            {/* 1. Chat Input */}
            <form onSubmit={handleSendReply} className="flex gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                disabled={isSending || isUpdatingStatus}
              />
              <button
                type="submit"
                disabled={!replyText.trim() || isSending || isUpdatingStatus}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 shadow-sm shadow-indigo-200 flex items-center justify-center min-w-12.5"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>

            {/* 2. Employee Permanent "Close" Action */}
            {user.role === "employee" && (
              <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border transition-colors ${
                ticket.status === "Resolved" 
                  ? "bg-emerald-50 border-emerald-100" 
                  : "bg-slate-50 border-slate-200"
              }`}>
                <p className={`text-xs font-medium ${ticket.status === "Resolved" ? "text-emerald-800" : "text-slate-600"}`}>
                  {ticket.status === "Resolved" 
                    ? "The admin has marked this as resolved. Is your issue fixed?" 
                    : "Did you fix the issue yourself or no longer need help?"}
                </p>
                <button 
                  type="button"
                  onClick={handleCloseTicket}
                  disabled={isUpdatingStatus}
                  className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center shrink-0 ${
                    ticket.status === "Resolved"
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Close Ticket
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center shrink-0">
            <p className="text-sm font-medium text-slate-500 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-slate-400" /> This ticket has been closed.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default TicketDetailModal;