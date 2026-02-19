import React from "react";

const TodoContainerSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse">
      <div className="w-full bg-gray-100 rounded-xl shadow-sm flex items-center justify-between px-4 py-3 relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-2 bg-gray-400" />
        <div className="flex items-center gap-3 pl-3">
          <div className="w-4 h-4 rounded bg-gray-300" />
          <div className="h-4 w-32 sm:w-48 bg-gray-300 rounded" />
        </div>
        <div className="flex items-center gap-4">
          <div className="w-5 h-5 bg-gray-300 rounded" />
          <div className="w-5 h-5 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
};

export default React.memo(TodoContainerSkeleton);
