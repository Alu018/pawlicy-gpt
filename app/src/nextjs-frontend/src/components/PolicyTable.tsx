"use client";

import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';

// Sample policy data
const policyData = [
  {
    id: "FG-NYC-25",
    name: "NYC Foie Gras Procurement Ban",
    jurisdiction: "New York City",
    stage: "In Review",
    status: "At Risk",
    dueDate: "Aug 20, 2025",
    assignees: ["Maria", "Alex"],
    requiredDocs: ["Fiscal Note", "Sponsor Memo"],
    attachments: 2,
    notes: "Legal concerns about state preemption need to be addressed."
  },
  {
    id: "FR-CHI-24",
    name: "Chicago Fur-Sale Disclosure Rule",
    jurisdiction: "Chicago",
    stage: "Draft",
    status: "On Track",
    dueDate: "Sep 10, 2025",
    assignees: ["Jordan"],
    requiredDocs: ["Fiscal Note", "Sponsor Memo"],
    attachments: 0,
    notes: "Draft ordinance ready for sponsor review."
  },
  {
    id: "WA-LA-23",
    name: "LA Wild-Animal Circus Ban",
    jurisdiction: "Los Angeles",
    stage: "Filed",
    status: "On Track",
    dueDate: "Aug 30, 2025",
    assignees: ["Priya"],
    requiredDocs: ["All Complete"],
    attachments: 3,
    notes: ""
  },
  {
    id: "DT-ATX-24",
    name: "Austin Dog-Tethering Reform",
    jurisdiction: "Austin",
    stage: "Implementing",
    status: "On Track",
    dueDate: "Dec 31, 2025",
    assignees: ["CityClerk"],
    requiredDocs: ["All Complete"],
    attachments: 1,
    notes: ""
  },
  {
    id: "PB-CAM-25",
    name: "Cambridge Plant-Based Procurement Pilot",
    jurisdiction: "Cambridge, MA",
    stage: "Reviewed",
    status: "Blocked",
    dueDate: "Jul 15, 2025",
    assignees: ["Lee"],
    requiredDocs: ["Fiscal Note", "Legal OK"],
    attachments: 1,
    notes: "Budget office flagged potential cost overruns requiring additional review."
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case "On Track":
      return "bg-green-100 text-green-800";
    case "At Risk":
      return "bg-yellow-100 text-yellow-800";
    case "Blocked":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

function getStageColor(stage: string) {
  switch (stage) {
    case "Draft":
      return "bg-blue-100 text-blue-800";
    case "In Review":
      return "bg-purple-100 text-purple-800";
    case "Reviewed":
      return "bg-indigo-100 text-indigo-800";
    case "Filed":
      return "bg-cyan-100 text-cyan-800";
    case "Implementing":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

export function PolicyTable() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredData, setFilteredData] = useState(policyData);

  const filterOptions = [
    "All",
    "Status: On Track",
    "Status: At Risk", 
    "Status: Blocked",
    "Stage: Draft",
    "Stage: In Review",
    "Stage: Filed",
    "Stage: Implementing"
  ];

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);

    if (filter === "All") {
      setFilteredData(policyData);
    } else if (filter.startsWith("Status:")) {
      const status = filter.replace("Status: ", "");
      setFilteredData(policyData.filter(policy => policy.status === status));
    } else if (filter.startsWith("Stage:")) {
      const stage = filter.replace("Stage: ", "");
      setFilteredData(policyData.filter(policy => policy.stage === stage));
    }
  };

  return (
    <div className="space-y-4 mt-6">
      {/* Filter Section */}
      <div className="flex justify-start">
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">Filter by: {selectedFilter}</span>
            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterSelect(option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                      selectedFilter === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy / ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jurisdiction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assignees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Required docs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Attachments
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((policy, index) => (
                <tr key={policy.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {/* Policy / ID */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                      <div className="text-sm text-gray-500">({policy.id})</div>
                    </div>
                  </td>
                  
                  {/* Jurisdiction */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{policy.jurisdiction}</div>
                  </td>
                  
                  {/* Stage */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(policy.stage)}`}>
                      {policy.stage}
                    </span>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </td>
                  
                  {/* Due Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{policy.dueDate}</div>
                  </td>
                  
                  {/* Assignees */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {policy.assignees.map((assignee, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 text-xs font-medium text-gray-700"
                        >
                          {assignee.charAt(0)}
                        </span>
                      ))}
                    </div>
                  </td>
                  
                  {/* Required Docs */}
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {policy.requiredDocs.map((doc, idx) => (
                        <span
                          key={idx}
                          className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </td>
                  
                  {/* Attachments */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {policy.attachments > 0 ? policy.attachments : '-'}
                    </div>
                  </td>
                  
                  {/* Notes */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate" title={policy.notes}>
                      {policy.notes || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}