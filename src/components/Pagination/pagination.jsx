import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

// ... (your imports)

const Pagination = ({ itemsPerPage, totalItems, setCurrentPage, currentPage, sortedData }) => {
     const [displayedRows, setDisplayedRows] = useState([]);
     
     useEffect(() => {
       if (!sortedData || sortedData.length === 0) {
         // Handle the case when no search is done or data is empty
         setDisplayedRows([]);
         return;
       }
   
       const startIndex = (currentPage - 1) * itemsPerPage;
       const endIndex = startIndex + itemsPerPage;
       const displayedRows = sortedData.slice(startIndex, endIndex);
       setDisplayedRows(displayedRows);
     }, [currentPage, sortedData, itemsPerPage]);
   
     const handlePrevClick = () => {
       if (currentPage > 1) {
         setCurrentPage(currentPage - 1);
       }
     };
   
     const handleNextClick = () => {
       const lastPage = Math.ceil(totalItems / itemsPerPage);
       if (currentPage < lastPage) {
         setCurrentPage(currentPage + 1);
       }
     };
   
     return (
       <div className="flex items-center gap-2.5 w-auto mt-6 ml-auto">
         <button
           type="button"
           disabled={currentPage === 1}
           onClick={handlePrevClick}
           className="w-6 h-6 rounded-sm bg-sky text-white"
         >
           <FontAwesomeIcon icon={faAngleLeft} />
         </button>
         <span className="text-sky text-base font-semibold">{currentPage}</span>
         <button
           type="button"
           disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
           onClick={handleNextClick}
           className="w-6 h-6 rounded-sm bg-sky text-white"
         >
           <FontAwesomeIcon icon={faAngleRight} />
         </button>
       </div>
     );
   };
   
   export default Pagination;
   
