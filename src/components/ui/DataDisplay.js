import React from 'react';
import { classNames } from '../utils/helpers';

export function Badge({ children, variant = 'gray', className = '', ...props }) {
  const variantClasses = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    gray: 'badge-gray',
  };
  
  return (
    <span className={classNames('badge', variantClasses[variant], className)} {...props}>
      {children}
    </span>
  );
}

export function StatusBadge({ status, className = '', ...props }) {
  const configs = {
    pending: { label: 'Chờ xác nhận', variant: 'warning' },
    confirmed: { label: 'Đã xác nhận', variant: 'info' },
    paid: { label: 'Đã thanh toán', variant: 'success' },
    active: { label: 'Đang thuê', variant: 'primary' },
    completed: { label: 'Hoàn tất', variant: 'success' },
    cancelled: { label: 'Đã hủy', variant: 'error' },
    rejected: { label: 'Từ chối', variant: 'error' },
    refunded: { label: 'Đã hoàn tiền', variant: 'info' },
    available: { label: 'Sẵn có', variant: 'success' },
    unavailable: { label: 'Không sẵn có', variant: 'error' },
    maintenance: { label: 'Bảo trì', variant: 'warning' },
    draft: { label: 'Nháp', variant: 'gray' },
    published: { label: 'Đã xuất bản', variant: 'success' },
    pending_review: { label: 'Chờ duyệt', variant: 'warning' },
    approved: { label: 'Đã duyệt', variant: 'success' },
    rejected: { label: 'Từ chối', variant: 'error' },
  };
  
  const config = configs[status] || { label: status, variant: 'gray' };
  
  return <Badge variant={config.variant} className={className} {...props}>{config.label}</Badge>;
}

