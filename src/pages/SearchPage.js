import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { formatCurrency } from '../utils/helpers';
import { Filter, X, MapPin, Calendar, Clock, Car, ChevronLeft, ChevronRight, Grid, List, SlidersHorizontal, Loader2 } from 'lucide-react';
import { mockCars, cities, carTypes, transmissionTypes, fuelTypes, carFeatures } from '../data/mockData';
import { CarCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input, Select, Checkbox } from '../ui/Input';
import { Badge, Pagination, Skeleton } from '../ui/DataDisplay';
import { Modal } from '../ui/Modal';

const ITEMS_PER_PAGE = 12;

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    pickup: searchParams.get('pickup') || '',
    startDate: searchParams.get('startDate') || '',
    startTime: searchParams.get('startTime') || '09:00',
    endDate: searchParams.get('endDate') || '',
    endTime: searchParams.get('endTime') || '18:00',
    carType: '',
    transmission: '',
    fuel: '',
    priceMin: '',
    priceMax: '',
    features: [],
    sortBy: 'recommended',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  useEffect(() => {
    const newFilters = { ...filters };
    if (searchParams.get('pickup')) newFilters.pickup = searchParams.get('pickup');
    if (searchParams.get('startDate')) newFilters.startDate = searchParams.get('startDate');
    if (searchParams.get('startTime')) newFilters.startTime = searchParams.get('startTime');
    if (searchParams.get('endDate')) newFilters.endDate = searchParams.get('endDate');
    if (searchParams.get('endTime')) newFilters.endTime = searchParams.get('endTime');
    setFilters(newFilters);
    setCurrentPage(1);
  }, [searchParams]);
  
  useEffect(() => {
    if (!filters.startDate) setFilters(f => ({ ...f, startDate: today }));
    if (!filters.endDate) setFilters(f => ({ ...f, endDate: tomorrow }));
  }, []);
  
  const filteredCars = useMemo(() => {
    return mockCars.filter(car => {
      if (filters.pickup && car.location !== filters.pickup) return false;
      if (filters.carType && car.type !== filters.carType) return false;
      if (filters.transmission && car.transmission !== filters.transmission) return false;
      if (filters.fuel && car.fuel !== filters.fuel) return false;
      if (filters.priceMin && car.pricePerDay < parseInt(filters.priceMin)) return false;
      if (filters.priceMax && car.pricePerDay > parseInt(filters.priceMax)) return false;
      if (filters.features.length > 0 && !filters.features.every(f => car.features.includes(f))) return false;
      return car.status === 'available';
    });
  }, [filters]);
  
  const sortedCars = useMemo(() => {
    const cars = [...filteredCars];
    switch (filters.sortBy) {
      case 'price_asc':
        return cars.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case 'price_desc':
        return cars.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case 'rating':
        return cars.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return cars.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
  }, [filteredCars, filters.sortBy]);
  
  const totalPages = Math.ceil(sortedCars.length / ITEMS_PER_PAGE);
  const paginatedCars = sortedCars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  
  const hasActiveFilters = filters.carType || filters.transmission || filters.fuel || filters.priceMin || filters.priceMax || filters.features.length > 0;
  
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  const toggleFeature = (feature) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
    setCurrentPage(1);
  };
  
  const clearFilters = () => {
    setFilters({
      pickup: filters.pickup,
      startDate: filters.startDate,
      startTime: filters.startTime,
      endDate: filters.endDate,
      endTime: filters.endTime,
      carType: '',
      transmission: '',
      fuel: '',
      priceMin: '',
      priceMax: '',
      features: [],
      sortBy: 'recommended',
    });
    setCurrentPage(1);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.pickup) params.set('pickup', filters.pickup);
    if (filters.startDate) params.set('startDate', filters.startDate);
    if (filters.startTime) params.set('startTime', filters.startTime);
    if (filters.endDate) params.set('endDate', filters.endDate);
    if (filters.endTime) params.set('endTime', filters.endTime);
    navigate(`/search?${params.toString()}`);
  };
  
  const getCityName = (cityId) => {
    const city = cities.find(c => c.id === cityId);
    return city ? city.name : cityId;
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <section className="bg-surface border-b border-border">
        <div className="container py-6">
          <form onSubmit={handleSearch} className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
            <div className="md:flex-1 min-w-[200px]">
              <label htmlFor="pickup" className="input-label">Địa điểm nhận xe <span className="text-error">*</span></label>
              <select
                id="pickup"
                className="input-field"
                value={filters.pickup}
                onChange={(e) => updateFilter('pickup', e.target.value)}
                required
              >
                <option value="">Chọn tỉnh/thành phố</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-2 gap-3 md:grid-cols-4 min-w-[400px]">
              <div>
                <label htmlFor="startDate" className="input-label">Ngày nhận <span className="text-error">*</span></label>
                <input
                  type="date"
                  id="startDate"
                  className="input-field"
                  value={filters.startDate}
                  onChange={(e) => updateFilter('startDate', e.target.value)}
                  min={today}
                  required
                />
              </div>
              <div>
                <label htmlFor="startTime" className="input-label">Giờ nhận <span className="text-error">*</span></label>
                <input
                  type="time"
                  id="startTime"
                  className="input-field"
                  value={filters.startTime}
                  onChange={(e) => updateFilter('startTime', e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="endDate" className="input-label">Ngày trả <span className="text-error">*</span></label>
                <input
                  type="date"
                  id="endDate"
                  className="input-field"
                  value={filters.endDate}
                  onChange={(e) => updateFilter('endDate', e.target.value)}
                  min={filters.startDate || today}
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="input-label">Giờ trả <span className="text-error">*</span></label>
                <input
                  type="time"
                  id="endTime"
                  className="input-field"
                  value={filters.endTime}
                  onChange={(e) => updateFilter('endTime', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary btn-lg w-full md:w-auto md:flex-shrink-0">
              <Search className="w-5 h-5 mr-2" />
              Tìm kiếm
            </button>
          </form>
        </div>
      </section>
      
      <div className="container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0">
            <div className="card sticky top-24">
              <div className="card-header flex items-center justify-between">
                <h3 className="font-semibold">Bộ lọc</h3>
                <button className="md:hidden" onClick={() => setFiltersOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="card-body space-y-6">
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Xóa tất cả bộ lọc
                  </Button>
                )}
                
                <div>
                  <h4 className="font-medium text-primary mb-3">Loại xe</h4>
                  <div className="space-y-2">
                    {carTypes.map(type => (
                      <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="carType"
                          value={type.id}
                          checked={filters.carType === type.id}
                          onChange={(e) => updateFilter('carType', e.target.value)}
                          className="w-4 h-4 border-border text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-secondary">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-3">Hộp số</h4>
                  <div className="space-y-2">
                    {transmissionTypes.map(type => (
                      <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="transmission"
                          value={type.id}
                          checked={filters.transmission === type.id}
                          onChange={(e) => updateFilter('transmission', e.target.value)}
                          className="w-4 h-4 border-border text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-secondary">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-3">Nhiên liệu</h4>
                  <div className="space-y-2">
                    {fuelTypes.map(type => (
                      <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="fuel"
                          value={type.id}
                          checked={filters.fuel === type.id}
                          onChange={(e) => updateFilter('fuel', e.target.value)}
                          className="w-4 h-4 border-border text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-secondary">{type.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-3">Khoảng giá (VNĐ/ngày)</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Tối thiểu"
                      className="input-field w-1/2"
                      value={filters.priceMin}
                      onChange={(e) => updateFilter('priceMin', e.target.value)}
                      min="0"
                      step="100000"
                    />
                    <span className="text-tertiary">-</span>
                    <input
                      type="number"
                      placeholder="Tối đa"
                      className="input-field w-1/2"
                      value={filters.priceMax}
                      onChange={(e) => updateFilter('priceMax', e.target.value)}
                      min="0"
                      step="100000"
                    />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-primary mb-3">Tiện ích</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {carFeatures.map(feature => (
                      <label key={feature.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.features.includes(feature.id)}
                          onChange={() => toggleFeature(feature.id)}
                          className="w-4 h-4 border-border text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm text-secondary">{feature.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>
          
          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-primary">
                  {filteredCars.length} xe sẵn có
                  {filters.pickup && <span className="text-secondary font-normal ml-2">tại {getCityName(filters.pickup)}</span>}
                </h2>
                <p className="text-secondary text-sm mt-1">
                  {filters.startDate && filters.endDate && (
                    <>
                      {new Date(filters.startDate).toLocaleDateString('vi-VN')} - {new Date(filters.endDate).toLocaleDateString('vi-VN')}
                      {filters.startTime && filters.endTime && ` · ${filters.startTime} - ${filters.endTime}`}
                    </>
                  )}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Select
                  value={filters.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value)}
                  options={[
                    { value: 'recommended', label: 'Khuyên dùng' },
                    { value: 'price_asc', label: 'Giá thấp đến cao' },
                    { value: 'price_desc', label: 'Giá cao đến thấp' },
                    { value: 'rating', label: 'Đánh giá cao nhất' },
                    { value: 'newest', label: 'Mới nhất' },
                  ]}
                  className="w-[180px]"
                />
                <div className="flex items-center gap-1 bg-bg-tertiary rounded-lg p-1">
                  <button
                    className={classNames('p-2 rounded', viewMode === 'grid' ? 'bg-surface text-primary' : 'text-tertiary')}
                    onClick={() => setViewMode('grid')}
                    aria-label="Chế độ lưới"
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    className={classNames('p-2 rounded', viewMode === 'list' ? 'bg-surface text-primary' : 'text-tertiary')}
                    onClick={() => setViewMode('list')}
                    aria-label="Chế độ danh sách"
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
                <Button variant="outline" onClick={() => setFiltersOpen(true)} className="md:hidden">
                  <Filter className="w-4 h-4 mr-1" />
                  Bộ lọc
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-2 lg:grid-3 xl:grid-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} variant="card" className="aspect-[4/3]" />
                ))}
              </div>
            ) : paginatedCars.length > 0 ? (
              <>
                <div className={className(
                  viewMode === 'grid' ? 'grid grid-2 lg:grid-3 xl:grid-4 gap-6' : 'space-y-4'
                )}>
                  {paginatedCars.map(car => (
                    <Link key={car.id} to={`/cars/${car.id}`} className="block">
                      <CarCard car={car} />
                    </Link>
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-8"
                  />
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <Car className="w-16 h-16 text-tertiary mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-lg font-medium text-primary mb-2">Không tìm thấy xe phù hợp</h3>
                <p className="text-secondary mb-6">Thử thay đổi bộ lọc hoặc mở rộng khu vực tìm kiếm</p>
                <Button variant="outline" onClick={clearFilters}>Xóa bộ lọc</Button>
              </div>
            )}
          </main>
        </div>
      </div>
      
      <Modal isOpen={filtersOpen} onClose={() => setFiltersOpen(false)} title="Bộ lọc" size="lg">
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-primary mb-3">Loại xe</h4>
            <div className="space-y-2">
              {carTypes.map(type => (
                <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="carTypeModal"
                    value={type.id}
                    checked={filters.carType === type.id}
                    onChange={(e) => { updateFilter('carType', e.target.value); setFiltersOpen(false); }}
                    className="w-4 h-4 border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-secondary">{type.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-primary mb-3">Hộp số</h4>
            <div className="space-y-2">
              {transmissionTypes.map(type => (
                <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transmissionModal"
                    value={type.id}
                    checked={filters.transmission === type.id}
                    onChange={(e) => { updateFilter('transmission', e.target.value); setFiltersOpen(false); }}
                    className="w-4 h-4 border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-secondary">{type.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-primary mb-3">Nhiên liệu</h4>
            <div className="space-y-2">
              {fuelTypes.map(type => (
                <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fuelModal"
                    value={type.id}
                    checked={filters.fuel === type.id}
                    onChange={(e) => { updateFilter('fuel', e.target.value); setFiltersOpen(false); }}
                    className="w-4 h-4 border-border text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-secondary">{type.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-primary mb-3">Khoảng giá (VNĐ/ngày)</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Tối thiểu"
                className="input-field w-1/2"
                value={filters.priceMin}
                onChange={(e) => updateFilter('priceMin', e.target.value)}
                min="0"
                step="100000"
              />
              <span className="text-tertiary">-</span>
              <input
                type="number"
                placeholder="Tối đa"
                className="input-field w-1/2"
                value={filters.priceMax}
                onChange={(e) => updateFilter('priceMax', e.target.value)}
                min="0"
                step="100000"
              />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-primary mb-3">Tiện ích</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {carFeatures.map(feature => (
                <label key={feature.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.features.includes(feature.id)}
                    onChange={() => toggleFeature(feature.id)}
                    className="w-4 h-4 border-border text-primary rounded focus:ring-2 focus:ring-primary"
                  />
                  <span className="text-sm text-secondary">{feature.name}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" onClick={clearFilters}>Xóa tất cả</Button>
            <Button onClick={() => setFiltersOpen(false)}>Đóng</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}