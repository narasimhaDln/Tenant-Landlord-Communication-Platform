import React from 'react';
import { DollarSign, Calendar, Download, Filter } from 'lucide-react';
import Header from '../components/dashboard/Header';

const Payments = () => {
  const nextPayment = {
    amount: 1200,
    dueDate: '2024-03-25',
    status: 'pending'
  };

  const paymentHistory = [
    {
      id: 1,
      amount: 1200,
      date: '2024-02-25',
      status: 'completed',
      reference: 'INV-2024-02'
    },
    {
      id: 2,
      amount: 1200,
      date: '2024-01-25',
      status: 'completed',
      reference: 'INV-2024-01'
    }
  ];

  return (
    <div>
      <Header />
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Next Payment Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <DollarSign className="text-blue-500" />
              Next Payment Due
            </h2>
            <div className="border rounded-lg p-6 bg-blue-50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold">${nextPayment.amount}</span>
                  <p className="text-sm text-gray-600 mt-1">Monthly Rent</p>
                </div>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Pay Now
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                Due on {nextPayment.dueDate}
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                Payment History
              </h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                  <Filter size={16} />
                  Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
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
                    <th className="text-left py-4 px-4">Amount</th>
                    <th className="text-left py-4 px-4">Status</th>
                    <th className="text-right py-4 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-4 px-4">{payment.reference}</td>
                      <td className="py-4 px-4">{payment.date}</td>
                      <td className="py-4 px-4">${payment.amount}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-blue-500 hover:underline">
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payments;