import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockBookings, mockCars } from '../data/mockData';

const BookingContext = createContext(null);

const STORAGE_KEY = 'morent_bookings';

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBookings(JSON.parse(stored));
      } catch {
        setBookings(mockBookings);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBookings));
      }
    } else {
      setBookings(mockBookings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mockBookings));
    }
    setLoading(false);
  }, []);

  const persistBookings = useCallback((newBookings) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookings));
    setBookings(newBookings);
  }, []);

  const createBooking = useCallback(async (bookingData) => {
    setError(null);
    const newBooking = {
      id: `booking-${Date.now()}`,
      ...bookingData,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        { status: 'pending', timestamp: new Date().toISOString(), note: 'Đơn hàng đã được tạo, chờ nhà cung cấp xác nhận' },
      ],
    };
    persistBookings([newBooking, ...bookings]);
    return newBooking;
  }, [bookings, persistBookings]);

  const updateBooking = useCallback(async (bookingId, updates) => {
    const newBookings = bookings.map(b => 
      b.id === bookingId 
        ? { ...b, ...updates, updatedAt: new Date().toISOString() }
        : b
    );
    persistBookings(newBookings);
    return newBookings.find(b => b.id === bookingId);
  }, [bookings, persistBookings]);

  const cancelBooking = useCallback(async (bookingId, reason) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Không tìm thấy đơn hàng');
    
    if (['completed', 'cancelled'].includes(booking.status)) {
      throw new Error('Không thể hủy đơn hàng này');
    }
    
    const newTimeline = [
      ...booking.timeline,
      { status: 'cancelled', timestamp: new Date().toISOString(), note: `Khách hủy đơn: ${reason}` },
    ];
    
    return updateBooking(bookingId, { 
      status: 'cancelled', 
      paymentStatus: 'refunded',
      timeline: newTimeline,
      notes: reason,
    });
  }, [bookings, updateBooking]);

  const getBookingById = useCallback((bookingId) => {
    return bookings.find(b => b.id === bookingId);
  }, [bookings]);

  const getUserBookings = useCallback((userId) => {
    return bookings.filter(b => b.userId === userId).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [bookings]);

  const getProviderBookings = useCallback((providerId) => {
    return bookings.filter(b => b.providerId === providerId).sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [bookings]);

  const getCarBookings = useCallback((carId) => {
    return bookings.filter(b => b.carId === carId);
  }, [bookings]);

  const isCarAvailable = useCallback((carId, startDate, endDate, excludeBookingId = null) => {
    const carBookings = getCarBookings(carId);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return !carBookings.some(booking => {
      if (excludeBookingId && booking.id === excludeBookingId) return false;
      if (['cancelled'].includes(booking.status)) return false;
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return start <= bookingEnd && end >= bookingStart;
    });
  }, [getCarBookings]);

  const calculatePrice = useCallback((carId, startDate, endDate, promoCode = null) => {
    const car = mockCars.find(c => c.id === carId);
    if (!car) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
    
    let pricePerDay = car.pricePerDay;
    let discount = 0;
    
    if (days >= 30) {
      pricePerDay = car.pricePerMonth / 30;
    } else if (days >= 7) {
      pricePerDay = car.pricePerWeek / 7;
    }
    
    const subtotal = pricePerDay * days;
    
    if (promoCode === 'SUMMER20' && days >= 7) {
      discount = subtotal * 0.2;
    } else if (promoCode === 'WELCOME10') {
      discount = subtotal * 0.1;
    } else if (days >= 30) {
      discount = subtotal * 0.2;
    } else if (days >= 7) {
      discount = subtotal * 0.1;
    }
    
    const taxable = subtotal - discount;
    const tax = Math.round(taxable * 0.09);
    const total = Math.round(taxable + tax);
    
    return {
      days,
      pricePerDay: Math.round(pricePerDay),
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      tax,
      total,
    };
  }, []);

  const value = {
    bookings,
    loading,
    error,
    createBooking,
    updateBooking,
    cancelBooking,
    getBookingById,
    getUserBookings,
    getProviderBookings,
    getCarBookings,
    isCarAvailable,
    calculatePrice,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}