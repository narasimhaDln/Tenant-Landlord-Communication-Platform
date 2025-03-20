import React, { useState, useEffect, useCallback } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import Header from '../components/dashboard/Header';

const Maintenance = () => {
  const { requests, loading, error, fetchRequests, updateRequest, deleteRequest } = useMaintenance();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low',
    status: 'pending'
  });
  
  const [localError, setLocalError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  // Add this state to determine if we're in the maintenance section
  const [isMaintenanceSection] = useState(true);

  useEffect(() => {
    fetchRequests().catch(err => {
      console.error("Failed to fetch requests:", err);
    });
  }, [fetchRequests]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setLocalError(null);
      const response = await fetch('http://localhost:5000/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create maintenance request');
      }

      const newRequest = await response.json();
      setFormData({
        title: '',
        description: '',
        priority: 'low',
        status: 'pending'
      });
      setShowForm(false);
      fetchRequests();
    } catch (err) {
      console.error('Error creating maintenance request:', err);
      setLocalError(err.message || 'Error creating request. Please try again.');
    }
  }, [formData, fetchRequests]);

  const handleStatusUpdate = useCallback(async (id, newStatus) => {
    try {
      setLocalError(null);
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
      setLocalError(err.message || 'Error updating status. Please try again.');
    }
  }, [updateRequest]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        setLocalError(null);
        setIsDeleting(true);
        setDeletingId(id);
        
        await deleteRequest(id);
        
        // If we get here, the delete was successful
        setIsDeleting(false);
        setDeletingId(null);
      } catch (err) {
        console.error('Error deleting request:', err);
        setLocalError(err.message || 'Failed to delete request. Please try again.');
        setIsDeleting(false);
        setDeletingId(null);
      }
    }
  }, [deleteRequest]);
  

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleRetry = () => {
    fetchRequests().catch(err => {
      console.error("Failed to fetch requests on retry:", err);
    });
  };

  return (
    <div>
      <Header />
      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Maintenance Requests</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showForm ? 'Cancel' : 'New Request'}
          </button>
                  </div>

        {(error || localError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <div className="flex justify-between items-center">
              <span className="block sm:inline">{error || localError}</span>
              <button 
                onClick={handleRetry} 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
                  </label>
                  <input
                    type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Submit Request
            </button>
          </form>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-gray-500 text-center py-4">No maintenance requests found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">{request.title}</h3>
                <p className="text-gray-600 mb-4">{request.description}</p>
                <div className="flex items-center space-x-2 mb-4">
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    {request.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusUpdate(request._id, 'completed')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      >
                        Mark as Completed
                      </button>
                    )}
                    {/* Only show delete button in the maintenance section */}
                    {isMaintenanceSection && (
                      <button
                        onClick={() => handleDelete(request._id)}
                        disabled={isDeleting && deletingId === request._id}
                        className={`${
                          isDeleting && deletingId === request._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white px-3 py-1 rounded text-sm`}
                      >
                        {isDeleting && deletingId === request._id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default Maintenance;