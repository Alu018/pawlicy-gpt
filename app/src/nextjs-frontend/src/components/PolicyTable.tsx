"use client";

import React, { useState } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { useChat } from './ClientLayout';
import { useRouter } from 'next/navigation';

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
  return "bg-gray-100 text-gray-700";
}

export function PolicyTable() {
  const { policies, setPolicies, openDraftThread, chats } = useChat();
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [filteredData, setFilteredData] = useState(policies);

  const stageOptions = [
    "Draft",
    "In Review",
    "Reviewed",
    "Sponsor Secured",
    "Filed",
    "Vote",
    "Implementing"
  ];

  React.useEffect(() => {
    if (selectedFilter === "All") {
      setFilteredData(policies);
    } else if (selectedFilter.startsWith("Status:")) {
      const status = selectedFilter.replace("Status: ", "");
      setFilteredData(policies.filter(policy => policy.status === status));
    } else if (selectedFilter.startsWith("Stage:")) {
      const stage = selectedFilter.replace("Stage: ", "");
      setFilteredData(policies.filter(policy => policy.stage === stage));
    }
  }, [policies, selectedFilter]);

  const filterOptions = [
    "All",
    "Status: On Track",
    "Status: At Risk",
    "Status: Blocked",
    "Stage: Draft",
    "Stage: In Review",
    "Stage: Reviewed",
    "Stage: Filed",
    "Stage: Implementing",
    "Stage: Passed",
    "Stage: Rejected",
    "Stage: On Hold"
  ];

  const handleFilterSelect = (filter: string) => {
    setSelectedFilter(filter);
    setIsFilterOpen(false);
  };

  const handleStageChange = (policyId: string, newStage: string) => {
    setPolicies(prevPolicies =>
      prevPolicies.map(policy =>
        policy.id === policyId
          ? { ...policy, stage: newStage }
          : policy
      )
    );
  };

  const handleOpenDraftThread = (policy: any) => {
    if (policy.sourceChatId && chats.find(chat => chat.id === policy.sourceChatId)) {
      openDraftThread(policy);
      router.push('/'); // Navigate to chat page
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

          {isFilterOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {filterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleFilterSelect(option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedFilter === option ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
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

      {/* Table or Empty State */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 py-12 text-center text-gray-500">
          Create a new draft to add a policy here.
        </div>
      ) : (
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
                    Topic
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                        <div className="text-sm text-gray-500">({policy.id})</div>

                        {/* Open Draft Thread Link */}
                        {policy.sourceChatId && chats.find(chat => chat.id === policy.sourceChatId) && (
                          <button
                            onClick={() => handleOpenDraftThread(policy)}
                            className="text-xs text-pawlicy-green hover:text-pawlicy-green hover:underline cursor-pointer mt-1"
                          >
                            Open Draft Thread
                          </button>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{policy.jurisdiction}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{policy.topic}</div>
                    </td>

                    {/* Editable Stage Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={policy.stage}
                          onChange={(e) => handleStageChange(policy.id, e.target.value)}
                          className={`inline-flex px-2 py-1 pr-6 text-xs font-semibold rounded-sm border-0 outline-none cursor-pointer appearance-none ${getStageColor(policy.stage)}`}
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.25rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1rem 1rem'
                          }}
                        >
                          {stageOptions.map((stage) => (
                            <option key={stage} value={stage}>
                              {stage}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(policy.status)}`}>
                        {policy.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{policy.dueDate}</div>
                    </td>

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

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {policy.attachments > 0 ? policy.attachments : '-'}
                      </div>
                    </td>

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
      )}
    </div>
  )
}