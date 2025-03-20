import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import Header from '../components/dashboard/Header';

const Dashboard = () => {
  const { requests, loading, error, fetchRequests, updateRequest } = useMaintenance();
  const [filterStatus, setFilterStatus] = useState('all');
  
  useEffect(() => {
    fetchRequests().catch(err => {
      console.error("Failed to fetch requests:", err);
    });
  }, [fetchRequests]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/maintenance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update request status');
      }

      const updatedRequest = await response.json();
      updateRequest(updatedRequest);
    } catch (err) {
      console.error('Error updating request status:', err);
    }
  };

  const handleRetry = () => {
    fetchRequests().catch(err => {
      console.error("Failed to fetch requests on retry:", err);
    });
  };
  
  // Calculate basic statistics
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(req => req.status === 'pending').length;
  const completedRequests = requests.filter(req => req.status === 'completed').length;
  
  // Filter requests by status if needed
  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(request => request.status === filterStatus);
  
  // Get the most recent requests
  const recentRequests = [...filteredRequests]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        
        {/* Statistics Cards with improved design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Requests Card */}
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Total Requests</h3>
                <p className="text-3xl font-bold text-blue-700 mt-2">{totalRequests}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending Requests Card */}
          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-yellow-600 uppercase tracking-wider">Pending</h3>
                <p className="text-3xl font-bold text-yellow-700 mt-2">{pendingRequests}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed Requests Card */}
          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-green-600 uppercase tracking-wider">Completed</h3>
                <p className="text-3xl font-bold text-green-700 mt-2">{completedRequests}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Status Filter */}
        <div className="mb-6">
          <select
            className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Recent Maintenance Requests */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Maintenance Requests</h2>
            {error && (
              <button
                onClick={handleRetry}
                className="text-blue-500 hover:text-blue-700"
              >
                Retry
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-blue-500"></div>
            </div>
          ) : recentRequests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-gray-500">No maintenance requests found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentRequests.map((request) => (
                <div key={request._id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.priority === 'high' ? 'bg-red-100 text-red-800' :
                          request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className="text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex space-x-2">
                        {request.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(request._id, 'completed')}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm transition-colors"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredRequests.length > 5 && (
                <div className="text-center mt-6 pt-4">
                  <a 
                    href="/maintenance" 
                    className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded transition-colors"
                  >
                    View All Maintenance Requests
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;