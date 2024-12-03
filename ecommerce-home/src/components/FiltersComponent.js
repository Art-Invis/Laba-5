import React from 'react';
import SelectFilter from './SelectFilter'; 
import '../styles/FilterComponents.css';

const FiltersComponent = ({
  selectedCategory, 
  setSelectedCategory, 
  sortCriteria, 
  setSortCriteria, 
  sortOrder, 
  setSortOrder, 
  onFilterChange,
  resetFilters
}) => {
  return (
    <div className="filters-container">
      <div className="filters">
        <SelectFilter
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={[
            { value: '', label: 'All Types' },
            { value: 'tickets', label: 'Tickets' },
            { value: 'merch', label: 'Merch' },
            { value: 'albums', label: 'Albums' },
            { value: 'instruments', label: 'Instruments' },
            { value: 'vinyl', label: 'Vinyl' },
          ]}
        />

        <SelectFilter
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
          options={[
            { value: '', label: 'Default' },
            { value: 'price', label: 'Price' },
            { value: 'alphabet', label: 'Alphabet' },
            { value: 'releaseDate', label: 'Release Date' },
          ]}
        />

        <SelectFilter
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          options={[
            { value: 'asc', label: 'Ascending' },
            { value: 'desc', label: 'Descending' },
          ]}
          disabled={!sortCriteria}
        />
      </div>

      <div className="buttons-container">
        {/* <button className="apply" onClick={onFilterChange}>Apply</button> */}
        <button className="cancel" onClick={resetFilters}>Cancel</button>
      </div>
    </div>
  );
};

export default FiltersComponent;
