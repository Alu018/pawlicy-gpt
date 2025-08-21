"use client"

import { AlertTriangle, Calendar } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { PolicyTable } from "@/components/PolicyTable";
import { useChat } from "../../components/ClientLayout"; // import hook
import { formatLongDate } from "../../lib/utils";

export default function PolicyTracker() {
  const { policies } = useChat(); // get policies from context

  // Get unique stages from policies
  const stageCounts: Record<string, number> = {};
  policies.forEach(policy => {
    stageCounts[policy.stage] = (stageCounts[policy.stage] || 0) + 1;
  });

  // Find the next critical deadline
  const upcomingPolicies = policies
    .filter(p => p.dueDate)
    .map(p => ({
      ...p,
      dueDateObj: new Date(p.dueDate)
    }))
    .filter(p => p.dueDateObj >= new Date())
    .sort((a, b) => a.dueDateObj.getTime() - b.dueDateObj.getTime());

  const nextPolicy = upcomingPolicies[0];

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
                <p className="text-2xl font-semibold text-[#000000]">{policies.length} Active</p>
              </div>
            </div>
          </div>

          {/* Stage Snapshot */}
          <div className="bg-[#f9fbf1] p-4 rounded-lg">
            <p className="text-sm text-[#8e8e93] mb-3">Stage Snapshot</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stageCounts).map(([stage, count]) => {
                let badgeClass = "bg-gray-100 text-gray-700 border-gray-200";
                if (stage === "Draft") {
                  badgeClass = "bg-[#fff3cd] text-[#856404] border-[#ffeaa7]";
                } else if (stage === "In Review") {
                  badgeClass = "bg-[#d1ecf1] text-[#0c5460] border-[#bee5eb]";
                } else if (stage === "Implementing") {
                  badgeClass = "bg-[#d4edda] text-[#155724] border-[#c3e6cb]";
                }
                return (
                  <Badge
                    key={stage}
                    variant="secondary"
                    className={badgeClass}
                  >
                    {stage} {count}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Next Critical Deadline */}
          <div className="bg-[#f9fbf1] p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#ffa500]" />
              <p className="text-sm text-[#8e8e93]">Next Critical Deadline</p>
            </div>
            {nextPolicy ? (
              <>
                <p className="font-medium text-[#000000]">
                  {formatLongDate(nextPolicy.dueDate)}
                </p>
                <p className="text-sm text-[#8e8e93]">{nextPolicy.name}</p>
              </>
            ) : (
              <p className="text-sm text-[#8e8e93]">No upcoming deadlines</p>
            )}
          </div>

          {/* Open Alerts */}
          <div className="bg-[#f9fbf1] p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#dc3545]" />
              <p className="text-sm text-[#8e8e93]">Open Alerts</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="bg-gray-200 text-black border-gray-200">
                None
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