import React from "react";

export const MarineLoader = (): React.ReactElement => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-primary-light/20 border-t-primary rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono font-bold uppercase tracking-widest text-primary-light">Syncing systems...</p>
      </div>
    </div>
  );
};
