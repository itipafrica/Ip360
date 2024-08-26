import React, { useState, useEffect } from 'react';
import axios from "axios"; // Import Axios for API calls
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../components/Pagination/pagination";

export default function ValidationIpro() {
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
    axios.post('http://localhost:56478/api/Rithual', { type: "Normal" })
      .then(response => {
        // Ensure the response data is an array before setting it to state
        if (Array.isArray(response.data)) {
          setRecords(response.data);
        } else {
          // Handle the case where data is not an array, such as setting an empty array or logging a warning
          console.warn('Expected an array but received:', response.data);
          setRecords([]); // Set to empty array or handle as needed
        }
      })
      .catch(error => console.error('Error performing operations:', error));
  };

  // Assuming the other parts of the component remain unchanged
  const handleSearch = e => {
    e.preventDefault(); // Prevent the form from causing a page reload
    axios.post('http://localhost:56478/api/Susbrands/searchtherithual', searchCriteria)
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
  
  const handleValidate = (NumeroTitreipp, NumeroTitrecon) => {
    // Call API to validate a single record
    axios.post('http://localhost:56478/api/Susbrands/validate', {
      type: "local", // or "global", as needed
      NumeroTitreipp,
      NumeroTitrecon,
    }).then(() => {
      fetchRecords(); // Refresh records after validation
    }).catch(error => console.error('Error validating record:', error));
  };

  const handleDelete = (NumeroTitreipp, NumeroTitrecon) => {
    // Call API to delete a single record
    axios.post('http://localhost:56478/api/Susbrands/deleted', {
      type: "local", // or "global", as needed
      NumeroTitreipp,
      NumeroTitrecon,
    }).then(() => {
      fetchRecords(); // Refresh records after deletion
    }).catch(error => console.error('Error deleting record:', error));
  };

  const handleValidateAll = () => {
    // Construct the payload with all records' identifiers and validation status
    const recordsToValidate = records.map(record => ({
      NumeroTitreipp: record.nummarque_c, // Assuming nummarque_c corresponds to NumeroTitreipp
      NumeroTitrecon: record.nummarque_int, // Assuming nummarque_int corresponds to NumeroTitrecon
      IsValidated: true // Assuming you want to set all records as validated; adjust as needed
    }));

    // Debug to check if the mapping is correctly done
    console.log('Records to validate:', recordsToValidate);

    axios.post('http://localhost:56478/api/Susbrands/ValidateAll', {
      type: "local", // Adjust as necessary
      Records: recordsToValidate,
    })
      .then(() => {
        //alert('All records validated successfully');
        fetchRecords(); // Refresh records after bulk validation
      })
      .catch(error => {
        console.error('Error validating all records:', error);
        // Further error handling as needed
      });
  };




  return (
    <>
      <section>
        <PageTitle>Validation des conflits</PageTitle>
        <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16">
          <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides:</h3>
          <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
            <div className="lg:col-span-2 flex flex-wrap lg:gap-x-9 gap-x-6">
              <CheckBox onChange={() => setFullForm(!fullForm)} id="ValidationToggleForm" label="Afficher/Masquer les champs" />
            </div>
            <InputField
              id="ValidationContestedBrandName"
              name="Nommarqueipp"
              label="Nom de la marque contestée"
              type="text"
              placeholder="Nom"
              required={true}
              value={searchCriteria.Nommarqueipp}
              onChange={handleInputChange}
            />
            <InputField
              id="ValidationContestedBrandNum"
              name="NumeroTitreipp"
              label="Numero de marque contestée"
              type="text"
              placeholder="Numero"
              required={true}
              value={searchCriteria.NumeroTitreipp}
              onChange={handleInputChange}
            />
            <InputField
              id="ValidationApplicant"
              name="Deposantipp"
              label="Déposant"
              type="text"
              placeholder="Nom"
              required={true}
              value={searchCriteria.Deposantipp}
              onChange={handleInputChange}
            />
            <InputField
              id="ValidationNiceClass"
              name="ClasseNiceipp"
              label="Classe nice"
              type="text"
              placeholder="Classe"
              value={searchCriteria.ClasseNiceipp}
              onChange={handleInputChange}
            />
            <InputField
              id="ValidationStartDate"
              name="Datedepotipp_debut"
              label="début date"
              type="date"
              value={searchCriteria.Datedepotipp_debut}
              onChange={handleInputChange}
            />
            <InputField
              id="ValidationEndDate"
              name="Datedepotipp_Fin"
              label="Fin date"
              type="date"
              value={searchCriteria.Datedepotipp_Fin}
              onChange={handleInputChange}
            />
            <InputField
              id="ValidationRepresentative"
              name="Mandataireipp"
              label="Mandataire"
              type="text"
              placeholder="Mandataire"
              required={true}
              value={searchCriteria.Mandataireipp}
              onChange={handleInputChange}
            />
          </div>
          {fullForm && <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
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
              id="ValidationTrademarkRepresentative"
              name="Mandatairecon"
              label="Mandataire"
              type="text"
              placeholder="Mandataire"
              required={true}
              value={searchCriteria.Mandatairecon}
              onChange={handleInputChange}
            />
            
          </div>}
          <div className="flex flex-wrap md:gap-4 gap-2">
            <Button type={"submit"} name={"ValidationSearch"} onClick={handleSearch}>Chercher</Button>
            <Button type={"button"} name={"ValidationValider"} onClick={handleValidateAll} bg={true}>Valider</Button>

          </div>
        </form>
      </section>
      <section className="bg-white py-10 shadow-lg rounded-md">
        <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
          <Pagination classes={"!mt-0"} />
        </div>
        <div className="overflow-x-scroll xl:sl-scroll-hidden">
          <table name="ValidationTable" className="xl:w-full w-max">
            <thead>
              <tr>
                <th>SL</th>
                <th>Marque Contestée</th>
                <th>Numero Marque</th>
                <th>Image Contestée</th>
                <th>Image Antérieure</th>
                <th>Numero Marque ant</th>
                <th>Marque Antérieure</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td dangerouslySetInnerHTML={{ __html: record.marque_c }}></td>
                  <td>{record.nummarque_c}</td>
                  <td><img src={record.ImageC} alt="Contested" /></td>
                  <td><img src={record.ImageA} alt="Anterior" /></td>
                  <td>{record.nummarque_int}</td>
                  <td dangerouslySetInnerHTML={{ __html: record.marq_a }}></td>
                  <td>
                    <Button onClick={() => handleValidate(record.nummarque_c, record.nummarque_int)}>Valider</Button>
                    <Button onClick={() => handleDelete(record.nummarque_c, record.nummarque_int)} bg={true}>Supprimer</Button>
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