export function Dropdown({ trigger, items, align = 'right', className = '' }) {
  const [open, setOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          triggerRef.current && !triggerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleItemClick = (item, e) => {
    if (item.onClick) item.onClick(e);
    if (!item.keepOpen) setOpen(false);
  };
  
  return (
    <div className={classNames('dropdown inline-block', className)}>
      <div ref={triggerRef} onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      {open && (
        <div 
          ref={dropdownRef}
          className={classNames('dropdown-menu', align === 'left' ? 'left-0' : 'right-0')}
          role="menu"
        >
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.divider && <div className="dropdown-divider" role="separator" />}
              {!item.divider && (
                <button
                  className={classNames('dropdown-item w-full text-left', item.variant === 'danger' && 'danger')}
                  onClick={(e) => handleItemClick(item, e)}
                  role="menuitem"
                  disabled={item.disabled}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  {item.label}
                  {item.shortcut && <span className="ml-auto text-xs text-tertiary">{item.shortcut}</span>}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

export function Tabs({ tabs, activeTab, onChange, className = '', ...props }) {
  return (
    <div className={classNames('tabs', className)} {...props}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={classNames('tab', tab.id === activeTab && 'active')}
          onClick={() => onChange(tab.id)}
          disabled={tab.disabled}
          role="tab"
          aria-selected={tab.id === activeTab}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded-full">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function TabPanel({ id, activeTab, children, className = '' }) {
  if (id !== activeTab) return null;
  return (
    <div className={classNames('tab-panel animate-fade-in', className)} role="tabpanel" id={`panel-${id}`}>
      {children}
    </div>
  );
}

export function Table({ columns, data, keyField = 'id', onRowClick, className = '', emptyMessage = 'Không có dữ liệu', ...props }) {
  return (
    <div className={classNames('table-container', className)} {...props}>
      {data.length > 0 ? (
        <table className="table" role="grid">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={row[keyField]} 
                onClick={() => onRowClick?.(row)}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onRowClick?.(row); }}
              >
                {columns.map(col => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-12 text-tertiary">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxPages = 5,
  className = '',
  ...props 
}) {
  if (totalPages <= 1) return null;
  
  const pages = [];
  const halfMax = Math.floor(maxPages / 2);
  
  let start = Math.max(1, currentPage - halfMax);
  let end = Math.min(totalPages, start + maxPages - 1);
  
  if (end - start + 1 < maxPages) {
    start = Math.max(1, end - maxPages + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return (
    <nav className={classNames('pagination', className)} aria-label="Phân trang" {...props}>
      {showFirstLast && currentPage > 1 && (
        <button className="pagination-btn" onClick={() => onPageChange(1)} aria-label="Trang đầu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
        </button>
      )}
      
      {showPrevNext && currentPage > 1 && (
        <button className="pagination-btn" onClick={() => onPageChange(currentPage - 1)} aria-label="Trang trước">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
        </button>
      )}
      
      {start > 1 && (
        <>
          <button className="pagination-btn" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span className="pagination-btn" aria-hidden="true">…</span>}
        </>
      )}
      
      {pages.map(page => (
        <button
          key={page}
          className={classNames('pagination-btn', page === currentPage && 'active')}
          onClick={() => onPageChange(page)}
          aria-label={`Trang ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="pagination-btn" aria-hidden="true">…</span>}
          <button className="pagination-btn" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}
      
      {showPrevNext && currentPage < totalPages && (
        <button className="pagination-btn" onClick={() => onPageChange(currentPage + 1)} aria-label="Trang sau">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
        </button>
      )}
      
      {showFirstLast && currentPage < totalPages && (
        <button className="pagination-btn" onClick={() => onPageChange(totalPages)} aria-label="Trang cuối">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8-14l7 7-7 7"/></svg>
        </button>
      )}
    </nav>
  );
}

export function Accordion({ items, className = '', allowMultiple = false, ...props }) {
  const [openItems, setOpenItems] = React.useState(
    allowMultiple ? [] : items.findIndex(i => i.defaultOpen) >= 0 ? [items.findIndex(i => i.defaultOpen)] : []
  );
  
  const toggle = (index) => {
    setOpenItems(prev => {
      if (allowMultiple) {
        return prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index];
      }
      return prev.includes(index) ? [] : [index];
    });
  };
  
  return (
    <div className={classNames('accordion', className)} {...props}>
      {items.map((item, index) => (
        <div key={item.id || index} className="accordion-item">
          <button
            className={classNames('accordion-header', openItems.includes(index) && 'open')}
            onClick={() => toggle(index)}
            aria-expanded={openItems.includes(index)}
            aria-controls={`accordion-content-${index}`}
            id={`accordion-header-${index}`}
          >
            <span>{item.title}</span>
            <svg className="accordion-icon w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div 
            id={`accordion-content-${index}`}
            className="accordion-content"
            role="region"
            aria-labelledby={`accordion-header-${index}`}
          >
            <div className="accordion-body">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StepIndicator({ steps, currentStep, className = '', ...props }) {
  return (
    <div className={classNames('step-indicator', className)} role="list" aria-label="Các bước" {...props}>
      {steps.map((step, index) => (
        <div key={step.id || index} className={classNames('step', index === currentStep && 'active', index < currentStep && 'completed')} role="listitem">
          <div className="step-number">
            {index < currentStep ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
            ) : (
              index + 1
            )}
          </div>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Skeleton({ className = '', variant = 'text', width, height, count = 1, ...props }) {
  const baseClass = 'animate-pulse bg-tertiary rounded';
  const variantClasses = {
    text: 'h-4',
    title: 'h-6 w-3/4',
    avatar: 'rounded-full',
    card: 'rounded-lg',
    image: 'aspect-video rounded-lg',
    button: 'h-10 rounded-md',
  };
  
  const items = Array.from({ length: count }, (_, i) => (
    <div 
      key={i} 
      className={classNames(baseClass, variantClasses[variant], className)}
      style={{ width, height, minHeight: height }}
      {...props}
    />
  ));
  
  return <div className="space-y-3">{items}</div>;
}

export function Avatar({ src, alt, name, size = 'md', className = '', ...props }) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  
  const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';
  
  return (
    <div 
      className={classNames('relative inline-flex items-center justify-center overflow-hidden rounded-full bg-tertiary', sizeClasses[size], className)}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-tertiary">{initials}</span>
      )}
    </div>
  );
}

export function Rating({ value = 0, max = 5, size = 'md', showValue = false, className = '', ...props }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };
  
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  
  return (
    <div className={classNames('flex items-center gap-0.5', className)} {...props}>
      {[...Array(max)].map((_, i) => (
        <svg key={i} className={sizeClasses[size]} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          {i < fullStars ? (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          ) : hasHalfStar && i === fullStars ? (
            <>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="currentColor" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}/>
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="currentColor" opacity={0.3} style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)' }}/>
            </>
          ) : (
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="currentColor" opacity={0.3}/>
          )}
        </svg>
      ))}
      {showValue && <span className="ml-2 text-sm font-medium">{value.toFixed(1)}</span>}
    </div>
  );
}

export function Progress({ value = 0, max = 100, size = 'md', showLabel = false, className = '', ...props }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div className={classNames('w-full', className)} {...props}>
      <div className={classNames('w-full bg-tertiary rounded-full overflow-hidden', sizeClasses[size])} role="progressbar" aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}>
        <div className="bg-primary h-full rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-tertiary mt-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
}