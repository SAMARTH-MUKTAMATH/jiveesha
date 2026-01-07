import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerModalProps {
    show: boolean;
    onClose: () => void;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    setView: (view: 'day' | 'week' | 'month') => void;
    appointmentFilter: 'all' | 'scheduled' | 'completed' | 'upcoming';
    setAppointmentFilter: (filter: 'all' | 'scheduled' | 'completed' | 'upcoming') => void;
    appointments: any[];
    monthLabel: string;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
    show,
    onClose,
    currentDate,
    setCurrentDate,
    setView,
    appointmentFilter,
    setAppointmentFilter,
    appointments,
    monthLabel
}) => {
    if (!show) return null;

    const handlePrevMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const handleDateSelect = (day: number) => {
        const newDate = new Date(currentDate);
        newDate.setDate(day);
        setCurrentDate(newDate);
        setView('day');
        onClose();
    };

    // Generate calendar days
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days = [];

    // Empty cells before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const isToday = new Date().toDateString() === date.toDateString();
        const isSelected = currentDate.getDate() === day;
        const hasAppointments = appointments.some(apt => {
            const aptDate = new Date(apt.fullDate || apt.date);
            return aptDate.toDateString() === date.toDateString();
        });

        days.push(
            <button
                key={day}
                onClick={() => handleDateSelect(day)}
                className={`aspect-square rounded-lg text-sm font-bold transition-all relative ${isToday
                    ? 'bg-blue-500 text-white shadow-md'
                    : isSelected
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
            >
                {day}
                {hasAppointments && (
                    <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-blue-500'
                        }`} />
                )}
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-purple-50">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black text-slate-900">Select Date</h3>
                        <button onClick={onClose} className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                            <ChevronLeft size={20} className="text-slate-600" />
                        </button>
                        <h4 className="text-sm font-black text-slate-800">{monthLabel}</h4>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg">
                            <ChevronRight size={20} className="text-slate-600" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <div key={i} className="text-center text-[10px] font-bold text-slate-400 py-2">{day}</div>
                        ))}
                        {days}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatePickerModal;
