import { useState } from "react";
import { Card, CardContent } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";

export function LeadsTab({ leads, clicks }: { leads: any[], clicks: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState("All Sources");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const filteredLeads = leads.filter(l => {
    const matchesSearch = (l.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (l.phone || "").includes(searchTerm);
    const matchesSource = filterSource === "All Sources" || 
                          (filterSource === "WhatsApp" ? (l.sourcePage || "").toLowerCase().includes("whatsapp") : 
                           filterSource === "Form" ? !(l.sourcePage || "").toLowerCase().includes("whatsapp") : true);
    const matchesStatus = filterStatus === "All Status" || l.status === filterStatus;
    
    return matchesSearch && matchesSource && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Total Leads</p>
            <p className="text-2xl font-bold">{leads.length}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">New</p>
            <p className="text-2xl font-bold text-orange-600">{leads.filter((l: any) => l.status === 'New').length}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-4 text-center">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">WhatsApp</p>
            <p className="text-2xl font-bold text-green-600">{clicks.filter((c: any) => c.type === 'whatsapp').length}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-slate-800">Recent Enquiries</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Input 
              placeholder="Search name or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full sm:w-[200px]" 
            />
            <select 
              className="h-9 border border-slate-200 rounded-md px-3 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-primary"
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
            >
              <option value="All Sources">All Sources</option>
              <option value="Form">Contact Form</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
            <select 
              className="h-9 border border-slate-200 rounded-md px-3 text-sm text-slate-600 outline-none focus:ring-2 focus:ring-primary"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Name & Contact</th>
                <th className="px-6 py-4 font-medium">Source / Subject</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Assigned To</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLeads.map((lead: any, i: number) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{lead.name}</p>
                    <a href={`tel:${lead.phone}`} className="text-xs text-primary hover:underline">{lead.phone}</a>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-700">{lead.message || "Enquiry"}</p>
                    <p className="text-xs text-slate-500">{lead.sourcePage || "Website"}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="px-6 py-4 text-slate-600">{lead.assignedTo || "-"}</td>
                  <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        lead.status === 'New' ? 'bg-orange-100 text-orange-600' :
                        lead.status === 'Contacted' ? 'bg-blue-100 text-blue-600' :
                        lead.status === 'Interested' ? 'bg-green-100 text-green-600' :
                        lead.status === 'Converted' ? 'bg-emerald-100 text-emerald-600' :
                        'bg-slate-100 text-slate-600'
                      }`}>{lead.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-primary text-xs font-medium" onClick={() => alert("Feature coming soon: View Lead Details")}>View Details</Button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No leads found matching your criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
