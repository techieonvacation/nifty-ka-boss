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

export default function Test() {
  const [firstDataItem, setFirstDataItem] = useState<unknown>(null);
  const [decisions, setDecisions] = useState<unknown[]>([]);
  const [niftyMovement, setNiftyMovement] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [dataStats, setDataStats] = useState<{
    totalRecords?: number | string;
    totalDecisions?: number | string;
    totalNiftyMovement?: number | string;
  }>({});

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

  const handleFetchAll = async () => {
    setLoading(true);
    setError("");

    try {
      // Fetch all data in parallel
      const [dataResponse, decisionsResponse, niftyMovementResponse] =
        await Promise.all([
          fetch("/api/rkb/fetch-data"),
          fetch("/api/rkb/fetch-decisions"),
          fetch("/api/rkb/nifty-movement"),
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

      if (errors.length > 0) {
        setError(errors.join("; "));
        return;
      }

      const dataResult: FetchDataResponse = await dataResponse.json();
      const decisionsResult: FetchDecisionsResponse =
        await decisionsResponse.json();
      const niftyMovementResult: FetchNiftyMovementResponse =
        await niftyMovementResponse.json();

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
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">RKB API Test</h1>

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
        <div className="space-x-4">
          <button
            onClick={handleFetchAll}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
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
        dataStats.totalNiftyMovement) && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Data Statistics
          </h3>
          <div className="text-sm text-green-700 space-y-1">
            {dataStats.totalRecords && (
              <p>• Total Records Available: {dataStats.totalRecords}</p>
            )}
            {dataStats.totalDecisions && (
              <p>• Total Decisions Available: {dataStats.totalDecisions}</p>
            )}
            {dataStats.totalNiftyMovement && (
              <p>
                • Total Nifty Movement Records: {dataStats.totalNiftyMovement}
              </p>
            )}
          </div>
        </div>
      )}

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
