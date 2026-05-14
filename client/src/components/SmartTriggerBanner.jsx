import { usePayrollStatus, useGeneratePayroll } from '../hooks/usePayroll';
import { Banknote, RefreshCw } from "lucide-react";

const SmartTriggerBanner = () => {
  const { data: status, isLoading, isError } = usePayrollStatus();
  const generateMutation = useGeneratePayroll();

  if (isLoading || isError || !status?.actionRequired) return null;

  const handleGenerate = () => {
    if (window.confirm(`Are you sure you want to run payroll for ${status.targetMonth} ${status.targetYear}? Secure PDFs will be generated and emailed.`)) {
      generateMutation.mutate();
    }
  };

  return (
    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl shadow-sm border-l-4 border-l-indigo-500 animate-in fade-in slide-in-from-top-4 mb-8 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon Box matching Data Integrity Alert style */}
          <div className="bg-indigo-100 p-2.5 rounded-lg text-indigo-600">
            {generateMutation.isPending ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Banknote className="w-5 h-5" />
            )}
          </div>

          <div>
            {/* Typography matching "Data Integrity Alert" */}
            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-tight">
              Action Required: {status.targetMonth} {status.targetYear} Payroll
            </h3>
            <p className="text-xs text-indigo-800/80 font-medium mt-0.5">
              The automated engine is ready to process salaries and generate secure payslips.
            </p>
            
            {/* Feedback messages */}
            {generateMutation.isError && (
              <p className="text-[10px] text-rose-600 font-bold uppercase mt-1">
                Engine Error: {generateMutation.error?.response?.data?.msg || 'Execution failed.'}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={handleGenerate}
            disabled={generateMutation.isPending || generateMutation.isSuccess}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-indigo-200"
          >
            {generateMutation.isPending ? "Processing..." : "Run Payroll"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartTriggerBanner;