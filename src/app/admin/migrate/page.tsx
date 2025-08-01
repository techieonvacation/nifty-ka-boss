"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function MigratePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const runMigration = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/migrate-slugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.message || "Migration completed successfully");
      } else {
        setResult(`Error: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      setResult(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Blog Migration Tool</h1>
      <p className="mb-4">
        This tool will update all existing blog posts to include slug URLs based
        on their titles.
      </p>
      <Button onClick={runMigration} disabled={isLoading} className="mb-4">
        {isLoading ? "Running Migration..." : "Run Migration"}
      </Button>

      {result && (
        <div
          className={`p-4 rounded ${
            result.includes("Error") ? "bg-red-100" : "bg-green-100"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
}
