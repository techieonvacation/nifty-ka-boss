"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Edit,
  Loader2,
  AlertCircle,
  CheckCircle,
  Trash2,
  Plus,
} from "lucide-react";

interface PivotData {
  id: number;
  symbol: string;
  support?: number;
  resistance?: number;
  created_at?: string;
  updated_at?: string;
  isdelete?: number;
}

interface PivotManagementProps {
  theme: boolean;
  symbol: string;
  onSupportChange?: (support: number | undefined) => void;
  onResistanceChange?: (resistance: number | undefined) => void;
}

const PivotManagement: React.FC<PivotManagementProps> = ({
  theme,
  symbol,
  onSupportChange,
  onResistanceChange,
}) => {
  const [pivots, setPivots] = useState<PivotData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPivot, setEditingPivot] = useState<PivotData | null>(null);
  const [, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    symbol: symbol,
    support: "",
    resistance: "",
  });

  // Fetch all pivots
  const fetchPivots = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/rkb/get-all-pivots");
      const data = await response.json();

      if (data.success) {
        const activePivots = data.pivots.filter(
          (p: PivotData) => p.isdelete !== 1
        );
        setPivots(activePivots);

        // Find current symbol's pivot and update parent
        const currentPivot = activePivots.find(
          (p: PivotData) => p.symbol === symbol
        );
        if (currentPivot) {
          onSupportChange?.(currentPivot.support);
          onResistanceChange?.(currentPivot.resistance);
        } else {
          onSupportChange?.(undefined);
          onResistanceChange?.(undefined);
        }
      } else {
        setError(data.message || "Failed to fetch pivots");
      }
    } catch (err) {
      setError("Failed to fetch pivots");
      console.error("Error fetching pivots:", err);
    } finally {
      setLoading(false);
    }
  }, [symbol, onSupportChange, onResistanceChange]);

  // Load pivots on mount
  useEffect(() => {
    fetchPivots();
  }, [symbol, fetchPivots]);

  // Reset form
  const resetForm = () => {
    setFormData({
      symbol: symbol,
      support: "",
      resistance: "",
    });
    setEditingPivot(null);
    setIsAddingNew(false);
    setError(null);
    setSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one field is provided
    if (!formData.support && !formData.resistance) {
      setError("Please provide at least support or resistance value");
      return;
    }

    const support = formData.support ? parseFloat(formData.support) : undefined;
    const resistance = formData.resistance
      ? parseFloat(formData.resistance)
      : undefined;

    if (support !== undefined && isNaN(support)) {
      setError("Please enter a valid support number");
      return;
    }

    if (resistance !== undefined && isNaN(resistance)) {
      setError("Please enter a valid resistance number");
      return;
    }

    // If both values are provided, ensure support < resistance
    if (
      support !== undefined &&
      resistance !== undefined &&
      support >= resistance
    ) {
      setError("Support must be less than Resistance");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (editingPivot) {
        // Update existing pivot
        const response = await fetch(
          `/api/rkb/update-pivot/${editingPivot.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              symbol: formData.symbol,
              ...(support !== undefined && { support }),
              ...(resistance !== undefined && { resistance }),
            }),
          }
        );

        const data = await response.json();
        if (data.success) {
          setSuccess("Pivot updated successfully");
          fetchPivots();
          resetForm();
          setTimeout(() => {
            setDialogOpen(false);
            setSuccess(null);
          }, 1500);
        } else {
          setError(data.message || "Failed to update pivot");
        }
      } else {
        // Insert new pivot
        const response = await fetch("/api/rkb/insert-pivot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            symbol: formData.symbol,
            ...(support !== undefined && { support }),
            ...(resistance !== undefined && { resistance }),
          }),
        });

        const data = await response.json();
        if (data.success) {
          setSuccess("Pivot added successfully");
          fetchPivots();
          resetForm();
          setTimeout(() => {
            setDialogOpen(false);
            setSuccess(null);
          }, 1500);
        } else {
          setError(data.message || "Failed to add pivot");
        }
      }
    } catch (err) {
      setError("Failed to save pivot");
      console.error("Error saving pivot:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete pivot
  const handleDelete = async (pivot: PivotData) => {
    if (
      !confirm(`Are you sure you want to delete the pivot for ${pivot.symbol}?`)
    ) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/rkb/update-pivot/${pivot.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isdelete: 1,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess("Pivot deleted successfully");
        fetchPivots();
        setTimeout(() => {
          setSuccess(null);
        }, 1500);
      } else {
        setError(data.message || "Failed to delete pivot");
      }
    } catch (err) {
      setError("Failed to delete pivot");
      console.error("Error deleting pivot:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (pivot: PivotData) => {
    setEditingPivot(pivot);
    setIsAddingNew(false);
    setFormData({
      symbol: pivot.symbol,
      support: pivot.support?.toString() || "",
      resistance: pivot.resistance?.toString() || "",
    });
    setDialogOpen(true);
  };

  // Handle add new
  const handleAddNew = () => {
    setEditingPivot(null);
    setIsAddingNew(true);
    setFormData({
      symbol: symbol,
      support: "",
      resistance: "",
    });
    setDialogOpen(true);
  };

  // Get current symbol's pivot
  const currentPivot = pivots.find((p) => p.symbol === symbol);

  return (
    <>
      {/* Add Button Only */}
      <Button
        variant={"primary"}
        onClick={handleAddNew}
        leftIcon={<Plus size={16} />}
      >
        RKB Pivot
      </Button>

      {/* Pivot Management Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={`max-w-4xl max-h-[90vh] overflow-y-auto ${
            theme
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-gray-900 border-gray-700 text-white"
          }`}
        >
          <DialogHeader>
            <DialogTitle
              className={`text-xl font-bold text-center ${
                theme ? "text-gray-900" : "text-white"
              }`}
            >
              Add/Modify RKB Pivot
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Pivot Display */}
            {currentPivot && (
              <div
                className={`p-4 rounded-lg border ${
                  theme
                    ? "bg-green-50 border-green-200"
                    : "bg-green-900/20 border-green-700/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div
                      className={`text-lg font-medium ${
                        theme ? "text-green-800" : "text-green-300"
                      }`}
                    >
                      Current Pivot for {currentPivot.symbol}
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      {currentPivot.support && (
                        <div className="text-green-600">
                          Support: {currentPivot.support.toFixed(2)}
                        </div>
                      )}
                      {currentPivot.resistance && (
                        <div className="text-orange-600">
                          Resistance: {currentPivot.resistance.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(currentPivot)}
                      className="text-xs"
                    >
                      <Edit size={12} />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(currentPivot)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* All Pivots List */}
            {/* {pivots.length > 0 && (
              <div
                className={`rounded-lg border ${
                  theme
                    ? "bg-gray-50 border-gray-200"
                    : "bg-gray-800 border-gray-700"
                }`}
              >
                <div
                  className={`p-3 border-b ${
                    theme ? "border-gray-200" : "border-gray-700"
                  }`}
                >
                  <h4
                    className={`font-medium ${
                      theme ? "text-gray-900" : "text-white"
                    }`}
                  >
                    All Pivots ({pivots.length})
                  </h4>
                </div>
                <div className="divide-y max-h-60 overflow-y-auto">
                  {pivots.map((pivot) => (
                    <div
                      key={pivot.id}
                      className={`p-3 flex items-center justify-between ${
                        theme ? "hover:bg-gray-100" : "hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            theme ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {pivot.symbol}
                        </div>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm">
                          {pivot.support && (
                            <span className="text-green-600">
                              Support: {pivot.support.toFixed(2)}
                            </span>
                          )}
                          {pivot.resistance && (
                            <span className="text-orange-600">
                              Resistance: {pivot.resistance.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(pivot)}
                          className="text-xs"
                        >
                          <Edit size={12} />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(pivot)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Add/Edit Form */}
            <div className="border-t pt-4">
              <h5
                className={`text-lg font-medium mb-4 ${
                  theme ? "text-gray-900" : "text-white"
                }`}
              >
                {editingPivot ? "Edit Pivot" : "Add New Pivot"}
              </h5>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label
                    htmlFor="symbol"
                    className={`${theme ? "text-gray-700" : "text-gray-300"}`}
                  >
                    Symbol
                  </Label>
                  <Input
                    id="symbol"
                    value={formData.symbol}
                    onChange={(e) =>
                      setFormData({ ...formData, symbol: e.target.value })
                    }
                    className={`${
                      theme
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-gray-800 border-gray-600 text-white"
                    }`}
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="support"
                    className={`${theme ? "text-gray-700" : "text-gray-300"}`}
                  >
                    Support (Optional)
                  </Label>
                  <Input
                    id="support"
                    type="number"
                    step="0.01"
                    placeholder="Enter support value"
                    value={formData.support}
                    onChange={(e) =>
                      setFormData({ ...formData, support: e.target.value })
                    }
                    className={`${
                      theme
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-gray-800 border-gray-600 text-white"
                    }`}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="resistance"
                    className={`${theme ? "text-gray-700" : "text-gray-300"}`}
                  >
                    Resistance (Optional)
                  </Label>
                  <Input
                    id="resistance"
                    type="number"
                    step="0.01"
                    placeholder="Enter resistance value"
                    value={formData.resistance}
                    onChange={(e) =>
                      setFormData({ ...formData, resistance: e.target.value })
                    }
                    className={`${
                      theme
                        ? "bg-white border-gray-300 text-gray-900"
                        : "bg-gray-800 border-gray-600 text-white"
                    }`}
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-500 text-sm p-2 bg-red-50 border border-red-200 rounded">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="flex items-center space-x-2 text-green-500 text-sm p-2 bg-green-50 border border-green-200 rounded">
                    <CheckCircle size={14} />
                    <span>{success}</span>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : editingPivot ? (
                      "Update"
                    ) : (
                      "Add"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setDialogOpen(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PivotManagement;
