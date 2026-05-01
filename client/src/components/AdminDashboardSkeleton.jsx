export default function AdminDashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-6">
        <div className="h-8 w-64 bg-slate-200 rounded-md mb-2"></div>
        <div className="h-4 w-96 bg-slate-100 rounded-md"></div>
      </div>

      {/* TOP LEVEL STATS (3 Columns) */}
      <div className="grid grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-3 w-24 bg-slate-100 rounded-sm"></div>
                <div className="h-8 w-16 bg-slate-200 rounded-md"></div>
              </div>
              <div className="h-10 w-10 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="mt-6 h-4 w-32 bg-slate-50 rounded-sm"></div>
          </div>
        ))}
      </div>

      {/* MAIN VISUALIZATION (Full width chart) */}
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm h-90 flex flex-col justify-end gap-2">
         {/* Faux Chart Bars */}
         <div className="flex items-end gap-4 h-full pt-10">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="w-full bg-slate-100 rounded-t-sm" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
            ))}
         </div>
      </div>

      {/* WORKFORCE SEGMENTATION (3 Columns) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-56 bg-slate-200 rounded-md"></div>
          <div className="h-8 w-32 bg-slate-100 rounded-md"></div>
        </div>
        
        <div className="grid grid-cols-3 gap-8">
          {[1, 2, 3].map((col) => (
            <div key={col} className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-125">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="h-4 w-24 bg-slate-200 rounded-sm"></div>
                <div className="h-5 w-8 bg-slate-200 rounded-full"></div>
              </div>
              <div className="p-4 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0"></div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ANALYTICS SECTION (2 cols + 3 cols) */}
      <div className="pt-6 border-t border-slate-200 space-y-8">
        <div>
          <div className="h-6 w-48 bg-slate-200 rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-slate-100 rounded-md"></div>
        </div>

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm h-100 flex items-center justify-center">
             <div className="w-48 h-48 rounded-full border-8 border-slate-100"></div>
          </div>
          <div className="col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm h-100 p-8 flex flex-col justify-end">
             <div className="flex items-end gap-6 h-full pt-10">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="w-full bg-slate-100 rounded-t-sm" style={{ height: `${Math.max(30, Math.random() * 100)}%` }}></div>
                ))}
             </div>
          </div>
        </div>
      </div>

    </div>
  );
}