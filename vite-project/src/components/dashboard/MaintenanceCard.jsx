import React from 'react';
import { PenTool as Tool, Clock, AlertTriangle } from 'lucide-react';

const MaintenanceCard = () => {
  const requests = [
    {
      id: 1,
      title: 'Leaking Faucet',
      status: 'in-progress',
      priority: 'medium',
      date: '2024-03-15',
    },
    {
      id: 2,
      title: 'Electrical Issue',
      status: 'pending',
      priority: 'high',
      date: '2024-03-14',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Tool size={20} className="text-blue-500" />
          Recent Maintenance Requests
        </h2>
        <a href="/maintenance" className="text-blue-500 hover:underline">View All</a>
      </div>

      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{request.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                request.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {request.status}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {request.date}
              </span>
              <span className="flex items-center gap-1">
                <AlertTriangle size={16} className={
                  request.priority === 'high' ? 'text-red-500' :
                  request.priority === 'medium' ? 'text-yellow-500' :
                  'text-green-500'
                } />
                {request.priority} priority
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceCard;