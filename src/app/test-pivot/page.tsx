"use client";

import { useSession } from "next-auth/react";
import NiftyKaBossChart from "@/components/NiftyKaBossChart";

export default function TestPivotPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Pivot Management Test</h1>
          
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-2">Session Status</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Email:</strong> {session?.user?.email || "Not logged in"}</p>
              <p><strong>Role:</strong> {session?.user?.role || "No role"}</p>
              <p><strong>Is Admin:</strong> {session?.user?.role === "admin" ? "Yes" : "No"}</p>
            </div>
          </div>

          {session?.user?.role === "admin" ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <h3 className="text-green-800 font-semibold">Admin Access Granted</h3>
              <p className="text-green-700 text-sm">
                You should see the "Pivot Management" button in the chart header.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-800 font-semibold">Admin Access Required</h3>
              <p className="text-yellow-700 text-sm">
                Please login with admin credentials: admin@niftykaboss.com / admin123
              </p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Nifty Chart with Pivot Management</h2>
            <p className="text-sm text-gray-600">
              If you're logged in as admin, you'll see a "Pivot Management" button in the header.
            </p>
          </div>
          <div className="h-[600px]">
            <NiftyKaBossChart
              symbol="NIFTY"
              exchange="NSE"
              interval="1D"
              height={600}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 