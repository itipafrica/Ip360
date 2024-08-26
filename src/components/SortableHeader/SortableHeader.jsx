import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

const SortableHeader = ({ label, columnName, sortColumn, sortOrder, onSort, hidden }) => {
  const handleClick = () => {
    onSort(columnName);
  };

  const headerClasses = `${label.replace(' ', '_')} ${hidden ? ' hidden_searchbd' : ''}`;

  return (
    <th className={headerClasses} onClick={handleClick} style={{ cursor: 'pointer' }}>
      {label}
      {sortColumn === columnName && (
        <span>
          {sortOrder === 'asc' ? <FontAwesomeIcon icon={faArrowUp} /> : <FontAwesomeIcon icon={faArrowDown} />}
        </span>
      )}
    </th>
  );
};

export default SortableHeader;
