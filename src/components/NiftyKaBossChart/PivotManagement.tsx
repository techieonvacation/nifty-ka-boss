"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { MdAdd } from "react-icons/md";

interface PivotData {
  id: number;
  symbol: string;
  support: number;
  resistance: number;
  created_at?: string;
  updated_at?: string;
  isdelete?: number;
}

interface PivotManagementProps {
  theme: boolean;
  symbol: string;
  onSupportChange?: (support: number) => void;
  onResistanceChange?: (resistance: number) => void;
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
  const [formData, setFormData] = useState({
    symbol: symbol,
    support: "",
    resistance: "",
  });

  // Fetch all pivots
  const fetchPivots = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/rkb/get-all-pivots");
      const data = await response.json();

      if (data.success) {
        setPivots(data.pivots);
        // Find current symbol's pivot and update parent
        const currentPivot = data.pivots.find(
          (p: PivotData) => p.symbol === symbol
        );
        if (currentPivot) {
          onSupportChange?.(currentPivot.support);
          onResistanceChange?.(currentPivot.resistance);
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
  };

  // Load pivots on mount
  useEffect(() => {
    fetchPivots();
  }, [symbol]);

  // Reset form
  const resetForm = () => {
    setFormData({
      symbol: symbol,
      support: "",
      resistance: "",
    });
    setEditingPivot(null);
    setError(null);
    setSuccess(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.support || !formData.resistance) {
      setError("Please fill in all fields");
      return;
    }

    const support = parseFloat(formData.support);
    const resistance = parseFloat(formData.resistance);

    if (isNaN(support) || isNaN(resistance)) {
      setError("Please enter valid numbers");
      return;
    }

    if (support >= resistance) {
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
              support,
              resistance,
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
            support,
            resistance,
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

  // Handle edit with event prevention
  const handleEdit = (e: React.MouseEvent, pivot: PivotData) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPivot(pivot);
    setFormData({
      symbol: pivot.symbol,
      support: pivot.support.toString(),
      resistance: pivot.resistance.toString(),
    });
    setDialogOpen(true);
  };

  // Handle modal open with event prevention
  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDialogOpen(true);
  };

  // Get current symbol's pivot
  const currentPivot = pivots.find((p) => p.symbol === symbol);

  return (
    <>
      {/* Single Button in Header */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenModal}
        leftIcon={<MdAdd className="size-5" />}
        className={`flex items-center  ${
          theme
            ? "bg-purple-900/20 hover:bg-purple-900/30 text-purple-300 border-purple-700/30"
            : "bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-300"
        }`}
      >
        RKB Pivot
      </Button>

      {/* Comprehensive Modal Popup */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className={`max-w-2xl max-h-[80vh] overflow-y-auto ${
            theme
              ? "bg-white border-gray-200 text-gray-900"
              : "bg-gray-900 border-gray-700 text-white"
          }`}
        >
          <DialogHeader className="relative">
            <DialogTitle
              className={`text-xl font-bold text-center ${
                theme ? "text-gray-900" : "text-white"
              }`}
            >
              Add/Modify RKB Pivot
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Pivot Section */}
            {currentPivot && (
              <div
                className={`p-4 rounded-lg border ${
                  theme
                    ? "bg-green-50 border-green-200"
                    : "bg-green-900/20 border-green-700/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div
                      className={`text-lg font-medium ${
                        theme ? "text-green-800" : "text-green-300"
                      }`}
                    >
                      Current Pivot for {symbol}
                    </div>
                    <div className="text-sm text-green-600 mt-1">
                      Support: {currentPivot.support.toFixed(2)} | Resistance:{" "}
                      {currentPivot.resistance.toFixed(2)}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => handleEdit(e, currentPivot)}
                    className="text-xs"
                  >
                    <Edit size={12} />
                  </Button>
                </div>
              </div>
            )}

            {/* Add/Edit Form */}
            {(editingPivot || !currentPivot) && (
              <div
                className={`p-4 rounded-lg border ${
                  theme
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-yellow-900/20 border-yellow-700/30"
                }`}
              >
                <h3
                  className={`text-lg font-medium mb-4 ${
                    theme ? "text-yellow-800" : "text-yellow-300"
                  }`}
                >
                  {editingPivot ? "Edit Pivot" : "Add New Pivot"}
                </h3>

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
                      readOnly
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
                      Support
                    </Label>
                    <Input
                      id="support"
                      type="number"
                      step="0.01"
                      value={formData.support}
                      onChange={(e) =>
                        setFormData({ ...formData, support: e.target.value })
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
                      htmlFor="resistance"
                      className={`${theme ? "text-gray-700" : "text-gray-300"}`}
                    >
                      Resistance
                    </Label>
                    <Input
                      id="resistance"
                      type="number"
                      step="0.01"
                      value={formData.resistance}
                      onChange={(e) =>
                        setFormData({ ...formData, resistance: e.target.value })
                      }
                      className={`${
                        theme
                          ? "bg-white border-gray-300 text-gray-900"
                          : "bg-gray-800 border-gray-600 text-white"
                      }`}
                      required
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
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PivotManagement;
