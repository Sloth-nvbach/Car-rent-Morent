import React from 'react';
import { classNames } from '../utils/helpers';

export function Card({ children, className = '', hover = true, padded = true, ...props }) {
  return (
    <article 
      className={classNames(
        'card',
        hover && 'transition',
        className
      )}
      {...props}
    >
      {padded ? (
        <div className="p-5">{children}</div>
      ) : (
        children
      )}
    </article>
  );
}

export function CardHeader({ children, className = '', action, ...props }) {
  return (
    <header className={classNames('card-header flex items-center justify-between', className)} {...props}>
      <div>{children}</div>
      {action && <div>{action}</div>}
    </header>
  );
}

export function CardBody({ children, className = '', ...props }) {
  return (
    <div className={classNames('card-body', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <footer className={classNames('card-footer flex items-center justify-end gap-3', className)} {...props}>
      {children}
    </footer>
  );
}

export function CardImage({ src, alt, className = '', ...props }) {
  return (
    <div className={classNames('relative overflow-hidden', className)} {...props}>
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-auto transition-transform duration-300 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
}

export function CarCard({ 
  car, 
  onClick, 
  showProvider = true,
  className = '' 
}) {
  const { formatCurrency } = require('../utils/helpers');
  
  return (
    <Card 
      className={classNames('h-full flex flex-col', className)}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      <CardImage 
        src={car.images?.[0] || 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'} 
        alt={car.name}
        className="aspect-video"
      />
      <CardBody className="flex flex-col flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-primary truncate">{car.name}</h3>
            <p className="text-sm text-tertiary mt-1 flex items-center gap-1">
              <span>{car.brand} {car.model} ({car.year})</span>
              <span className="text-border mx-1">·</span>
              <span>{car.seats} chỗ</span>
              <span className="text-border mx-1">·</span>
              <span>{car.transmission === 'auto' ? 'Số tự động' : 'Số sàn'}</span>
            </p>
          </div>
          {car.verified && (
            <span className="badge badge-primary flex-shrink-0" title="Xe đã xác minh">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Đã xác minh
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          {car.features?.slice(0, 4).map(f => (
            <span key={f} className="badge badge-gray text-xs">{f}</span>
          ))}
          {car.features && car.features.length > 4 && (
            <span className="badge badge-gray text-xs">+{car.features.length - 4} nữa</span>
          )}
        </div>
        
        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-xl text-primary">{formatCurrency(car.pricePerDay)}</p>
              <p className="text-xs text-tertiary">/ ngày</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-secondary">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
              <span>{car.rating || 4.5}</span>
              <span className="text-tertiary">({car.reviewCount || 0})</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}