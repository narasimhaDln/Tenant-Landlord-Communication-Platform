import React from 'react';
import { DollarSign, Calendar } from 'lucide-react';

const PaymentCard = () => {
  const nextPayment = {
    amount: 1200,
    dueDate: '2024-03-25',
    status: 'pending'
  };

  const recentPayments = [
    {
      id: 1,
      amount: 1200,
      date: '2024-02-25',
      status: 'completed'
    },
    {
      id: 2,
      amount: 1200,
      date: '2024-01-25',
      status: 'completed'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <DollarSign size={20} className="text-blue-500" />
          Rent Payments
        </h2>
        <a href="/payments" className="text-blue-500 hover:underline">View All</a>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Next Payment</h3>
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">${nextPayment.amount}</span>
            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm">
              Due soon
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            Due on {nextPayment.dueDate}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Recent Payments</h3>
        <div className="space-y-3">
          {recentPayments.map(payment => (
            <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <span className="font-medium">${payment.amount}</span>
                <div className="text-sm text-gray-500">{payment.date}</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                {payment.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;