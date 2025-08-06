"use client";

import { useState } from "react";

interface FetchDataResponse {
  success: boolean;
  data?: unknown[];
  message: string;
  error?: string;
  totalRecords?: number | string;
  details?: Record<string, unknown>;
}

interface FetchDecisionsResponse {
  success: boolean;
  decisions?: unknown[];
  message: string;
  error?: string;
  totalDecisions?: number | string;
  details?: Record<string, unknown>;
}

interface FetchNiftyMovementResponse {
  success: boolean;
  data?: unknown[];
  message: string;
  error?: string;
  totalRecords?: number | string;
  details?: Record<string, unknown>;
}

interface PivotData {
  id: number;
  symbol: string;
  support: number;
  resistance: number;
  created_at?: string;
  updated_at?: string;
  isdelete?: number;
}

interface GetPivotsResponse {
  success: boolean;
  pivots?: PivotData[];
  message: string;
  error?: string;
  totalPivots?: number | string;
  details?: Record<string, unknown>;
}

interface InsertPivotResponse {
  success: boolean;
  data?: unknown;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

interface UpdatePivotResponse {
  success: boolean;
  data?: unknown;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}

export default function Test() {
  const [firstDataItem, setFirstDataItem] = useState<unknown>(null);
  const [decisions, setDecisions] = useState<unknown[]>([]);
  const [niftyMovement, setNiftyMovement] = useState<unknown[]>([]);
  const [pivots, setPivots] = useState<PivotData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [dataStats, setDataStats] = useState<{
    totalRecords?: number | string;
    totalDecisions?: number | string;
    totalNiftyMovement?: number | string;
    totalPivots?: number | string;
  }>({});

  // Pivot form state
  const [pivotForm, setPivotForm] = useState({
    symbol: "BANKNIFTY",
    support: 44000.50,
    resistance: 44500.75,
  });
  const [updatePivotForm, setUpdatePivotForm] = useState({
    id: 1,
    isdelete: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Fetching RKB data (first index only)...");
      const response = await fetch("/api/rkb/fetch-data", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error:", response.status, errorText);
        setError(`HTTP ${response.status}: ${errorText}`);
        return;
      }

      const data: FetchDataResponse = await response.json();

      if (
        data.success &&
        data.data &&
        Array.isArray(data.data) &&
        data.data.length > 0
      ) {
        // Only take the first index
        setFirstDataItem(data.data[0]);
        setDataStats((prev) => ({ ...prev, totalRecords: data.totalRecords }));
        console.log("First data item fetched:", data.data[0]);
        console.log("Total records available:", data.totalRecords);
      } else {
        const errorMsg = data.error || data.message || "No data available";
        setError(errorMsg);
        console.error("Fetch data failed:", errorMsg);
        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Fetch data request failed";
      setError(errorMsg);
      console.error("Fetch data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDecisions = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Fetching RKB decisions...");
      const response = await fetch("/api/rkb/fetch-decisions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error:", response.status, errorText);
        setError(`HTTP ${response.status}: ${errorText}`);
        return;
      }

      const data: FetchDecisionsResponse = await response.json();

      if (data.success && data.decisions && Array.isArray(data.decisions)) {
        setDecisions(data.decisions);
        setDataStats((prev) => ({
          ...prev,
          totalDecisions: data.totalDecisions,
        }));
        console.log("Decisions fetched:", data.decisions);
        console.log("Total decisions available:", data.totalDecisions);
      } else {
        const errorMsg = data.error || data.message || "No decisions available";
        setError(errorMsg);
        console.error("Fetch decisions failed:", errorMsg);
        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Fetch decisions request failed";
      setError(errorMsg);
      console.error("Fetch decisions error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNiftyMovement = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Fetching Nifty movement data...");
      const response = await fetch("/api/rkb/nifty-movement", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error:", response.status, errorText);
        setError(`HTTP ${response.status}: ${errorText}`);
        return;
      }

      const data: FetchNiftyMovementResponse = await response.json();

      if (data.success && data.data && Array.isArray(data.data)) {
        setNiftyMovement(data.data);
        setDataStats((prev) => ({
          ...prev,
          totalNiftyMovement: data.totalRecords,
        }));
        console.log("Nifty movement data fetched:", data.data);
        console.log(
          "Total Nifty movement records available:",
          data.totalRecords
        );
      } else {
        const errorMsg =
          data.error || data.message || "No Nifty movement data available";
        setError(errorMsg);
        console.error("Fetch Nifty movement failed:", errorMsg);
        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Fetch Nifty movement request failed";
      setError(errorMsg);
      console.error("Fetch Nifty movement error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPivots = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Fetching RKB pivots...");
      const response = await fetch("/api/rkb/get-all-pivots", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error:", response.status, errorText);
        setError(`HTTP ${response.status}: ${errorText}`);
        return;
      }

      const data: GetPivotsResponse = await response.json();

      if (data.success && data.pivots && Array.isArray(data.pivots)) {
        setPivots(data.pivots);
        setDataStats((prev) => ({
          ...prev,
          totalPivots: data.totalPivots,
        }));
        console.log("Pivots fetched:", data.pivots);
        console.log("Total pivots available:", data.totalPivots);
      } else {
        const errorMsg = data.error || data.message || "No pivots available";
        setError(errorMsg);
        console.error("Fetch pivots failed:", errorMsg);
        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Fetch pivots request failed";
      setError(errorMsg);
      console.error("Fetch pivots error:", err);
    } finally {
      setLoading(false);
    }
  };

  const insertPivot = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Inserting pivot data...", pivotForm);
      const response = await fetch("/api/rkb/insert-pivot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pivotForm),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error:", response.status, errorText);
        setError(`HTTP ${response.status}: ${errorText}`);
        return;
      }

      const data: InsertPivotResponse = await response.json();

      if (data.success) {
        console.log("Pivot inserted successfully:", data);
        // Refresh pivots list
        await fetchPivots();
      } else {
        const errorMsg = data.error || data.message || "Failed to insert pivot";
        setError(errorMsg);
        console.error("Insert pivot failed:", errorMsg);
        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Insert pivot request failed";
      setError(errorMsg);
      console.error("Insert pivot error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updatePivot = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Updating pivot data...", updatePivotForm);
      const response = await fetch(`/api/rkb/update-pivot/${updatePivotForm.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isdelete: updatePivotForm.isdelete }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("HTTP error:", response.status, errorText);
        setError(`HTTP ${response.status}: ${errorText}`);
        return;
      }

      const data: UpdatePivotResponse = await response.json();

      if (data.success) {
        console.log("Pivot updated successfully:", data);
        // Refresh pivots list
        await fetchPivots();
      } else {
        const errorMsg = data.error || data.message || "Failed to update pivot";
        setError(errorMsg);
        console.error("Update pivot failed:", errorMsg);
        if (data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Update pivot request failed";
      setError(errorMsg);
      console.error("Update pivot error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch all data in parallel
      const [dataResponse, decisionsResponse, niftyMovementResponse, pivotsResponse] =
        await Promise.all([
          fetch("/api/rkb/fetch-data"),
          fetch("/api/rkb/fetch-decisions"),
          fetch("/api/rkb/nifty-movement"),
          fetch("/api/rkb/get-all-pivots"),
        ]);

      // Check for HTTP errors first
      const errors: string[] = [];

      if (!dataResponse.ok) {
        const errorText = await dataResponse.text();
        errors.push(`Data API: HTTP ${dataResponse.status}: ${errorText}`);
      }

      if (!decisionsResponse.ok) {
        const errorText = await decisionsResponse.text();
        errors.push(
          `Decisions API: HTTP ${decisionsResponse.status}: ${errorText}`
        );
      }

      if (!niftyMovementResponse.ok) {
        const errorText = await niftyMovementResponse.text();
        errors.push(
          `Nifty Movement API: HTTP ${niftyMovementResponse.status}: ${errorText}`
        );
      }

      if (!pivotsResponse.ok) {
        const errorText = await pivotsResponse.text();
        errors.push(
          `Pivots API: HTTP ${pivotsResponse.status}: ${errorText}`
        );
      }

      if (errors.length > 0) {
        setError(errors.join("; "));
        return;
      }

      const dataResult: FetchDataResponse = await dataResponse.json();
      const decisionsResult: FetchDecisionsResponse =
        await decisionsResponse.json();
      const niftyMovementResult: FetchNiftyMovementResponse =
        await niftyMovementResponse.json();
      const pivotsResult: GetPivotsResponse = await pivotsResponse.json();

      // Handle data results
      if (
        dataResult.success &&
        dataResult.data &&
        Array.isArray(dataResult.data) &&
        dataResult.data.length > 0
      ) {
        setFirstDataItem(dataResult.data[0]);
        setDataStats((prev) => ({
          ...prev,
          totalRecords: dataResult.totalRecords,
        }));
        console.log("First data item fetched:", dataResult.data[0]);
      } else {
        const dataError =
          dataResult.error || dataResult.message || "No data available";
        errors.push(`Data: ${dataError}`);
        if (dataResult.details) {
          console.error("Data error details:", dataResult.details);
        }
      }

      // Handle decisions results
      if (
        decisionsResult.success &&
        decisionsResult.decisions &&
        Array.isArray(decisionsResult.decisions)
      ) {
        setDecisions(decisionsResult.decisions);
        setDataStats((prev) => ({
          ...prev,
          totalDecisions: decisionsResult.totalDecisions,
        }));
        console.log("Decisions fetched:", decisionsResult.decisions);
      } else {
        const decisionsError =
          decisionsResult.error ||
          decisionsResult.message ||
          "No decisions available";
        errors.push(`Decisions: ${decisionsError}`);
        if (decisionsResult.details) {
          console.error("Decisions error details:", decisionsResult.details);
        }
      }

      // Handle Nifty movement results
      if (
        niftyMovementResult.success &&
        niftyMovementResult.data &&
        Array.isArray(niftyMovementResult.data)
      ) {
        setNiftyMovement(niftyMovementResult.data);
        setDataStats((prev) => ({
          ...prev,
          totalNiftyMovement: niftyMovementResult.totalRecords,
        }));
        console.log("Nifty movement data fetched:", niftyMovementResult.data);
      } else {
        const niftyMovementError =
          niftyMovementResult.error ||
          niftyMovementResult.message ||
          "No Nifty movement data available";
        errors.push(`Nifty Movement: ${niftyMovementError}`);
        if (niftyMovementResult.details) {
          console.error(
            "Nifty movement error details:",
            niftyMovementResult.details
          );
        }
      }

      // Handle pivots results
      if (
        pivotsResult.success &&
        pivotsResult.pivots &&
        Array.isArray(pivotsResult.pivots)
      ) {
        setPivots(pivotsResult.pivots);
        setDataStats((prev) => ({
          ...prev,
          totalPivots: pivotsResult.totalPivots,
        }));
        console.log("Pivots fetched:", pivotsResult.pivots);
      } else {
        const pivotsError =
          pivotsResult.error ||
          pivotsResult.message ||
          "No pivots available";
        errors.push(`Pivots: ${pivotsError}`);
        if (pivotsResult.details) {
          console.error("Pivots error details:", pivotsResult.details);
        }
      }

      if (errors.length > 0) {
        setError(errors.join("; "));
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Fetch request failed";
      setError(errorMsg);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">RKB API Test Dashboard</h1>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">
          API Information
        </h2>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • <strong>Fetch Data:</strong> Gets all data from 2015 to current
            date (shows first index only)
          </li>
          <li>
            • <strong>Fetch Decisions:</strong> Gets all decisions (shows all
            data)
          </li>
          <li>
            • <strong>Fetch Nifty Movement:</strong> Gets last 10 days Nifty
            movement data (except today)
          </li>
          <li>
            • <strong>Pivot Management:</strong> Insert, update, and fetch pivot data
          </li>
          <li>
            • <strong>Authentication:</strong> Automatically handled by backend
            with JWT tokens
          </li>
          <li>
            • <strong>Data Source:</strong> https://rkbforu.com:9026/ (RKB Data)
            | https://rkbforu.com:9031/ (Nifty Movement)
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={handleFetchAll}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded font-medium"
          >
            {loading ? "Loading..." : "Fetch All Data"}
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            Fetch Data Only
          </button>
          <button
            onClick={fetchDecisions}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            Fetch Decisions Only
          </button>
          <button
            onClick={fetchNiftyMovement}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            Fetch Nifty Movement Only
          </button>
          <button
            onClick={fetchPivots}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            Fetch Pivots Only
          </button>
        </div>
      </div>

      {/* Pivot Management Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pivot Management</h2>
        
        {/* Insert Pivot Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-800">Insert New Pivot</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symbol
                </label>
                <select
                  value={pivotForm.symbol}
                  onChange={(e) => setPivotForm({ ...pivotForm, symbol: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BANKNIFTY">BANKNIFTY</option>
                  <option value="NIFTY">NIFTY</option>
                  <option value="FINNIFTY">FINNIFTY</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pivotForm.support}
                  onChange={(e) => setPivotForm({ ...pivotForm, support: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resistance
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={pivotForm.resistance}
                  onChange={(e) => setPivotForm({ ...pivotForm, resistance: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={insertPivot}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium"
              >
                {loading ? "Inserting..." : "Insert Pivot"}
              </button>
            </div>
          </div>

          {/* Update Pivot Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3 text-gray-800">Update/Delete Pivot</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pivot ID
                </label>
                <input
                  type="number"
                  value={updatePivotForm.id}
                  onChange={(e) => setUpdatePivotForm({ ...updatePivotForm, id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Action
                </label>
                <select
                  value={updatePivotForm.isdelete}
                  onChange={(e) => setUpdatePivotForm({ ...updatePivotForm, isdelete: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Update (isdelete = 0)</option>
                  <option value={1}>Delete (isdelete = 1)</option>
                </select>
              </div>
              <button
                onClick={updatePivot}
                disabled={loading}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded font-medium"
              >
                {loading ? "Updating..." : "Update Pivot"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Stats Display */}
      {(dataStats.totalRecords ||
        dataStats.totalDecisions ||
        dataStats.totalNiftyMovement ||
        dataStats.totalPivots) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Data Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-green-700">
            {dataStats.totalRecords && (
              <div className="bg-white p-3 rounded border">
                <strong>Total Records:</strong> {dataStats.totalRecords}
              </div>
            )}
            {dataStats.totalDecisions && (
              <div className="bg-white p-3 rounded border">
                <strong>Total Decisions:</strong> {dataStats.totalDecisions}
              </div>
            )}
            {dataStats.totalNiftyMovement && (
              <div className="bg-white p-3 rounded border">
                <strong>Nifty Movement Records:</strong> {dataStats.totalNiftyMovement}
              </div>
            )}
            {dataStats.totalPivots && (
              <div className="bg-white p-3 rounded border">
                <strong>Total Pivots:</strong> {dataStats.totalPivots}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pivots Display */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Pivot Data</h2>
        {pivots.length > 0 ? (
          <div className="space-y-4">
            <div className="mb-2 text-sm text-gray-600">
              Showing {pivots.length} pivots of {dataStats.totalPivots || "unknown"} total
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pivots.map((pivot, index) => (
                <div key={pivot.id || index} className="bg-gray-50 p-4 rounded border">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-sm">{pivot.symbol}</h3>
                    <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                      ID: {pivot.id}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Support:</span>
                      <span className="font-medium text-green-600">{pivot.support}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Resistance:</span>
                      <span className="font-medium text-red-600">{pivot.resistance}</span>
                    </div>
                    {pivot.created_at && (
                      <div className="text-xs text-gray-500">
                        Created: {new Date(pivot.created_at).toLocaleDateString()}
                      </div>
                    )}
                    {pivot.isdelete !== undefined && (
                      <div className="text-xs">
                        <span className={`px-2 py-1 rounded ${
                          pivot.isdelete === 1 
                            ? "bg-red-100 text-red-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {pivot.isdelete === 1 ? "Deleted" : "Active"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            No pivot data available. Click "Fetch All Data" or "Fetch Pivots Only" to load pivots.
          </p>
        )}
      </div>

      {/* First Data Item Display */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          First Data Item (2015 to Current)
        </h2>
        {firstDataItem ? (
          <div className="bg-gray-50 p-4 rounded">
            <div className="mb-2 text-sm text-gray-600">
              Showing first index of {dataStats.totalRecords || "unknown"} total
              records
            </div>
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(firstDataItem, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-gray-500">
            No data available. Click "Fetch All Data" or "Fetch Data Only" to
            load data.
          </p>
        )}
      </div>

      {/* Decisions Display */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">All Decisions</h2>
        {decisions.length > 0 ? (
          <div className="space-y-4 overflow-auto max-h-96">
            <div className="mb-2 text-sm text-gray-600">
              Showing {decisions.length} decisions of{" "}
              {dataStats.totalDecisions || "unknown"} total
            </div>
            {decisions.map((decision, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded border">
                <h3 className="font-medium mb-2">Decision {index + 1}</h3>
                <pre className="text-sm overflow-auto max-h-64">
                  {JSON.stringify(decision, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No decisions available. Click "Fetch All Data" or "Fetch Decisions
            Only" to load decisions.
          </p>
        )}
      </div>

      {/* Nifty Movement Display */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Nifty Movement Data (Last 10 Days)
        </h2>
        {niftyMovement.length > 0 ? (
          <div className="space-y-4">
            <div className="mb-2 text-sm text-gray-600">
              Showing {niftyMovement.length} days of Nifty movement data
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {niftyMovement.map((item, index) => {
                const niftyItem = item as Record<string, unknown>;
                return (
                  <div key={index} className="bg-gray-50 p-4 rounded border">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-sm">{niftyItem.date as string}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          (niftyItem.change as string)?.startsWith("+")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {niftyItem.change as string}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {niftyItem.percent_change as string}
                    </div>
                    <details className="mt-2">
                      <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                        View Raw Data
                      </summary>
                      <pre className="text-xs mt-2 bg-white p-2 rounded border overflow-auto max-h-32">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </details>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">
            No Nifty movement data available. Click "Fetch All Data" or "Fetch
            Nifty Movement Only" to load data.
          </p>
        )}
      </div>
    </div>
  );
}
