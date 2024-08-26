import { faArrowDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import React,{ useState , useRef } from "react";
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import DropDown from "../components/Input/dropDown";
import InputField from "../components/Input/inputField";
import SortableHeader from "../components/SortableHeader/SortableHeader";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import IconDev from "../components/IconDiv/iconDiv";
import Pagination from "../components/Pagination/pagination";

import AtomicSpinner from 'atomic-spinner';
import { useNavigate } from 'react-router-dom';

export default function Listwl() {
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
          search_field: '',
          Numero:""
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
            event.preventDefault(); // Prevent the default form submission action
            setIsLoading(true);
          
            const apiEndpoint = 'http://192.168.2.111:56478/api/Watchlist/getlist'; // Replace with your actual API endpoint
          
            try {
              const requestBody = {
                search_field: formData.search_field,
                Numero: formData.Numero
              };
              console.log(requestBody);
          
              const response = await fetch(apiEndpoint, {
                method: 'POST', // Change the method to 'POST' for sending data in the request body
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody) // Convert the JavaScript object to a JSON string
              });
          
              if (!response.ok) {
                // If the HTTP response status code is not in the 200-299 range
                throw new Error(`API call failed with status: ${response.status}`);
              }
          
              const data = await response.json(); // Assuming your API responds with JSON data
              setApiData(data);
              setSortColumn('Numero');
              setSortOrder('desc');
            } catch (error) {
              console.error("Failed to send data to API:", error);
              // Handle errors (e.g., show an error message to the user)
            } finally {
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
      const iconClickHandlers = {
          
        iconSearch: handleSubmit,  // This key must match exactly with the name in `iconList`
        

        
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
                    <InputField
                    id="rechercheMarqueBrandName"
                    label="Nom marque"
                    type="text"
                    placeholder="Nom"
                    required={true}
                    classes={"lg:w-1/2"}
                    value={formData.search_field}
                    onChange={(e) => handleInputChange(e, 'search_field')}
                    />
                    <InputField
                    id="rechercheMarqueNumero"
                    label="Numero"
                    type="text"
                    placeholder="Numero"
                    required={true}
                    classes={"lg:w-1/2"}
                    value={formData.Numero}
                    onChange={(e) => handleInputChange(e, 'Numero')}
                    />
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
                              <tbody>
                                {isLoading ? (
                                    <tr>
                                    <td colSpan="9" style={{ textAlign: 'center' }}>
                                        <AtomicSpinner />
                                    </td>
                                    </tr>
                                ) : sortedData.length > 0 ? (
                                    sortedData.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                        <input
                                            type="checkbox"
                                            id={`checkbox_${item.Numero}`}
                                            ref={el => (checkboxes.current[item.Numero] = el)}
                                        />
                                        </td>
                                        <td>{item.Numero}</td>
                                        <td>
                                        <img src={item.ImgUrl} alt="Brand" style={{ width: "100px", height: "auto" }} />
                                        </td>
                                        <td className="Nom_marque">{item.Name_ompic}</td>
                                        <td className="deposant">{item.BrandOwner_ompic}</td>
                                        <td className="Date_depot">{item.Date_depot_ompic.split(' ')[0]}</td>
                                        <td className="Date_expiration">{item.Date_expiration_ompic.split(' ')[0]}</td>
                                        <td className="Statut">{item.Statut_ompic}</td>
                                        <td style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <NavigationButton item={item} />
                                            <Button
                                                bg={true}
                                                onClick={() => {
                                                const confirmDelete = window.confirm(`Are you sure you want to delete brand ${item.Numero}?`);
                                                if (confirmDelete) {
                                                    // Perform the delete action, e.g., make an API request to delete the brand
                                                    const deleteUrl = `http://192.168.2.111:56478/api/Watchlist/delete-brand`;
                                                    const requestData = { Numero: item.Numero };
                                                    fetch(deleteUrl, {
                                                        method: 'POST',
                                                        headers: {
                                                          'Content-Type': 'application/json',
                                                        },
                                                        body: JSON.stringify(requestData),
                                                      })
                                                        .then(response => {
                                                          if (response.ok) {
                                                            // Brand deleted successfully, update the table or refresh the page
                                                            console.log(`Brand ${item.Numero} deleted successfully`);
                                                            setApiData(prevData => prevData.filter(brand => brand.Numero !== item.Numero));
                                                          } else {
                                                            // Handle the case when the delete request fails
                                                            console.error(`Failed to delete brand ${item.Numero}. Status: ${response.status}`);
                                                            throw new Error(`Failed to delete brand ${item.Numero}`);
                                                          }
                                                        })
                                                        .catch(error => {
                                                          console.error(`Error deleting brand ${item.Numero}:`, error);
                                                          // Handle the error, display an error message, or perform any necessary actions
                                                        });
                                                }
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                    <td colSpan="100%">No data available</td>
                                    </tr>
                                )}
                                </tbody>
                         </table>
                    </div>
               </section>
          </>
     )
}