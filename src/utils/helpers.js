export function formatCurrency(amount, currency = 'VND') {
  if (amount === null || amount === undefined) return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date, options = {}) {
  if (!date) return '—';
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }).format(d);
}

export function formatDateTime(date) {
  if (!date) return '—';
  const d = new Date(date);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelativeTime(date) {
  if (!date) return '—';
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDate(date);
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '—';
  return new Intl.NumberFormat('vi-VN').format(num);
}

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(text, length = 100) {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '…';
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusConfig(status) {
  const configs = {
    pending: { label: 'Chờ xác nhận', color: 'warning', icon: 'clock' },
    confirmed: { label: 'Đã xác nhận', color: 'info', icon: 'check-circle' },
    paid: { label: 'Đã thanh toán', color: 'success', icon: 'credit-card' },
    active: { label: 'Đang thuê', color: 'primary', icon: 'car' },
    completed: { label: 'Hoàn tất', color: 'success', icon: 'check-circle-2' },
    cancelled: { label: 'Đã hủy', color: 'error', icon: 'x-circle' },
    rejected: { label: 'Từ chối', color: 'error', icon: 'x-circle' },
    refunded: { label: 'Đã hoàn tiền', color: 'info', icon: 'rotate-ccw' },
  };
  return configs[status] || { label: status, color: 'gray', icon: 'help-circle' };
}

export function getPaymentStatusConfig(status) {
  const configs = {
    pending: { label: 'Chờ thanh toán', color: 'warning' },
    paid: { label: 'Đã thanh toán', color: 'success' },
    failed: { label: 'Thanh toán thất bại', color: 'error' },
    refunded: { label: 'Đã hoàn tiền', color: 'info' },
    partial: { label: 'Thanh toán một phần', color: 'warning' },
  };
  return configs[status] || { label: status, color: 'gray' };
}

export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit = 300) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function generateId(prefix = 'id') {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function getQueryParams(search = window.location.search) {
  return new URLSearchParams(search);
}

export function setQueryParams(params, replace = false) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone) {
  return /^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone.replace(/\s/g, ''));
}

export function validateCCCD(cccd) {
  return /^[0-9]{12}$/.test(cccd);
}

export function validateLicensePlate(plate) {
  return /^[0-9]{2}[A-Z]-[0-9]{4,5}$/.test(plate.toUpperCase().replace(/\s/g, ''));
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(data, filename, type = 'application/json') {
  const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}