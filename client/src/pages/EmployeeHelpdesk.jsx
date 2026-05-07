import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import EmptyState from "../components/EmptyState";
import { useMyTickets } from "../hooks/useTickets";
import { Plus, Ticket as TicketIcon, Clock, MessageSquare } from "lucide-react";
import CreateTicketModal from "../components/CreateTicketModal"; 
import TicketDetailModal from "../components/TicketDetailModal";

const EmployeeHelpdesk = () => {
  const { data: tickets = [], isLoading } = useMyTickets();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Helper function to color-code statuses
  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "In-Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolved": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Closed": return "bg-slate-100 text-slate-800 border-slate-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">IT & HR Helpdesk</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">Need assistance? Raise a ticket and we'll help you out.</p>
          </div>
          
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            Raise New Ticket
          </button>
        </div>

        {/* Tickets Grid */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-24 bg-slate-100 rounded-xl border border-slate-200 w-full"></div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <EmptyState 
            icon="LifeBuoy" 
            title="No active tickets" 
            description="You don't have any open requests. Everything must be running smoothly!" 
          />
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {tickets.map((ticket) => (
              <div 
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  
                  {/* Left Side: Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-slate-400">{ticket.ticketId}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {ticket.subject}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><TicketIcon className="w-3.5 h-3.5" /> {ticket.category}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Right Side: Priority & Replies */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      ticket.priority === 'Urgent' ? 'bg-rose-50 text-rose-600' : 
                      ticket.priority === 'High' ? 'bg-orange-50 text-orange-600' : 'bg-slate-50 text-slate-600'
                    }`}>
                      {ticket.priority} Priority
                    </span>
                    
                    {ticket.replies?.length > 0 && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                        <MessageSquare className="w-3.5 h-3.5" />
                        {ticket.replies.length} Replies
                      </span>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

        <CreateTicketModal
         isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        /> 

<TicketDetailModal 
  // Look for the fresh ticket in the React Query array. If not found, use selectedTicket as fallback.
  ticket={tickets.find(t => t._id === selectedTicket?._id) || selectedTicket} 
  onClose={() => setSelectedTicket(null)} 
/>

    </DashboardLayout>
  );
};

export default EmployeeHelpdesk;