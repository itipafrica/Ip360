import { faArrowDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, useCallback } from "react";
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import DropDown from "../components/Input/dropDown";
import InputField from "../components/Input/inputField";
import SortableHeader from "../components/SortableHeader/SortableHeader";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import headerImage from 'C:/Users/Administrateur/source/repos/test/test/images/header-IP-AFRICA.png';

import IconDev from "../components/IconDiv/iconDiv";
import Pagination from "../components/Pagination/pagination";

import AtomicSpinner from 'atomic-spinner';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
export default function RechercheMarque() {
     const iconList = ["iconSearch", "iconPdf", "iconPdfSelect"];
     const [isLoading, setIsLoading] = useState(false);
     const checkboxes = useRef({});
     
     const [isLoadingtwo, setIsLoadingtwo] = useState(false);
     const [apiData, setApiData] = useState(null);
     const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
     const columns = [
          { columnName: "Numero", label: "Numero Titre" ,hidden: false},
          { columnName: "Image", label: "Image" ,hidden: false},
          { columnName: "Name", label: "Nom marque",hidden: false },
          { columnName: "BrandOwner", label: "Deposant",hidden: false },      
          { columnName: "Date_depot", label: "Date depot",hidden: false },
          { columnName: "Date_expiration", label: "Date expiration",hidden: false },         
          { columnName: "Statut", label: "Statut marque",hidden: false },
          
        ];
        const handleColumnToggle = (selectedValue) => {
          const selectedColumn = String(selectedValue).replace(/\s+/g, "_");
          console.log(selectedColumn);
          const elements = document.getElementsByClassName(selectedColumn);
          console.log(elements);
          for (const element of elements) {
              element.classList.toggle('hidden_searchbd' );
          }
      };
      

      const [formData, setFormData] = useState({
          search_field: ''
        });



        const handleInputChange = (e, section, field = null, subattribute = null) => {
          // Handling JSON string input for nested properties
          if (subattribute) {
            try {
              const parsedJson = JSON.parse(e.target.value);
              setFormData(prevState => ({
                ...prevState,
                [section]: {
                  ...prevState[section],
                  [field]: {
                    ...prevState[section][field],
                    ...parsedJson,
                  },
                },
              }));
            } catch (error) {
              console.error("Error parsing JSON input:", error);
              // Optionally handle parsing errors (e.g., invalid JSON input)
            }
          } else if (field) {
            // For nested properties with direct input
            setFormData(prevState => ({
              ...prevState,
              [section]: {
                ...prevState[section],
                [field]: e.target.value,
              },
            }));
          } else {
            // For top-level properties with direct input
            setFormData(prevState => ({
              ...prevState,
              [section]: e.target.value,
            }));
          }
        };
        const handleSubmit = async (event) => {
         // Prevent the default form submission action
          setIsLoading(true);

          const apiEndpoint = 'http://192.168.2.111:56478/api/RechercheMrq'; // Replace with your actual API endpoint
        
          try {
            const requestBody = {
               search_field: formData.search_field
            };
            console.log(requestBody);
            const response = await fetch(apiEndpoint, {
              method: 'POST', // Assuming POST, but adjust if your API uses a different method
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody), // Convert the JavaScript object to a JSON string
            });
        
            if (!response.ok) {
              // If the HTTP response status code is not in the 200-299 range
              throw new Error(`API call failed with status: ${response.status}`);
            }
        
            const data = await response.json(); // Assuming your API responds with JSON data
            console.log(data);
            setApiData(data);
            const sortedData = applySortingLogic(data, "Numero", "desc"); // Handle the API response (e.g., display a message or update the state)
          } catch (error) {
            console.error("Failed to send data to API:", error);
            // Handle errors (e.g., show an error message to the user)
          }
          finally {
            setIsLoading(false); // End loading
        }
        };
        const applySortingLogic = (data, sortColumn, sortOrder) => {
          if (!sortColumn) {
            // If no column is selected for sorting, return the data as-is
            return data;
          }
        
          const sortedData = [...data];
        
          sortedData.sort((a, b) => {
            const columnA = getColumnValue(a, sortColumn);
            const columnB = getColumnValue(b, sortColumn);
        
            // Assuming column values are either strings, dates, or numbers
            if (typeof columnA === 'string') {
              // Case-insensitive alphabetical order for strings
              return sortOrder === 'asc' ? columnA.localeCompare(columnB) : columnB.localeCompare(columnA);
            } else if (columnA instanceof Date) {
              // Sort dates based on chronological order
              return sortOrder === 'asc' ? columnA - columnB : columnB - columnA;
            } else if (typeof columnA === 'number') {
              // Sort numbers based on magnitude
              return sortOrder === 'asc' ? columnA - columnB : columnB - columnA;
            }
        
            // Handle other data types as needed
            return 0; // Default case, no sorting
          });
        
          return sortedData;
        };
        // Define the handleSort function
      const handleSort = (columnName) => {
        // Your sorting logic here
        setSortColumn(columnName);
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
      };
        
        const getColumnValue = (obj, column) => {
          const columnHierarchy = column.split('.');
          let value = obj;
        
          for (const prop of columnHierarchy) {
            value = value[prop];
          }
        
          return value;
        };
        const generateSortableHeaders = () => {
      
    
          return columns.map((column) => (
            <SortableHeader
              key={column.columnName}
              columnName={column.columnName}
              label={column.label}
              sortColumn={sortColumn}
              sortOrder={sortOrder}
              onSort={handleSort}
              hidden={column.hidden || false}
            />
          ));
        };
        const sortedData = apiData ? applySortingLogic(apiData, sortColumn, sortOrder) : [];
        const generatePDFSelected = useCallback(async () => {
          const selectedData = sortedData.filter(item => checkboxes.current[item.Numero]?.checked);
      
          if (selectedData.length === 0) {
              alert("No items selected.");
              return;
          }
      
          const config = {
              pageWidth: 297,
              pageHeight: 210,
              marginLeft: 15,
              marginRight: 5,
              marginTop: 40,
              marginBottom: 20,
              headerImageWidth: 270,
              headerImageHeight: 20,
              fontSize: 8,
              headerFontSize: 9,
              rowHeight: 30,
              imageWidth: 20,
              imageHeight: 20
          };
      
          const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4'
          });
      
          const headers = ["Numero", "Image", "Nom marque", "Deposant", "Date depot", "Date expiration", "Statut"];
          const columnWidths = [20, 30, 50, 50, 30, 30, 40];
      
          const addHeaderImage = () => {
              pdf.addImage(headerImage, 'JPEG', config.marginLeft, 5, config.headerImageWidth, config.headerImageHeight);
          };
      
          const drawHeader = () => {
              pdf.setFontSize(config.headerFontSize);
              pdf.setFont('helvetica', 'bold');
              let xOffset = config.marginLeft;
              headers.forEach((header, index) => {
                  pdf.rect(xOffset, config.marginTop - 10, columnWidths[index], 10);
                  pdf.text(header, xOffset + 2, config.marginTop - 4);
                  xOffset += columnWidths[index];
              });
          };
      
          const drawRow = async (item, y) => {
              pdf.setFontSize(config.fontSize);
              pdf.setFont('helvetica', 'normal');
              let xOffset = config.marginLeft;
      
              const cellData = [
                  item.Numero,
                  '', // Placeholder for image
                  item.Name,
                  item.BrandOwner,
                  item.Date_depot,
                  item.Date_expiration,
                  item.Statut
              ];
      
              let maxHeight = config.rowHeight;
      
              cellData.forEach((cell, index) => {
                  if (index !== 1) {
                      const cellHeight = pdf.getTextDimensions(cell, {maxWidth: columnWidths[index] - 4}).h + 4;
                      maxHeight = Math.max(maxHeight, cellHeight);
                  }
              });
      
              for (let index = 0; index < cellData.length; index++) {
                  pdf.rect(xOffset, y, columnWidths[index], maxHeight);
                  if (index === 1) {
                      await addImage(pdf, item.ImgUrl, xOffset + 5, y + (maxHeight - config.imageHeight) / 2, config.imageWidth, config.imageHeight);
                  } else {
                      pdf.text(cellData[index], xOffset + 2, y + 4, { maxWidth: columnWidths[index] - 4 });
                  }
                  xOffset += columnWidths[index];
              }
      
              return maxHeight;
          };
      
          const drawPage = async (dataSlice, pageNumber) => {
              if (pageNumber > 1) {
                  pdf.addPage();
              }
              addHeaderImage();
              drawHeader();
      
              let y = config.marginTop;
              for (const item of dataSlice) {
                  const rowHeight = await drawRow(item, y);
                  y += rowHeight;
                  if (y > config.pageHeight - config.marginBottom) {
                      addPageNumber(pageNumber);
                      pdf.addPage();
                      addHeaderImage();
                      drawHeader();
                      y = config.marginTop;
                      pageNumber++;
                  }
              }
              addPageNumber(pageNumber);
          };
      
          const addImage = async (pdf, imgUrl, x, y, width, height) => {
              try {
                  const img = await loadImage(imgUrl);
                  pdf.addImage(img, 'JPEG', x, y, width, height);
              } catch (error) {
                  console.error(`Failed to load image: ${imgUrl}`, error);
                  pdf.text('Image not available', x, y + height / 2);
              }
          };
      
          const loadImage = (url) => {
              return new Promise((resolve, reject) => {
                  const img = new Image();
                  img.crossOrigin = "Anonymous";
                  img.onload = () => resolve(img);
                  img.onerror = reject;
                  img.src = url;
              });
          };
      
          const addPageNumber = (pageNumber) => {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.text(`Page ${pageNumber}`, config.pageWidth - 20, config.pageHeight - 10, { align: 'right' });
          };
      
          const itemsPerPage = Math.floor((config.pageHeight - config.marginTop - config.marginBottom) / config.rowHeight);
      
          for (let i = 0, pageNumber = 1; i < selectedData.length; i += itemsPerPage, pageNumber++) {
              await drawPage(selectedData.slice(i, i + itemsPerPage), pageNumber);
          }
      
          pdf.save('selected_recherche_marque.pdf');
      }, [sortedData, checkboxes, headerImage]);
        const generatePDF = useCallback(async () => {
          if (!sortedData || sortedData.length === 0) {
              console.error('No data available to generate PDF');
              return;
          }
      
          const config = {
              pageWidth: 297,
              pageHeight: 210,
              marginLeft: 15,
              marginRight: 5,
              marginTop: 40,
              marginBottom: 20,
              headerImageWidth: 270,
              headerImageHeight: 20,
              fontSize: 8,
              headerFontSize: 9,
              rowHeight: 30,
              imageWidth: 20,
              imageHeight: 20
          };
      
          const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4'
          });
      
          const headers = ["Numero", "Image", "Nom marque", "Deposant", "Date depot", "Date expiration", "Statut"];
          const columnWidths = [20, 30, 50, 50, 30, 30, 40];
      
          const addHeaderImage = () => {
              pdf.addImage(headerImage, 'JPEG', config.marginLeft, 5, config.headerImageWidth, config.headerImageHeight);
          };
      
          const drawHeader = () => {
              pdf.setFontSize(config.headerFontSize);
              pdf.setFont('helvetica', 'bold');
              let xOffset = config.marginLeft;
              headers.forEach((header, index) => {
                  pdf.rect(xOffset, config.marginTop - 10, columnWidths[index], 10);
                  pdf.text(header, xOffset + 2, config.marginTop - 4);
                  xOffset += columnWidths[index];
              });
          };
      
          const drawRow = async (item, y) => {
              pdf.setFontSize(config.fontSize);
              pdf.setFont('helvetica', 'normal');
              let xOffset = config.marginLeft;
      
              const cellData = [
                  item.Numero,
                  '', // Placeholder for image
                  item.Name,
                  item.BrandOwner,
                  item.Date_depot,
                  item.Date_expiration,
                  item.Statut
              ];
      
              let maxHeight = config.rowHeight;
      
              cellData.forEach((cell, index) => {
                  if (index !== 1) {
                      const cellHeight = pdf.getTextDimensions(cell, {maxWidth: columnWidths[index] - 4}).h + 4;
                      maxHeight = Math.max(maxHeight, cellHeight);
                  }
              });
      
              for (let index = 0; index < cellData.length; index++) {
                  pdf.rect(xOffset, y, columnWidths[index], maxHeight);
                  if (index === 1) {
                      await addImage(pdf, item.ImgUrl, xOffset + 5, y + (maxHeight - config.imageHeight) / 2, config.imageWidth, config.imageHeight);
                  } else {
                      pdf.text(cellData[index], xOffset + 2, y + 4, { maxWidth: columnWidths[index] - 4 });
                  }
                  xOffset += columnWidths[index];
              }
      
              return maxHeight;
          };
      
          const drawPage = async (dataSlice, pageNumber) => {
              if (pageNumber > 1) {
                  pdf.addPage();
              }
              addHeaderImage();
              drawHeader();
      
              let y = config.marginTop;
              for (const item of dataSlice) {
                  const rowHeight = await drawRow(item, y);
                  y += rowHeight;
                  if (y > config.pageHeight - config.marginBottom) {
                      addPageNumber(pageNumber);
                      pdf.addPage();
                      addHeaderImage();
                      drawHeader();
                      y = config.marginTop;
                      pageNumber++;
                  }
              }
              addPageNumber(pageNumber);
          };
      
          const addImage = async (pdf, imgUrl, x, y, width, height) => {
              try {
                  const img = await loadImage(imgUrl);
                  pdf.addImage(img, 'JPEG', x, y, width, height);
              } catch (error) {
                  console.error(`Failed to load image: ${imgUrl}`, error);
                  pdf.text('Image not available', x, y + height / 2);
              }
          };
      
          const loadImage = (url) => {
              return new Promise((resolve, reject) => {
                  const img = new Image();
                  img.crossOrigin = "Anonymous";
                  img.onload = () => resolve(img);
                  img.onerror = reject;
                  img.src = url;
              });
          };
      
          const addPageNumber = (pageNumber) => {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              pdf.text(`Page ${pageNumber}`, config.pageWidth - 20, config.pageHeight - 10, { align: 'right' });
          };
      
          const itemsPerPage = Math.floor((config.pageHeight - config.marginTop - config.marginBottom) / config.rowHeight);
      
          const selectedRows = Object.entries(checkboxes.current)
              .filter(([key, checkbox]) => key !== 'selectAll' && checkbox.checked)
              .map(([key]) => key);
      
          const dataToInclude = selectedRows.length > 0
              ? sortedData.filter(item => selectedRows.includes(item.Numero))
              : sortedData;
      
          for (let i = 0, pageNumber = 1; i < dataToInclude.length; i += itemsPerPage, pageNumber++) {
              await drawPage(dataToInclude.slice(i, i + itemsPerPage), pageNumber);
          }
      
          pdf.save('recherche_marque_report.pdf');
      }, [sortedData, checkboxes, headerImage, formData.search_field]);
      const iconClickHandlers = {
          
        iconSearch: handleSubmit,  // This key must match exactly with the name in `iconList`
        iconPdf: generatePDF,
        iconPdfSelect:generatePDFSelected,
        
    };
    const NavigationButton = ({ item }) => {
      const baseUrl = "http://search.ompic.ma/web/pages/";
      const idString = String(item.Id || ''); // Convert to string, use empty string if null/undefined
      const url = idString.trim() !== ''
        ? `${baseUrl}consulterMarque.do?id=${idString}`
        : `${baseUrl}consulterMarqueTMView.do?refReglementationTitreLabel=97-${item.Numero}`;
    
      return (
        <Button bg={true} onClick={() => window.open(url, '_blank')}>
          Ompic
        </Button>
      );
    };
    const handleSelectAll = (event) => {
      const isChecked = event.target.checked;
      
      // Update all checkboxes
      Object.values(checkboxes.current).forEach(checkbox => {
        if (checkbox && checkbox !== event.target) {
          checkbox.checked = isChecked;
        }
      });};
     return (
          <>
               <PageTitle>Recherche Marque</PageTitle>
               <section className="bg-white py-10 shadow-lg rounded-md">
                    <form className="flex flex-wrap items-center gap-x-6 px-8 mb-8 " onSubmit={handleSubmit}>
                         <InputField id="rechercheMarqueBrandName" label="Nom marque" type="text" placeholder="Nom" required={true} classes={"lg:w-1/2"} value={formData.search_field}
  onChange={(e) => handleInputChange(e, 'search_field')} />
                         <IconDev list={iconList} classes={"!w-auto flex-grow"}  onClickHandlers={iconClickHandlers}/>
                         <Pagination classes={"!mt-0"} />
                    </form>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                    {sortedData.length > 0 && (
                      <p style={{ fontSize: '14px', marginBottom: '35px',marginLeft :'35px', color: '#666' }}>
                        Nombre de résultats : {sortedData.length}
                      </p>
                    )}
                    
                         <table name="rechercheMarqueTable" className="xl:w-full w-max" >
                              <thead>
                                   <tr>
                                   <th>
                                    <input 
                                      type="checkbox" 
                                      id="selectAll" 
                                      onChange={handleSelectAll} 
                                      ref={el => checkboxes.current['selectAll'] = el}
                                    />
                                    
                                  </th>
                                        {generateSortableHeaders()}
                                        <th>Action</th>
                                   </tr>
                              </thead>
                              {isLoading ? (
                              <tbody style={{ position: 'relative', height: '200px' }}> {/* Set a minimum height */}
                                   <tr>
                                        <td colSpan="9" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                             <AtomicSpinner />
                                        </td>
                                   </tr>
                              </tbody>
                         ) : (
                              <tbody>
                              {sortedData.length > 0 ? (
                                  sortedData.map((item, index) => (
                                    <tr key={index}>
                                      <td>
                                        {/* Add a checkbox with a unique ID based on item.Numero */}
                                        <input type="checkbox" id={`checkbox_${item.Numero}`} ref={el => (checkboxes.current[item.Numero] = el)} />
                                      </td>
                                      <td>{item.Numero}</td>
                                      <td>
                                        {/* Image here, using item.ImgUrl for the src attribute */}
                                        <img src={item.ImgUrl} alt="Brand" style={{ width: "100px", height: "auto" }} />
                                      </td>
                                      
                                      <td className="Nom_marque">{item.Name}</td>
                                      <td className="deposant">{item.BrandOwner}</td>
                                      <td className="Date_depot">{item.Date_depot}</td>
                                      <td className="Date_expiration">{item.Date_expiration}</td>
                                      <td className="Statut">{item.Statut}</td>
                                      <td  style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                      

                                      <NavigationButton item={item} />
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="100%">IP AFRICA</td>
                                  </tr>
                                )} 
                              </tbody> )}
                         </table>
                    </div>
               </section>
          </>
     )
}