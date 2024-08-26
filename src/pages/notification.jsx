import React, { useState, useEffect } from 'react';
import axios from "axios"; // Import Axios for API calls
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import Pagination from "../components/Pagination/pagination";

export default function Notification() {
     const [records, setRecords] = useState([]);
     const [fullForm, setFullForm] = useState(false);
     const [searchCriteria, setSearchCriteria] = useState({
          Type: 'local', // Assuming this determines the table to query

          // IPP fields
          ClasseNiceipp: '',
          NumeroTitreipp: '',
          Mandataireipp: '',
          Nommarqueipp: '',
          Deposantipp: '',
          Datedepotipp_debut: '',
          Datedepotipp_Fin: '',

          // CON fields
          Deposantcon: '',
          Datedepotcon_debut: '',
          Datedepotcon_Fin: '',
          ClasseNicecon: '',
          NumeroTitrecon: '',
          Mandatairecon: '',
          Nommarquecon: '',

     });
     useEffect(() => {
          fetchRecords();
     }, []);

     const fetchRecords = () => {
          axios.post('http://localhost:56478/api/Rithual/notification', { type: "Normal" })
               .then(response => {
                    if (Array.isArray(response.data)) {
                         const formattedRecords = response.data.map(record => ({
                              ...record,
                              SendByEmail: false, // Explicitly uncheck
                              SendByPost: false, // Explicitly uncheck
                         }));
                         setRecords(formattedRecords);
                    } else {
                         console.warn('Expected an array but received:', response.data);
                         setRecords([]);
                    }
               })
               .catch(error => console.error('Error fetching records:', error));
     };


     // Update to track user selections
     const handleCheckboxChange = (index, type) => {
          const updatedRecords = records.map((record, i) => {
               if (i === index) {
                    return {
                         ...record,
                         [type]: !record[type], // Toggle the boolean value for either SendByEmail or SendByPost
                    };
               }
               return record;
          });
          setRecords(updatedRecords);
     };
     // Example button click handler for a specific record
     const handleValidateClick = (record) => {
          const updateInfo = {
               NumeroTitreipp: record.nummarque_int,
               NumeroTitrecon: record.nummarque_c,
               SendByEmail: record.SendByEmail || false,
               SendByPost: record.SendByPost || false,
               Type: "local" // or "local" based on the context

          };

          axios.post('http://localhost:56478/api/Rithual/UpdateValidation', updateInfo)
               .then(response => {
                    console.log("Update completed successfully:", response.data);
                    fetchRecords(); // This should reset checkboxes as per fetchRecords logic
               })
               .catch(error => {
                    console.error("Error updating record:", error);
               });
     };
     const handleSearch = e => {
          e.preventDefault(); // Prevent the form from causing a page reload
          axios.post('http://localhost:56478/api/Susbrands/searchtnotification', searchCriteria)
               .then(response => {
                    if (Array.isArray(response.data)) {
                         setRecords(response.data);
                    } else {
                         console.warn('Expected an array but received:', response.data);
                         setRecords([]); // Handle non-array responses or errors
                    }
               })
               .catch(error => console.error('Search operation failed:', error));
     };

     const handleInputChange = (e) => {
          const { name, value } = e.target; // Extract the name and value from the event target (the input field)
          setSearchCriteria(prevState => ({
               ...prevState,
               [name]: value // Dynamically set the property based on the input field's name
          }));
     };

     const submitUpdates = () => {
          // Only include records that need updating (either SendByEmail or SendByPost is true)
          const updates = records.filter(record => record.SendByEmail || record.SendByPost)
               .map(record => ({
                    NumeroTitreipp: record.nummarque_int,
                    NumeroTitrecon: record.nummarque_c,
                    SendByEmail: record.SendByEmail || false,
                    SendByPost: record.SendByPost || false
               }));

          // Ensure the payload includes the Type attribute correctly
          axios.post('http://localhost:56478/api/Rithual/UpdateValidationsall', {
               Updates: updates,
               Type: "local" // Adjust based on your current context or make it dynamic
          })
               .then(response => {
                    console.log("All updates completed successfully:", response.data);
                    fetchRecords(); // Refresh the table to reflect the updates
               })
               .catch(error => {
                    console.error("Error updating records:", error);
               });
     };


     const deletenotificationClick = (record) => {
          const updateInfo = {
               NumeroTitreipp: record.nummarque_int,
               NumeroTitrecon: record.nummarque_c,
               SendByEmail: false, // Assuming deletion doesn't care about these
               SendByPost: false,  // but included to match the expected payload structure
               Type: "local" // or "local" based on the context

          };

          axios.post('http://localhost:56478/api/Rithual/deletenotification', updateInfo)
               .then(response => {
                    console.log("Delete completed successfully:", response.data);
                    fetchRecords(); // Refresh the records to reflect the deletion
               })
               .catch(error => {
                    console.error("Error during deletion:", error);
                    // Optionally, implement error handling logic here
               });
     };
     const generatePDF = async (record) => {
          const requestData = {
              NumeroTitreipp: record.nummarque_int,
              NumeroTitrecon: record.nummarque_c,
              type: 'local' // Assuming `type` is part of `record`
          };
      
          console.log('Sending request with data:', requestData);
      
          try {
              const response = await axios.post('http://localhost:56478/api/Pdf/Generatealert_FR', requestData, {
                  responseType: 'blob'
              });
      
              console.log('Response received:', response);
              const contentDisposition = response.headers['content-disposition'];
              let filename = 'default-filename.pdf';
      
              if (contentDisposition) {
                  const filenameMatch = /filename\*?=(?:UTF-8''(.+)|["']?(.+?)(?=["';]|$))/i.exec(contentDisposition);
                  if (filenameMatch) {
                      filename = decodeURIComponent(filenameMatch[1] || filenameMatch[2]);
                  }
              }
      
              console.log('Filename:', filename);
      
              const blob = new Blob([response.data], { type: 'application/pdf' });
              const downloadUrl = window.URL.createObjectURL(blob);
              console.log('Download URL:', downloadUrl);
      
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.setAttribute('download', filename);
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(downloadUrl);
          } catch (error) {
              console.error('Error generating PDF:', error);
              if (error.response) {
                  console.error('Error response:', await error.response.data.text());
                  console.error('Error status:', error.response.status);
                  console.error('Error headers:', error.response.headers);
              } else if (error.request) {
                  console.error('Error request:', error.request);
              } else {
                  console.error('Error message:', error.message);
              }
          }
      };
      
      const generatePDFANG = async (record) => {
          const requestData = {
              NumeroTitreipp: record.nummarque_int,
              NumeroTitrecon: record.nummarque_c,
              type: 'local' // Assuming `type` is part of `record`
          };
      
          console.log('Sending request with data:', requestData);
      
          try {
              const response = await axios.post('http://localhost:56478/api/Pdf/Generatealert_Ang', requestData, {
                  responseType: 'blob'
              });
      
              console.log('Response received:', response);
              const contentDisposition = response.headers['content-disposition'];
              let filename = 'default-filename.pdf';
      
              if (contentDisposition) {
                  const filenameMatch = /filename\*?=(?:UTF-8''(.+)|["']?(.+?)(?=["';]|$))/i.exec(contentDisposition);
                  if (filenameMatch) {
                      filename = decodeURIComponent(filenameMatch[1] || filenameMatch[2]);
                  }
              }
      
              console.log('Filename:', filename);
      
              const blob = new Blob([response.data], { type: 'application/pdf' });
              const downloadUrl = window.URL.createObjectURL(blob);
              console.log('Download URL:', downloadUrl);
      
              const link = document.createElement('a');
              link.href = downloadUrl;
              link.setAttribute('download', filename);
              document.body.appendChild(link);
              link.click();
              link.remove();
              window.URL.revokeObjectURL(downloadUrl);
          } catch (error) {
              console.error('Error generating PDF:', error);
              if (error.response) {
                  console.error('Error response:', await error.response.data.text());
                  console.error('Error status:', error.response.status);
                  console.error('Error headers:', error.response.headers);
              } else if (error.request) {
                  console.error('Error request:', error.request);
              } else {
                  console.error('Error message:', error.message);
              }
          }
      };
     return (
          <>
               <section>
                    <PageTitle>Notification des conflits</PageTitle>
                    <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16">
                         <h3 className="text-sm mb-2">Saisie les informations des marques:</h3>
                         <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <InputField
                                   id="ValidationTrademarkName"
                                   name="Nommarquecon"
                                   label="Nom de la marque antérieure"
                                   type="text"
                                   placeholder="Nom"
                                   required={true}
                                   value={searchCriteria.Nommarquecon}
                                   onChange={handleInputChange}
                              />
                              <InputField
                                   id="ValidationTrademarkNum"
                                   name="NumeroTitrecon"
                                   label="Numero de marque antérieure"
                                   type="text"
                                   placeholder="Numero"
                                   required={true}
                                   value={searchCriteria.NumeroTitrecon}
                                   onChange={handleInputChange}
                              />
                              <InputField
                                   id="ValidationTrademarkApplicant"
                                   name="Deposantcon"
                                   label="Déposant"
                                   type="text"
                                   placeholder="Nom"
                                   required={true}
                                   value={searchCriteria.Deposantcon}
                                   onChange={handleInputChange}
                              />
                              <InputField
                                   id="ValidationTrademarkNiceClass"
                                   name="ClasseNicecon"
                                   label="Classe nice"
                                   type="text"
                                   placeholder="Classe"
                                   value={searchCriteria.ClasseNicecon}
                                   onChange={handleInputChange}
                              />
                              <InputField
                                   id="ValidationStartDate"
                                   name="Datedepotcon_debut"
                                   label="début date"
                                   type="date"
                                   value={searchCriteria.Datedepotcon_debut}
                                   onChange={handleInputChange}
                              />
                              <InputField
                                   id="ValidationEndDate"
                                   name="Datedepotcon_Fin"
                                   label="Fin date" 
                                   type="date"
                                   value={searchCriteria.Datedepotcon_Fin}
                                   onChange={handleInputChange}
                              />
                              <InputField
                                   id="ValidationTrademarkRepresentative"
                                   name="Mandatairecon"
                                   label="Mandataire"
                                   type="text"
                                   placeholder="Mandataire"
                                   required={true}
                                   value={searchCriteria.Mandatairecon}
                                   onChange={handleInputChange}
                              />
                              <InputField id="NotificationStatus" label="État" type="text" placeholder="État " />
                         </div>
                         <div className="flex flex-wrap md:gap-4 gap-2">
                              <Button type={"submit"} name={"NotificationSearch"} onClick={handleSearch}>Chercher</Button>
                              <Button type={"button"} name={"ValidationValider"} onClick={submitUpdates} bg={true}>Valider</Button>
                         </div>
                    </form>
               </section>
               <section className="bg-white py-10 shadow-lg rounded-md">
                    <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                         <Pagination classes={"!mt-0"} />
                    </div>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                         <table name="NotificationTable" className="xl:w-full w-max">
                              <thead>
                                   <tr>
                                        <th>SL</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Email</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Post</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Marque Contestée</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Numero Marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Image </th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Image </th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Numero Marque ant</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Marque Antérieure</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> PDF</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> validation  d'evoi</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {records.map((record, index) => (
                                        <tr key={index}>
                                             <td>{index + 1}</td>
                                             <td>
                                                  <CheckBox
                                                       checked={record.SendByEmail || false}
                                                       onChange={() => handleCheckboxChange(index, 'SendByEmail')}
                                                       classes={"!mb-0"}
                                                  />
                                             </td>
                                             <td>
                                                  <CheckBox
                                                       checked={record.SendByPost || false}
                                                       onChange={() => handleCheckboxChange(index, 'SendByPost')}
                                                       classes={"!mb-0"}
                                                  />
                                             </td>
                                             <td dangerouslySetInnerHTML={{ __html: record.marque_c }}></td>
                                             <td>{record.nummarque_c}</td>
                                             <td><img src={record.ImageC} alt="Contested" /></td>
                                             <td><img src={record.ImageA} alt="Anterior" /></td>
                                             <td>{record.nummarque_int}</td>
                                             <td dangerouslySetInnerHTML={{ __html: record.marq_a }}></td>
                                             <td >
                                                   <Button onClick={() => generatePDF(record)}>version_Fr</Button>
                                                  <Button bg={true} onClick={() => generatePDFANG(record)}>version_En</Button>
                                             </td>

                                             <td >
                                                  <Button onClick={() => handleValidateClick(record)}>Validate</Button>
                                                  <Button bg={true} onClick={() => deletenotificationClick(record)}>supprimer</Button>
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         </table>
                    </div>
               </section>
          </>
     )
}

