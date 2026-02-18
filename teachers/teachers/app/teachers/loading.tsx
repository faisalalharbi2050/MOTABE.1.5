export default function TeachersLoading() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-6 lg:p-10" dir="rtl">
      <div className="animate-pulse space-y-6">
        {/* Page Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
        
        {/* Tabs Skeleton */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex gap-4">
            <div className="h-10 bg-gray-200 rounded-lg w-32"></div>
            <div className="h-10 bg-gray-100 rounded-lg w-32"></div>
            <div className="h-10 bg-gray-100 rounded-lg w-32"></div>
          </div>
        </div>
        
        {/* Table Skeleton */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
                <div className="h-12 bg-gray-100 rounded w-32"></div>
                <div className="h-12 bg-gray-100 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
