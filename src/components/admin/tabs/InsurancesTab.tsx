import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import { authFetch } from "@/src/lib/authFetch";

interface Insurance {
  _id?: string;
  name: string;
  isActive: boolean;
}

export const InsurancesTab = () => {
  const [insurances, setInsurances] = useState<Insurance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingInsurance, setEditingInsurance] = useState<Partial<Insurance>>({});
  const [error, setError] = useState("");

  const fetchInsurances = async () => {
    try {
      setIsLoading(true);
      const res = await authFetch("/api/insurances");
      if (res.ok) {
        const data = await res.json();
        setInsurances(data);
      }
    } catch (err) {
      console.error("Failed to fetch insurances", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsurances();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInsurance.name) {
      setError("Please provide an insurance name.");
      return;
    }

    try {
      if (editingInsurance._id) {
        const response = await authFetch(`/api/insurances/${editingInsurance._id}`, {
          method: "PUT",
          body: JSON.stringify(editingInsurance),
        });
        if (response.ok) {
          fetchInsurances();
          setIsEditing(false);
          setEditingInsurance({});
        } else {
          setError("Failed to update insurance");
        }
      } else {
        const response = await authFetch("/api/insurances", {
          method: "POST",
          body: JSON.stringify({ ...editingInsurance, isActive: true }),
        });
        if (response.ok) {
          fetchInsurances();
          setIsEditing(false);
          setEditingInsurance({});
        } else {
          setError("Failed to create insurance");
        }
      }
    } catch (err) {
      console.error("Save error", err);
      setError("An error occurred");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this insurance?")) return;
    try {
      const response = await authFetch(`/api/insurances/${id}`, { method: "DELETE" });
      if (response.ok) fetchInsurances();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  const toggleStatus = async (insurance: Insurance) => {
    try {
      const response = await authFetch(`/api/insurances/${insurance._id}`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !insurance.isActive }),
      });
      if (response.ok) fetchInsurances();
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Insurance Tie-ups</h2>
        {!isEditing && (
          <Button onClick={() => { setIsEditing(true); setEditingInsurance({}); setError(""); }}>
            <Plus className="w-4 h-4 mr-2" /> Add Insurance
          </Button>
        )}
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingInsurance._id ? "Edit Insurance" : "Add Insurance"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {error && <div className="text-red-500">{error}</div>}
              <div>
                <label className="text-sm font-medium mb-1 block">Insurance Provider Name</label>
                <Input
                  value={editingInsurance.name || ""}
                  onChange={(e) => setEditingInsurance({ ...editingInsurance, name: e.target.value })}
                  placeholder="E.g., Aditya Birla Health Insurance Co. Ltd."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {insurances.map((ins) => (
                <tr key={ins._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{ins.name}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(ins)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        ins.isActive
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {ins.isActive ? (
                        <><CheckCircle className="w-3.5 h-3.5" /> Active</>
                      ) : (
                        <><XCircle className="w-3.5 h-3.5" /> Inactive</>
                      )}
                    </button>
                  </td>
                  <td className="p-4 flex items-center justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => { setEditingInsurance(ins); setIsEditing(true); setError(""); }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => ins._id && handleDelete(ins._id)} className="text-red-500 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {insurances.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    No insurance providers added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
