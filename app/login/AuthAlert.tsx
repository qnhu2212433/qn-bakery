"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

function AlertContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <>
      {error && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold rounded-xl">
          ⚠️ Lỗi: {decodeURIComponent(error)}
        </div>
      )}
      {message && (
        <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-xl">
          🎉 {decodeURIComponent(message)}
        </div>
      )}
    </>
  );
}

export default function AuthAlert() {
  return (
    <Suspense
      fallback={
        <div className="mb-4 h-5 bg-slate-100 animate-pulse rounded-xl" />
      }
    >
      <AlertContent />
    </Suspense>
  );
}
