import { useState, useMemo } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import EmptyState from "../components/EmptyState";
import TicketDetailModal from "../components/TicketDetailModal";
import { useAllTickets } from "../hooks/useTickets";
import { Search, Filter, MessageSquare, Clock } from "lucide-react";

const AdminHelpdesk = () => {
  const { data: tickets = [], isLoading } = useAllTickets();
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Filtering State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Derived State: Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesSearch = 
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.userId?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || ticket.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tickets, searchTerm, statusFilter, categoryFilter]);

  // Helper for status badges
  const getStatusBadge = (status) => {
    const styles = {
      "Open": "bg-yellow-100 text-yellow-800",
      "In-Progress": "bg-blue-100 text-blue-800",
      "Resolved": "bg-emerald-100 text-emerald-800",
      "Closed": "bg-slate-100 text-slate-800"
    };
    return <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>;
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Helpdesk Command Center</h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">Manage and resolve employee support tickets.</p>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by subject or employee name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          
          <div className="flex w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent text-sm font-medium text-slate-700 outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In-Progress">In-Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
            <select 
              value={categoryFilter} 
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="All">All Categories</option>
              <option value="IT Support">IT Support</option>
              <option value="HR Inquiry">HR Inquiry</option>
              <option value="Facilities">Facilities</option>
              <option value="Payroll">Payroll</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Employee</th>
                  <th className="p-4">Ticket Info</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center">
                      <div className="animate-pulse flex flex-col items-center gap-4">
                        <div className="h-4 w-48 bg-slate-200 rounded"></div>
                        <div className="h-4 w-64 bg-slate-200 rounded"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-0">
                      <EmptyState 
                        icon="CheckCircle" 
                        title="Inbox Zero" 
                        description="No tickets match your current filters." 
                      />
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr 
                      key={ticket._id} 
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      onClick={() => setSelectedTicket(ticket)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                            {ticket.userId?.name?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{ticket.userId?.name}</p>
                            <p className="text-xs text-slate-500">{ticket.userId?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{ticket.subject}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span>{ticket.category}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold ${
                          ticket.priority === 'Urgent' ? 'text-rose-600' : 
                          ticket.priority === 'High' ? 'text-orange-600' : 'text-slate-600'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td className="p-4">
                        <button className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {ticket.replies?.length > 0 ? "Reply" : "Review"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reuse the exact same modal from the Employee side! */}
      <TicketDetailModal 
        ticket={tickets.find(t => t._id === selectedTicket?._id) || selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
      />
    </DashboardLayout>
  );
};

export default AdminHelpdesk;