import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DollarSign, Calendar, Download, Filter, CheckCircle, Clock, AlertCircle, CreditCard, ChevronDown, ChevronsUpDown, X, Search, ChevronUp, ChevronRight, FileText } from 'lucide-react';
import Header from '../components/dashboard/Header';
import { useAuth } from '../context/AuthContext';

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit Card', lastFour: '4242', type: 'Visa', isDefault: true },
  { id: 'bank', name: 'Bank Account', lastFour: '9876', type: 'ACH', isDefault: false }
];

const Payments = () => {
  const { user } = useAuth();
  const [paymentData, setPaymentData] = useState({
    nextPayment: null,
    paymentHistory: [],
    loading: true
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Format currency - memoized to improve performance
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }, []);

  // Format date to a more readable format
  const formatDate = useCallback((dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  // Generate more realistic mock payment data with auto-refresh
  useEffect(() => {
    const generatePaymentData = () => {
      // Show loading only on initial load, not on refreshes
      if (refreshTrigger === 0) {
        setPaymentData(prev => ({ ...prev, loading: true }));
      }
      
      // Simulate API loading
      setTimeout(() => {
        const currentDate = new Date();
        const nextMonth = new Date(currentDate);
        nextMonth.setMonth(currentDate.getMonth() + 1);
        nextMonth.setDate(25);
        
        // Rent amount varies slightly based on user ID to simulate different apartments
        const userId = parseInt(user?.id || '1', 10);
        const baseRent = 1200 + ((userId % 5) * 100); // Rent between $1200-$1600
        
        // Create examples of 5 different rent amounts
        const exampleRents = [
          { unitNumber: '101', amount: 1100 },
          { unitNumber: '202', amount: 1350 },
          { unitNumber: '303', amount: 1500 },
          { unitNumber: '404', amount: 1800 },
          { unitNumber: '505', amount: 2100 }
        ];
        
        // Create next payment with late fees if applicable
        const nextPayment = {
          amount: baseRent,
          dueDate: nextMonth.toISOString().split('T')[0],
          status: 'pending',
          propertyName: `Sunset Apartments, Unit ${301 + (userId % 20)}`,
          lateFee: 0,
          totalDue: baseRent,
          exampleRents: exampleRents
        };
        
        // Create payment history (12 months of previous payments)
        const paymentHistory = [];
        const paymentStatuses = ['completed', 'completed', 'completed', 'completed', 'late', 'completed'];
        const paymentTypes = ['rent', 'rent', 'rent', 'maintenance', 'rent', 'deposit'];
        
        for (let i = 0; i < 12; i++) {
          const paymentDate = new Date(currentDate);
          paymentDate.setMonth(currentDate.getMonth() - i);
          
          // For rent payments, use the 25th of the month
          // For other types, use random days
          if (paymentTypes[i % paymentTypes.length] === 'rent') {
            paymentDate.setDate(25);
          } else {
            paymentDate.setDate(Math.floor(Math.random() * 28) + 1);
          }
          
          // Determine payment amount based on type
          let amount = baseRent;
          let paymentDescription = 'Monthly Rent';
          const paymentType = paymentTypes[i % paymentTypes.length];
          
          switch (paymentType) {
            case 'maintenance':
              amount = Math.floor(Math.random() * 300) + 50; // $50-$350
              paymentDescription = 'Maintenance Fee';
              break;
            case 'deposit':
              amount = baseRent * 2;
              paymentDescription = 'Security Deposit';
              break;
            default:
              break;
          }
          
          // Determine payment status
          const status = paymentStatuses[i % paymentStatuses.length];
          
          // If late, add a random late fee
          let lateFee = 0;
          if (status === 'late') {
            lateFee = 50;
            amount += lateFee;
          }
          
          // Create a delay for late payments
          let actualPaymentDate = new Date(paymentDate);
          if (status === 'late') {
            actualPaymentDate.setDate(actualPaymentDate.getDate() + Math.floor(Math.random() * 5) + 3);
          }
          
          // Add payment method used
          const paymentMethodUsed = PAYMENT_METHODS[i % PAYMENT_METHODS.length];
          
          paymentHistory.push({
            id: `payment-${user?.id || '1'}-${i}`,
            amount: amount,
            baseAmount: paymentType === 'rent' ? baseRent : amount,
            date: paymentDate.toISOString().split('T')[0],
            paidDate: status === 'completed' || status === 'late' ? actualPaymentDate.toISOString().split('T')[0] : null,
            status: status,
            type: paymentType,
            description: paymentDescription,
            reference: `INV-${paymentDate.getFullYear()}-${String(paymentDate.getMonth() + 1).padStart(2, '0')}-${userId}`,
            propertyName: `Sunset Apartments, Unit ${301 + (userId % 20)}`,
            lateFee: lateFee,
            paymentMethod: {
              type: paymentMethodUsed.type,
              lastFour: paymentMethodUsed.lastFour
            }
          });
        }
        
        // Sort payment history by date (newest first)
        paymentHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setPaymentData({
          nextPayment,
          paymentHistory,
          loading: false
        });
      }, refreshTrigger === 0 ? 800 : 300); // Faster refresh after initial load
    };
    
    generatePaymentData();
    
    // Set up auto-refresh every 30 seconds to simulate realtime updates
    const refreshInterval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [user, refreshTrigger]);

  // Payment status badge component
  const StatusBadge = useCallback(({ status }) => {
    let bgColor = 'bg-green-100 text-green-700';
    let Icon = CheckCircle;
    
    if (status === 'pending') {
      bgColor = 'bg-yellow-100 text-yellow-700';
      Icon = Clock;
    } else if (status === 'late') {
      bgColor = 'bg-red-100 text-red-700';
      Icon = AlertCircle;
    }
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${bgColor} flex items-center gap-1 w-fit`}>
        <Icon size={14} />
        <span className="capitalize">{status}</span>
      </span>
    );
  }, []);

  // Filter payment history - memoized for performance
  const filteredPayments = useMemo(() => {
    return paymentData.paymentHistory.filter(payment => {
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
        payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by type
      const matchesType = selectedFilter === 'all' || payment.type === selectedFilter;
      
      // Filter by month/year
      const paymentDate = new Date(payment.date);
      const matchesDate = 
        (selectedMonth === -1 || paymentDate.getMonth() === selectedMonth) && 
        (selectedYear === -1 || paymentDate.getFullYear() === selectedYear);
      
      return matchesSearch && matchesType && matchesDate;
    });
  }, [paymentData.paymentHistory, searchTerm, selectedFilter, selectedMonth, selectedYear]);
  
  // Handle payment submission with improved feedback
  const handlePaymentSubmit = useCallback((e) => {
    e.preventDefault();
    setProcessingPayment(true);
    
    // Get the payment amount (either from selected unit or regular next payment)
    const paymentAmount = selectedUnit ? selectedUnit.amount : paymentData.nextPayment?.amount;
    const propertyName = selectedUnit ? `Sunset Apartments, Unit ${selectedUnit.unitNumber}` : paymentData.nextPayment?.propertyName;
    
    // Simulate payment processing with visual feedback
    setTimeout(() => {
      setProcessingPayment(false);
      setPaymentSuccess(true);
      
      // Add visual confirmation with toast-like behavior
      setTimeout(() => {
        setShowPaymentModal(false);
        setPaymentSuccess(false);
        setSelectedUnit(null);
        
        // Update payment history with the new payment
        const newPayment = {
          id: `payment-${user?.id || '1'}-new-${Date.now()}`,
          amount: paymentAmount,
          baseAmount: paymentAmount,
          date: paymentData.nextPayment?.dueDate || new Date().toISOString().split('T')[0],
          paidDate: new Date().toISOString().split('T')[0],
          status: 'completed',
          type: 'rent',
          description: selectedUnit ? `Monthly Rent - Unit ${selectedUnit.unitNumber}` : 'Monthly Rent',
          reference: `INV-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${user?.id || '1'}`,
          propertyName: propertyName,
          lateFee: 0,
          paymentMethod: {
            type: paymentMethod.type,
            lastFour: paymentMethod.lastFour
          }
        };
        
        // Update state with new payment - triggers a visual refresh
        setPaymentData(prev => ({
          ...prev,
          paymentHistory: [newPayment, ...prev.paymentHistory]
        }));
        
        // Trigger a refresh after payment to simulate server sync
        setTimeout(() => setRefreshTrigger(prev => prev + 1), 5000);
      }, 2000);
    }, 1500);
  }, [paymentData.nextPayment, paymentMethod, user, selectedUnit]);

  // Handle selecting a unit for payment
  const handleUnitSelect = useCallback((unit) => {
    setSelectedUnit(unit);
    setShowPaymentModal(true);
  }, []);

  // Handle search with debounce for better performance
  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  // Optimize conditional rendering for loading state
  if (paymentData.loading && refreshTrigger === 0) {
    return (
      <div>
        <Header />
        <div className="p-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Header />
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {refreshTrigger > 0 && refreshTrigger % 5 === 0 && (
            <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-md flex items-center justify-between text-sm">
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2" />
                <span>Updated just now</span>
              </div>
              <button onClick={() => setRefreshTrigger(prev => prev + 1)} className="text-blue-600 hover:underline">
                Refresh
              </button>
            </div>
          )}
          
          {/* Greeting */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Payments Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || 'Tenant'}</p>
          </div>
          
          {/* Next Payment Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 transition-all duration-300 hover:shadow-lg">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <DollarSign className="text-blue-500" />
              Next Payment Due
            </h2>
            <div className="border rounded-lg p-6 bg-blue-50">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                <div>
                  <span className="text-3xl font-bold">{formatCurrency(paymentData.nextPayment?.amount || 0)}</span>
                  <p className="text-sm text-gray-600 mt-1">Monthly Rent - {paymentData.nextPayment?.propertyName || 'Your Property'}</p>
                  {paymentData.nextPayment?.lateFee > 0 && (
                    <div className="mt-2 text-sm text-red-600">
                      Includes late fee: {formatCurrency(paymentData.nextPayment.lateFee)}
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200 active:scale-95"
                >
                  Pay Now
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                Due on {formatDate(paymentData.nextPayment?.dueDate || new Date().toISOString())}
              </div>
            </div>
            
            {/* Example Rent Amounts */}
            <div className="mt-6">
              <h3 className="text-md font-bold mb-3">Example Rent Amounts:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {paymentData.nextPayment?.exampleRents?.map((rent, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-3 bg-white hover:shadow-md transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50"
                    onClick={() => handleUnitSelect(rent)}
                  >
                    <p className="font-medium">Unit {rent.unitNumber}</p>
                    <p className="text-blue-600 font-bold">{formatCurrency(rent.amount)}</p>
                    <p className="text-xs text-gray-500 mt-1">Click to pay</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Payment History
              </h2>
              
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-auto focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  />
                </div>
                
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="rent">Rent Only</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="deposit">Deposits</option>
                </select>
                
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 active:scale-95 transition-all">
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">Reference</th>
                    <th className="text-left py-4 px-4">Date</th>
                    <th className="text-left py-4 px-4">Description</th>
                    <th className="text-left py-4 px-4">Amount</th>
                    <th className="text-left py-4 px-4">Status</th>
                    <th className="text-right py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">{payment.reference}</td>
                        <td className="py-4 px-4">{formatDate(payment.date)}</td>
                        <td className="py-4 px-4">{payment.description}</td>
                        <td className="py-4 px-4">{formatCurrency(payment.amount)}</td>
                        <td className="py-4 px-4">
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-blue-500 hover:underline flex items-center gap-1 ml-auto transition-colors">
                            <FileText size={16} />
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-gray-500">
                        No matching payment records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 relative overflow-hidden animate-scaleIn">
            {/* Close Button */}
            <button 
              onClick={() => !processingPayment && setShowPaymentModal(false)}
              className={`absolute top-4 right-4 ${processingPayment ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'} p-1 rounded-full transition-colors`}
              disabled={processingPayment}
            >
              <X size={20} />
            </button>
            
            {/* Modal Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {selectedUnit ? `Pay Rent for Unit ${selectedUnit.unitNumber}` : 'Make a Payment'}
              </h3>
              
              {paymentSuccess ? (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <h4 className="text-lg font-bold text-green-600 mb-2">Payment Successful!</h4>
                  <p className="text-gray-600 mb-6">
                    Your payment of {formatCurrency(selectedUnit ? selectedUnit.amount : (paymentData.nextPayment?.amount || 0))} has been processed successfully.
                  </p>
                  <p className="text-sm text-gray-500">A receipt has been sent to your email.</p>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Summary</label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">
                          {selectedUnit ? `Rent for Unit ${selectedUnit.unitNumber}:` : 'Monthly Rent:'}
                        </span>
                        <span>{formatCurrency(selectedUnit ? selectedUnit.amount : (paymentData.nextPayment?.amount || 0))}</span>
                      </div>
                      {!selectedUnit && paymentData.nextPayment?.lateFee > 0 && (
                        <div className="flex justify-between mb-2 text-red-600">
                          <span>Late Fee:</span>
                          <span>{formatCurrency(paymentData.nextPayment.lateFee)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-2 border-t">
                        <span>Total Due:</span>
                        <span>{formatCurrency(selectedUnit ? selectedUnit.amount : (paymentData.nextPayment?.totalDue || 0))}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                    <div className="relative">
                      <button
                        type="button"
                        className="w-full px-4 py-2 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
                        onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                      >
                        <div className="flex items-center">
                          <CreditCard size={18} className="mr-2 text-gray-500" />
                          <span>
                            {paymentMethod.name} (**** {paymentMethod.lastFour})
                          </span>
                        </div>
                        <ChevronDown size={18} className="text-gray-500" />
                      </button>
                      
                      {showPaymentDropdown && (
                        <div className="absolute top-full left-0 w-full mt-1 bg-white border rounded-lg shadow-lg z-10 animate-fadeIn">
                          {PAYMENT_METHODS.map((method) => (
                            <button
                              key={method.id}
                              type="button"
                              className={`w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors ${
                                paymentMethod.id === method.id ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => {
                                setPaymentMethod(method);
                                setShowPaymentDropdown(false);
                              }}
                            >
                              <div className="flex items-center">
                                <CreditCard size={18} className="mr-2 text-gray-500" />
                                <span>
                                  {method.name} (**** {method.lastFour})
                                </span>
                              </div>
                              {method.isDefault && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Default</span>
                              )}
                            </button>
                          ))}
                          <button
                            type="button"
                            className="w-full px-4 py-3 text-left text-blue-600 hover:bg-gray-50 transition-colors flex items-center"
                          >
                            <ChevronRight size={18} className="mr-2" />
                            Add new payment method
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={processingPayment}
                    className={`w-full py-3 rounded-lg font-medium ${
                      processingPayment
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600 text-white active:scale-98'
                    } transition-all duration-200`}
                  >
                    {processingPayment ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Pay ${formatCurrency(selectedUnit ? selectedUnit.amount : (paymentData.nextPayment?.totalDue || 0))}`
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;