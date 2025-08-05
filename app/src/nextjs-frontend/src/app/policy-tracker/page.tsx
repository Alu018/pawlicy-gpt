import { AlertTriangle, Calendar } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { PolicyTable } from "@/components/PolicyTable";

export default function PolicyTracker() {
  return (
    <div className="flex flex-col min-h-screen p-2">
      <h1 className="text-3xl font-bold text-black mb-2">
        Policy Tracker
      </h1>
      <div className="flex-1">
        <p className="text-gray-600 mb-4">
          Manage and track all active policy initiatives
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Total Policies */}
          <div className="bg-[#f9fbf1] p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#8e8e93] mb-1">Total Policies</p>
                <p className="text-2xl font-semibold text-[#000000]">5 Active</p>
              </div>
            </div>
          </div>

          {/* Stage Snapshot */}
          <div className="bg-[#f9fbf1] p-4 rounded-lg">
            <p className="text-sm text-[#8e8e93] mb-3">Stage Snapshot</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-[#fff3cd] text-[#856404] border-[#ffeaa7]">
                Draft 3
              </Badge>
              <Badge variant="secondary" className="bg-[#d1ecf1] text-[#0c5460] border-[#bee5eb]">
                In Review 1
              </Badge>
              <Badge variant="secondary" className="bg-[#d4edda] text-[#155724] border-[#c3e6cb]">
                Implementing 1
              </Badge>
            </div>
          </div>

          {/* Next Critical Deadline */}
          <div className="bg-[#f9fbf1] p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#ffa500]" />
              <p className="text-sm text-[#8e8e93]">Next Critical Deadline</p>
            </div>
            <p className="font-medium text-[#000000]">Aug 20, 2025</p>
            <p className="text-sm text-[#8e8e93]">NYC Foie Gras Ban</p>
          </div>

          {/* Open Alerts */}
          <div className="bg-[#f9fbf1] p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#dc3545]" />
              <p className="text-sm text-[#8e8e93]">Open Alerts</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="bg-[#f8d7da] text-[#721c24] border-[#f5c6cb]">
                3 Conflicts
              </Badge>
            </div>
          </div>
        </div>

        {/* POLICY TABLE */}
        <div className="overflow-hiddenmt-6">
          <PolicyTable />
        </div>
      </div>
    </div>
  );
}