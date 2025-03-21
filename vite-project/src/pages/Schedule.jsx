import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '../components/dashboard/Header';
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from 'date-fns';

// Storage key for appointments
const STORAGE_KEY = 'maintenance_appointments';

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [appointments, setAppointments] = useState(() => {
    // Load appointments from localStorage on initial render
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }, [appointments]);
  
  // Show notification and auto-dismiss
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Generate week days based on current week start
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  // Check if a time slot is already booked
  const isTimeSlotBooked = (date, time) => {
    return appointments.some(
      appointment => 
        isSameDay(new Date(appointment.date), date) && 
        appointment.time === time
    );
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (date, time) => {
    if (isTimeSlotBooked(date, time)) {
      showNotification('This time slot is already booked', 'error');
      return;
    }
    
    setSelectedTimeSlot({ date, time });
    setSelectedDate(date);
  };

  // Book an appointment
  const bookAppointment = (serviceType) => {
    if (!selectedTimeSlot) {
      showNotification('Please select a time slot first', 'error');
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      try {
        // Create a new appointment with a random ID
        const newAppointment = {
          id: Date.now().toString(),
          date: selectedTimeSlot.date.toISOString(),
          time: selectedTimeSlot.time,
          serviceType
        };
        
        setAppointments(prev => [...prev, newAppointment]);
        setSelectedTimeSlot(null);
        showNotification('Appointment booked successfully!');
      } catch (error) {
        console.error('Failed to book appointment:', error);
        showNotification('Failed to book appointment', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  // Cancel an appointment
  const cancelAppointment = (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        setAppointments(prev => prev.filter(app => app.id !== appointmentId));
        showNotification('Appointment cancelled successfully');
      } catch (error) {
        console.error('Failed to cancel appointment:', error);
        showNotification('Failed to cancel appointment', 'error');
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div>
      <Header />
      <main className="p-4 sm:p-6">
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-md z-50 ${
            notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {notification.message}
          </div>
        )}
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
            <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <CalendarIcon className="text-blue-500" />
              Schedule Maintenance
            </h1>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
                disabled={isLoading}
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-medium text-sm sm:text-base">
                {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d')}
              </span>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
                disabled={isLoading}
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          )}

          {/* Mobile view - scrollable calendar days */}
          <div className="sm:hidden mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Select a day:</h3>
            </div>
            <div className="flex overflow-x-auto pb-2 gap-2">
              {weekDays.map((date) => (
                <div 
                  key={date.toString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 p-2 rounded-lg flex flex-col items-center ${
                    isSameDay(date, selectedDate) 
                      ? 'bg-blue-100 border border-blue-500' 
                      : isSameDay(date, new Date())
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                  <div className="text-lg">{format(date, 'd')}</div>
                </div>
              ))}
            </div>
            
            <h3 className="font-medium mt-4 mb-2">Select a time slot for {format(selectedDate, 'MMMM d')}:</h3>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((time) => {
                const isBooked = isTimeSlotBooked(selectedDate, time);
                const isSelected = selectedTimeSlot && 
                                  isSameDay(selectedTimeSlot.date, selectedDate) && 
                                  selectedTimeSlot.time === time;
                
                return (
                  <div
                    key={`${selectedDate}-${time}`}
                    onClick={() => !isBooked && handleTimeSlotSelect(selectedDate, time)}
                    className={`p-3 border rounded-lg transition-colors flex items-center justify-center ${
                      isBooked 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : isSelected
                        ? 'bg-blue-200 border-blue-500 border-2'
                        : 'hover:bg-blue-50 cursor-pointer'
                    }`}
                  >
                    <Clock size={14} className="mr-2 text-gray-500" />
                    <span>{time}</span>
                    {isBooked && (
                      <span className="ml-2 text-xs text-red-500">Booked</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop view - week grid */}
          <div className="hidden sm:grid grid-cols-8 gap-4">
            {/* Time slots column */}
            <div className="border-r pt-16">
              {timeSlots.map((time) => (
                <div key={time} className="h-20 flex items-center justify-end pr-4 text-sm text-gray-500">
                  {time}
                </div>
              ))}
            </div>

            {/* Days columns */}
            {weekDays.map((date) => (
              <div key={date.toString()}>
                <div className="text-center mb-4">
                  <div className="font-medium">{format(date, 'EEE')}</div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto ${
                    isSameDay(date, new Date())
                      ? 'bg-blue-500 text-white'
                      : isSameDay(date, selectedDate)
                      ? 'bg-blue-100 border border-blue-500'
                      : ''
                  }`}>
                    {format(date, 'd')}
                  </div>
                </div>

                {timeSlots.map((time) => {
                  const isBooked = isTimeSlotBooked(date, time);
                  const isSelected = selectedTimeSlot && 
                                    isSameDay(selectedTimeSlot.date, date) && 
                                    selectedTimeSlot.time === time;
                  
                  return (
                    <div
                      key={`${date}-${time}`}
                      onClick={() => !isBooked && handleTimeSlotSelect(date, time)}
                      className={`h-20 border rounded-lg transition-colors flex items-center justify-center ${
                        isBooked 
                          ? 'bg-gray-100 cursor-not-allowed' 
                          : isSelected
                          ? 'bg-blue-200 border-blue-500 border-2'
                          : 'hover:bg-blue-50 cursor-pointer'
                      }`}
                    >
                      {isBooked && (
                        <span className="text-xs text-gray-500">Booked</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {selectedTimeSlot && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-sm sm:text-base">Book appointment for {format(selectedTimeSlot.date, 'MMMM d')} at {selectedTimeSlot.time}</h3>
              <div className="mt-3 flex flex-wrap gap-3">
                <button 
                  onClick={() => bookAppointment('Plumbing')}
                  disabled={isLoading}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Plumbing
                </button>
                <button 
                  onClick={() => bookAppointment('Electrical')}
                  disabled={isLoading}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Electrical
                </button>
                <button 
                  onClick={() => bookAppointment('Maintenance')}
                  disabled={isLoading}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Maintenance
                </button>
                <button 
                  onClick={() => bookAppointment('Inquiry')}
                  disabled={isLoading}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Inquiry
                </button>
                <button 
                  onClick={() => bookAppointment('Payment')}
                  disabled={isLoading}
                  className="px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  Payment
                </button>
                <button 
                  onClick={() => setSelectedTimeSlot(null)}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Upcoming Appointments</h2>
            {appointments.length === 0 ? (
              <p className="text-gray-500">No upcoming appointments</p>
            ) : (
              <div className="space-y-4">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{appointment.serviceType}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <CalendarIcon size={16} />
                          <span>{format(new Date(appointment.date), 'MMMM d, yyyy')}</span>
                          <Clock size={16} className="ml-2" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                      <button 
                        className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                        onClick={() => cancelAppointment(appointment.id)}
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schedule;