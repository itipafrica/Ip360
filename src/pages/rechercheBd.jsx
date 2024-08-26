import React,{ useEffect,useState,useRef  } from "react";
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import DropDown from "../components/Input/dropDown";
import InfoPopup  from "../components/charts/searchdb";
import InputField from "../components/Input/inputField";
import SortableHeader from "../components/SortableHeader/SortableHeader";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import IconDev from "../components/IconDiv/iconDiv";
import Pagination from "../components/Pagination/pagination";
import {  faArrowUp } from '@fortawesome/free-solid-svg-icons';
import AtomicSpinner from 'atomic-spinner';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import headerImage from 'C:/Users/Administrateur/source/repos/test/test/images/header-IP-AFRICA.png';  // Make sure the path is correct
import footerImg from 'C:/Users/Administrateur/source/repos/test/test/images/footer-ipafrica.jpg';  // Make sure the path is correct
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default function RechercheBd() {
    const [fullForm, setFullForm] = useState(false);
    const BrandTypeOmpic = ["autres", "mixte", "figuratif", "dénominatif", "tridimensionnel", "sonore"];
    const BrandTypeTm = ["combined", "sound", "other"];
    const StateOmpic = ["opposition", "dechue", "irrecevable", "en cours d'examen", "opposition suspendue", "rejetee", "retiree", "expiree", "renouvlee", "enregistree", "en examen de forme", "consideree comme retiree", "opposition en cours", "renoncee", "publication programmee", "en instance de regularisation", "publiee", "en examen des motifs absolus", "radiee", "en poursuite de procedure"];
    const StateTm = ["registered", "registration cancelled", "application opposed", "registration surrendered", "application refused", "expired", "application withdrawn", "application filed", "application published", "appeal pending", "renewed"];
    const columnToggle = ["Nom marque", "Date depot", "Date expiration", "Deposant", "Adresse deposant", "Pays", "Mandataire", "Adresse mandataire", "Representative_countryCode", "Type", "Statut", "Email", "Telephone", "Classe_Nice", "Opposition_applicant_name", "Opposition_earlierMark_applicationNumber", "Nombre_opposition"];
    const iconList = ["iconPdf", "iconPdfSelect", "iconUpload", "iconSelectUpload", "iconBrand", "iconAlertFn", "iconAlertEnd", "iconEnRegistrer", "iconReNouvellement", "iconTmCheck", "iconBrandCheck", "iconTmUpdate", "iconUpdate"];
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); 
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingtwo, setIsLoadingtwo] = useState(false);
    const [selectedNumeros, setSelectedNumeros] = useState([]);
    //Variable that holds the data of the gridview
    const [apiData, setApiData] = useState(null);

    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupData, setPopupData] = useState(null);
    const [popupType, setPopupType] = useState('');
    //hold the sort collum
    const [sortColumn, setSortColumn] = useState('');


    //sort order desc or asc
    const [sortOrder, setSortOrder] = useState('asc');
    const location = useLocation();
    const checkboxes = useRef({});




    const handleInsightsClick = (item, type) => {
      let popupData;
      if (type === 'Mandataire') {
        popupData = {
          Mandataire: item.Representative_name.ompic || item.Representative_name.tm,
          // Add any other relevant data from the item
        };
      } else {
        // Handle 'Deposant' case if needed
        popupData = {
          deposant: item.BrandOwner.ompic || item.BrandOwner.tm,
          // Add any other relevant data from the item
        };
      }
      setPopupData(popupData);
      setPopupType(type);
      setIsPopupOpen(true);
    };
    //loading function to check if the navigation by llm was done 
    // This useEffect will run once on component mount
    const clickableStyle = {
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    };
    
    const hoverStyle = {
      backgroundColor: '#f0f0f0', // Light gray background on hover
    };
  useEffect(() => {
    // Access the state passed through navigate
    
    const query = location.state?.query;
    console.log(query);

    if (query) {
      // If query exists, do something with it, like submitting a form
      submitForm(query);
    }

    // The empty dependency array [] ensures this effect runs only on component mount
  }, []);
  //to send the query to the api in loading 
  const submitForm = async (query) => {
    event.preventDefault(); // Prevent the default form submission action
          setIsLoading(true);

          const apiEndpoint = 'http://192.168.2.111:56478/api/RechercheBd'; // Replace with your actual API endpoint
        
          try {
            const requestBody = [{
              // Wrap the form data in an array, with each element being a JSON document
               Nom: formData.Nom,
               Numero: formData.Numero,
               Deposant: {
               nom: formData.Deposant.nom,
               pays: formData.Deposant.pays,
               adresse: formData.Deposant.adresse,
               },
               Mandataire: {
               nom: formData.Mandataire.nom,
               pays: formData.Mandataire.pays,
               adresse: formData.Mandataire.adresse,
               },
               Date_depot: {
               Start: formData.Date_depot.Start,
               Finish: formData.Date_depot.Finish,
               },
               Date_Exp: {
                Start: formData.Date_Exp.Start,
                Finish: formData.Date_Exp.Finish,
               },
               Date_Pub: {
                Start: formData.Date_Pub.Start,
                Finish: formData.Date_Pub.Finish,
               },
               Classnice: formData.Classnice,
               Gazette: formData.Gazette,
               Email: formData.Email,
               Opposant: formData.Opposant,
               Oppositionnb: formData.Oppositionnb,
               Typemarque: {
               Tm: formData.Typemarque.Tm,
               Ompic: formData.Typemarque.Ompic,
               },
               Searchtype: "typical",
               
               Etat: {
                Tm: formData.Etat.Tm,
                Ompic: formData.Etat.Ompic,
               },
               prompt: query,
               query_img : formData.query_img

              // Add other nested objects and fields as required by your API
            },];
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

    //array of collums of the gridview
    const columns = [
      { columnName: "Numero", label: "Numero" ,hidden: false},
      { columnName: "Image", label: "Image" ,hidden: false},
      { columnName: "Name.ompic", label: "Nom marque",hidden: false },
      { columnName: "BrandOwner.ompic", label: "Deposant",hidden: false },
      { columnName: "Representative_name.ompic", label: "Mandataire",hidden: false },
      { columnName: "Date_depot.ompic", label: "Date depot",hidden: false },
      { columnName: "Date_expiration.ompic", label: "Date expiration",hidden: false },
      { columnName: "ClasseNice.ompic", label: "Classe nice",hidden: false },
      { columnName: "Statut.ompic", label: "Statut marque",hidden: false },
      { columnName: "Type.ompic", label: "Type", hidden: true },
      { columnName: "Applicant_address.ompic", label: "Adresse deposant", hidden: true },
      { columnName: "Email.ompic", label: "Email", hidden: true },
      { columnName: "Loi.ompic", label: "Loi", hidden: true },
      { columnName: "Numero_publication.ompic", label: "Numero Publication", hidden: true },
      { columnName: "Applicant_legalentity", label: "Applicant Legal Entity", hidden: true },
      { columnName: "Applicant_nationalityCode", label: "Applicant Nationality Code", hidden: true },
      { columnName: "Representative_nationalityCode", label: "Representative Nationality Code", hidden: true },
      { columnName: "Representative_address", label: "Adresse mandataire", hidden: true },
      { columnName: "Representative_city", label: "Representative City", hidden: true },
      { columnName: "Representative_countryCode", label: "Representative Country Code", hidden: true },
      { columnName: "OppositionDate", label: "Opposition Date", hidden: true },
      { columnName: "Opposition_earlierMark_applicationNumber", label: "Opposition Earlier Mark Application Number", hidden: true },
      { columnName: "Opposition_applicant_name", label: "Opposition Applicant Name", hidden: true },
      { columnName: "Opposition_applicant_legalentity", label: "Opposition Applicant Legal Entity", hidden: true },
      { columnName: "Opposition_nationaliyCode", label: "Opposition Nationality Code", hidden: true },
      { columnName: "Opposition_applicant_address", label: "Opposition Applicant Address", hidden: true },
      { columnName: "Opposition_applicant_city", label: "Opposition Applicant City", hidden: true },
      { columnName: "Opposition_applicant_countryCode", label: "Opposition Applicant Country Code", hidden: true },
    ];


    //Function that handles collum toggle 
    const handleColumnToggle = (selectedValue) => {
      const selectedColumn = String(selectedValue).replace(/\s+/g, "_");
      console.log(selectedColumn);
      const elements = document.getElementsByClassName(selectedColumn);
      console.log(elements);
      for (const element of elements) {
          element.classList.toggle('hidden_searchbd');
      }
  };
  
 

    // Navigate object to redrirect to pages and such things
    const navigate = useNavigate();

    const handleDetailsClick = (item) => {
      navigate(`/app/company_details`, { state: { brandDetails: item } });
    };

    //function that returns all of the collums of the tables based on the array of the collums 
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


    //Sorting fucntion #logic
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


    //switch between sorting 
    const handleSort = (columnName) => {
      // Your sorting logic here
      setSortColumn(columnName);
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    };
    
    //get the value of the collum
    const getColumnValue = (obj, column) => {
      const columnHierarchy = column.split('.');
      let value = obj;
    
      for (const prop of columnHierarchy) {
        value = value[prop];
      }
    
      return value;
    };
    
  //variable that holds the sorted data 
  const sortedData = apiData ? applySortingLogic(apiData, sortColumn, sortOrder) : [];

  // function that handles the click of buttons in the form 
  const handleButtonClick = async (buttonName) => {
    // Common logic for button click
    // You can use the buttonName parameter to customize behavior
    console.log(`Button clicked: ${buttonName}`);
  
    // Add your specific code here based on the button clicked
    if (buttonName === "rechercheBdSearch") {
      // Code for "Chercher" button
    } else if (buttonName === "rechercheBdOmpic") {
      // Code for "Recherche Ompic" button
    } else if (buttonName === "rechercheBdWipo") {
      // Code for "Recherche wipo" button
    } else if (buttonName === "rechercheBdPhoto") {


      event.preventDefault(); // Prevent the default form submission action
      setIsLoading(true);

      const apiEndpoint = 'http://192.168.2.111:56478/api/RechercheBd'; // Replace with your actual API endpoint
    
      try {
        const requestBody = [{
          // Wrap the form data in an array, with each element being a JSON document
           Nom: formData.Nom,
           Numero: formData.Numero,
           Deposant: {
           nom: formData.Deposant.nom,
           pays: formData.Deposant.pays,
           adresse: formData.Deposant.adresse,
           },
           Mandataire: {
           nom: formData.Mandataire.nom,
           pays: formData.Mandataire.pays,
           adresse: formData.Mandataire.adresse,
           },
           Date_depot: {
           Start: formData.Date_depot.Start,
           Finish: formData.Date_depot.Finish,
           },
           Date_Exp: {
            Start: formData.Date_Exp.Start,
            Finish: formData.Date_Exp.Finish,
           },
           Date_Pub: {
            Start: formData.Date_Pub.Start,
            Finish: formData.Date_Pub.Finish,
           },
           Classnice: formData.Classnice,
           Gazette: formData.Gazette,
           Email: formData.Email,
           Opposant: formData.Opposant,
           Oppositionnb: formData.Oppositionnb,
           Typemarque: {
           Tm: formData.Typemarque.Tm,
           Ompic: formData.Typemarque.Ompic,
           },
           Searchtype: "nottypical",
           
           Etat: {
            Tm: formData.Etat.Tm,
            Ompic: formData.Etat.Ompic,
           },
           prompt: formData.prompt,
           query_img : formData.query_img
          // Add other nested objects and fields as required by your API
        },];
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
      
    } else if (buttonName === "rechercheBdAdd") {
      Addval4_btn();
    }
    else if (buttonName === "SearchPro") {
      event.preventDefault(); // Prevent the default form submission action
      setIsLoading(true);

      const apiEndpoint = 'http://192.168.2.111:56478/api/RechercheBd'; // Replace with your actual API endpoint
    
      try {
        const requestBody = [{
          // Wrap the form data in an array, with each element being a JSON document
           Nom: formData.Nom,
           Numero: formData.Numero,
           Deposant: {
           nom: formData.Deposant.nom,
           pays: formData.Deposant.pays,
           adresse: formData.Deposant.adresse,
           },
           Mandataire: {
           nom: formData.Mandataire.nom,
           pays: formData.Mandataire.pays,
           adresse: formData.Mandataire.adresse,
           },
           Date_depot: {
           Start: formData.Date_depot.Start,
           Finish: formData.Date_depot.Finish,
           },
           Date_Exp: {
            Start: formData.Date_Exp.Start,
            Finish: formData.Date_Exp.Finish,
           },
           Date_Pub: {
            Start: formData.Date_Pub.Start,
            Finish: formData.Date_Pub.Finish,
           },
           Classnice: formData.Classnice,
           Gazette: formData.Gazette,
           Email: formData.Email,
           Opposant: formData.Opposant,
           Oppositionnb: formData.Oppositionnb,
           Typemarque: {
           Tm: formData.Typemarque.Tm,
           Ompic: formData.Typemarque.Ompic,
           },
           Searchtype: "searchpro",
           
           Etat: {
            Tm: formData.Etat.Tm,
            Ompic: formData.Etat.Ompic,
           },
           prompt: formData.prompt,
           query_img : formData.query_img
          // Add other nested objects and fields as required by your API
        },];
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
    }
    else if (buttonName === "SearchProAll") {
      event.preventDefault(); // Prevent the default form submission action
      setIsLoading(true);

      const apiEndpoint = 'http://192.168.2.111:56478/api/RechercheBd'; // Replace with your actual API endpoint
    
      try {
        const requestBody = [{
          // Wrap the form data in an array, with each element being a JSON document
           Nom: formData.Nom,
           Numero: formData.Numero,
           Deposant: {
           nom: formData.Deposant.nom,
           pays: formData.Deposant.pays,
           adresse: formData.Deposant.adresse,
           },
           Mandataire: {
           nom: formData.Mandataire.nom,
           pays: formData.Mandataire.pays,
           adresse: formData.Mandataire.adresse,
           },
           Date_depot: {
           Start: formData.Date_depot.Start,
           Finish: formData.Date_depot.Finish,
           },
           Date_Exp: {
            Start: formData.Date_Exp.Start,
            Finish: formData.Date_Exp.Finish,
           },
           Date_Pub: {
            Start: formData.Date_Pub.Start,
            Finish: formData.Date_Pub.Finish,
           },
           Classnice: formData.Classnice,
           Gazette: formData.Gazette,
           Email: formData.Email,
           Opposant: formData.Opposant,
           Oppositionnb: formData.Oppositionnb,
           Typemarque: {
           Tm: formData.Typemarque.Tm,
           Ompic: formData.Typemarque.Ompic,
           },
           Searchtype: "searchproall",
           
           Etat: {
            Tm: formData.Etat.Tm,
            Ompic: formData.Etat.Ompic,
           },
           prompt: formData.prompt,
           query_img : formData.query_img
          // Add other nested objects and fields as required by your API
        },];
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
    }
  };
  //function that handle the value chnage in inputs 
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
        //function search normal
        const handleSubmit = async (event) => {
          event.preventDefault(); // Prevent the default form submission action
          setIsLoading(true);

          const apiEndpoint = 'http://192.168.2.111:56478/api/RechercheBd'; // Replace with your actual API endpoint
        
          try {
            const requestBody = [{
              // Wrap the form data in an array, with each element being a JSON document
               Nom: formData.Nom,
               Numero: formData.Numero,
               Deposant: {
               nom: formData.Deposant.nom,
               pays: formData.Deposant.pays,
               adresse: formData.Deposant.adresse,
               },
               Mandataire: {
               nom: formData.Mandataire.nom,
               pays: formData.Mandataire.pays,
               adresse: formData.Mandataire.adresse,
               },
               Date_depot: {
               Start: formData.Date_depot.Start,
               Finish: formData.Date_depot.Finish,
               },
               Date_Exp: {
                Start: formData.Date_Exp.Start,
                Finish: formData.Date_Exp.Finish,
               },
               Date_Pub: {
                Start: formData.Date_Pub.Start,
                Finish: formData.Date_Pub.Finish,
               },
               Classnice: formData.Classnice,
               Gazette: formData.Gazette,
               Email: formData.Email,
               Opposant: formData.Opposant,
               Oppositionnb: formData.Oppositionnb,
               Typemarque: {
               Tm: formData.Typemarque.Tm,
               Ompic: formData.Typemarque.Ompic,
               },
               Searchtype: "typical",
               
               Etat: {
                Tm: formData.Etat.Tm,
                Ompic: formData.Etat.Ompic,
               },
               prompt: formData.prompt,
               query_img : formData.query_img
              // Add other nested objects and fields as required by your API
            },];
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
        
    //structure ofthe form
     const [formData, setFormData] = useState({
          Nom: '',
          Numero: '',
          Deposant: {
            nom: '',
            pays: '',
            adresse: '',
          },
          Mandataire: {
            nom: '',
            pays: '',
            adresse: '',
          },
          Date_depot: {
            Start: '',
            Finish: '',
          },
          Date_Exp: {
            Start: '',
            Finish: '',
          },
          Date_Pub: {
            Start: '',
            Finish: '',
          },
          Classnice: '',
          Gazette: '',
          Email: '',
          Opposant: '',
          Oppositionnb: '',
          Typemarque: {
            Tm: '',
            Ompic: '',
          },
          Searchtype: '',
          Etat: {
            Tm: '',
            Ompic: '',
          },
          prompt: '',
          query_img:''
        });
        //function that combine between the two values of tm and ompic
        const renderOmpicAndTm = (ompic, tm) => {
          if (!ompic && !tm) {
            // If both ompic and tm are empty, return an empty string
            return '';
          }
        
          ompic = String(ompic).replace(/\s+/g, ' ').trim().replace("00:00:00","");
     tm = String(tm).replace(/\s+/g, ' ').trim().replace("00:00:00","");
        
          if (ompic === tm) {
            // If ompic and tm are the same, display only one
            return <div>{ompic || tm}</div>;
          } else {
            // Display ompic on top and tm on the bottom with blue color
            return (
              <>
                <div>{ompic}</div>
                <div style={{ color: 'blue' }}>{tm }</div>
              </>
            );
          }
        };
        //pagination variables number of pages  , current page
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
 
        // Get the current items to display based on pagination
        const currentItems = sortedData? sortedData.slice(indexOfFirstItem, indexOfLastItem):null;
        const handleOmpicClick = (numero) => {
          let link = "";
          if (numero.startsWith("T-")) {
            const number = numero.substring(2);
            link = `https://www3.wipo.int/madrid/monitor/fr/showData.jsp?ID=ROM.${number}`;
          } else {
            // Since React runs on the client side, direct database operations as done in the C# code aren't possible.
            // You'd typically fetch the MappingId from an API that interacts with the database.
            fetch(`/api/getMappingId?numeroTitre=${numero}`)
              .then((response) => response.json())
              .then((data) => {
                if (data.mappingId && data.mappingId !== "0") {
                  link = `http://search.ompic.ma/web/pages/consulterMarque.do?id=${data.mappingId}`;
                } else {
                  link = `http://search.ompic.ma/web/pages/consulterMarqueTMView.do?refReglementationTitreLabel=97-${numero}`;
                }
                window.open(link, '_blank');
              })
              .catch((error) => {
                console.error('Error fetching MappingId:', error);
                link = `http://search.ompic.ma/web/pages/consulterMarqueTMView.do?refReglementationTitreLabel=97-${numero}`;
                window.open(link, '_blank');
              });
          }
        };
      
     
     
        const generatePDF = async () => {
          const data = apiData; // Placeholder for your data source
      
          const config = {
              pageWidth: 297, // A4 height in mm, landscape orientation
              pageHeight: 210, // A4 width in mm, landscape orientation
              marginLeft: 5,
              marginRight: 5,
              marginTop: 40, // Increased to accommodate header image
              marginBottom: 10,
              headerImageWidth: 270,
              headerImageHeight: 20,
              fontSize: 8,
              headerFontSize: 9,
              rowHeight: 17,
              imageWidth: 20, // Reduced width
              imageHeight: 20 // Reduced height
          };
      
          const pdf = new jsPDF({
              orientation: 'landscape',
              unit: 'mm',
              format: 'a4'
          });
      
          const headers = ["Numero", "Image", "Name", "Date Depot", "Date Expiration", "Deposant", "Mandataire", "Classe Nice", "Statut"];
          const columnWidths = [15, 30, 40, 25, 25, 50, 40, 30, 27]; // Adjusted column widths
      
          const addHeaderImage = () => {
              pdf.addImage(headerImage, 'JPEG', config.marginLeft, 5, config.headerImageWidth, config.headerImageHeight);
          };
      
          const drawHeader = () => {
              pdf.setFontSize(config.headerFontSize);
              pdf.setFont('helvetica', 'bold');
              let xOffset = config.marginLeft;
              headers.forEach((header, index) => {
                  pdf.text(header, xOffset, config.marginTop - 2);
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
                  item.Name?.ompic,
                  cleanDate(renderOmpicAndTm2(item.Date_depot.ompic, item.Date_depot.tm)),
                  cleanDate(renderOmpicAndTm2(item.Date_expiration.ompic, item.Date_expiration.tm)),
                  item.BrandOwner?.ompic,
                  item.Representative_name?.ompic,
                  item.ClasseNice?.ompic,
                  renderOmpicAndTm2(item.Statut.ompic, item.Statut.tm)
              ];
      
              for (let index = 0; index < cellData.length; index++) {
                  if (index === 1) {
                      // Handle image
                      const imageUrl = `http://192.168.2.111/ipp/Assets/Brand_image/${item.Numero}.jpg`;
                      await loadImage(imageUrl)
                          .then(img => {
                              let imgWidth = img.width;
                              let imgHeight = img.height;
                              const aspectRatio = imgWidth / imgHeight;
      
                              // Resize image proportionally to fit within the designated area
                              if (imgWidth > config.imageWidth || imgHeight > config.imageHeight) {
                                  if (aspectRatio > 1) {
                                      imgWidth = config.imageWidth;
                                      imgHeight = imgWidth / aspectRatio;
                                  } else {
                                      imgHeight = config.imageHeight;
                                      imgWidth = imgHeight * aspectRatio;
                                  }
                              }
      
                              // Center the image vertically within the cell
                              const yOffset = y - (imgHeight / 2) + (config.rowHeight / 2);
      
                              pdf.addImage(
                                  img.src,
                                  'JPEG',
                                  xOffset,
                                  yOffset,
                                  imgWidth,
                                  imgHeight,
                                  '',
                                  'FAST'
                              );
                          })
                          .catch(err => {
                              console.error(`Failed to load image: ${imageUrl}`, err);
                              // Handle the error gracefully, e.g., add a placeholder text or image
                              pdf.text('Image not available', xOffset, y + (config.rowHeight / 2));
                          });
                  } else {
                      let text = cellData[index];
                      let fontSize = config.fontSize;
                      pdf.setFontSize(fontSize);
                      while (pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor > columnWidths[index] - 2) {
                          fontSize--;
                          pdf.setFontSize(fontSize);
                          if (fontSize < 6) break; // Set a minimum font size
                      }
                      pdf.text(text, xOffset, y + (config.rowHeight / 2), { maxWidth: columnWidths[index] - 2 });
                  }
                  xOffset += columnWidths[index];
              }
          };
      
          const drawPage = async (dataSlice, pageNumber) => {
              if (pageNumber > 1) {
                  pdf.addPage();
              }
              addHeaderImage();
              drawHeader();
      
              let y = config.marginTop + 7; // Increased spacing after header
              for (const item of dataSlice) {
                  await drawRow(item, y);
                  y += config.rowHeight;
              }
          };
      
          function cleanDate(dateString) {
              return dateString ? dateString.replace('00:00:00', '').trim() : '';
          }
      
          const loadImage = (url) => {
              return new Promise((resolve, reject) => {
                  const img = new Image();
                  img.crossOrigin = "Anonymous"; // Handle CORS issues
                  img.onload = () => resolve(img);
                  img.onerror = reject;
                  img.src = url;
              });
          };
      
          const itemsPerPage = Math.floor((config.pageHeight - config.marginTop - config.marginBottom) / config.rowHeight);
      
          for (let i = 0, pageNumber = 1; i < data.length; i += itemsPerPage, pageNumber++) {
              await drawPage(data.slice(i, i + itemsPerPage), pageNumber);
          }
      
          pdf.save('download.pdf');
      };
      const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            // The result attribute contains the data as a base64 encoded string
            const base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
            
            setFormData(prevState => ({
              ...prevState,
              photo: file
            }));
      
            // Send the base64 string to your API
            sendImageToApi(base64String);
          };
          reader.readAsDataURL(file);
        }
      };
      const handleDeletePhoto = (e) => {
        e.preventDefault(); // Prevent the default action
        setFormData(prevData => ({
          ...prevData,
          photo: null
        }));
        // If you're using a ref for the file input, you can reset it like this:
        // if (fileInputRef.current) fileInputRef.current.value = '';
      };
      
      const sendImageToApi = async (base64Image) => {
        const apiUrl = 'http://127.0.0.1:5001/api/find_similar_images'; // Replace with your actual API endpoint
      
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
          });
      
          if (response.ok) {
            const data = await response.json();
            const neighbors = data.neighbors;
      
            const numbers = neighbors.map(neighbor => {
              const path = neighbor.path.toString();
              return path.replace("ipimgs\\", "").split('.')[0];
            });
      
            if (numbers.length > 0) {
              const conditions = numbers.map(n => `trim(NumeroTitre) = '${n}'`);
              const query = `SELECT * FROM Marques_Ompic WHERE ${conditions.join(" OR ")}`;
              console.log("Generated query:", query);
              
              // Update the formData state with the new query
              setFormData(prevState => ({
                ...prevState,
                query_img: query
              }));
            } else {
              console.log("No valid numbers extracted from paths.");
              
              // Update the formData state with an error message
              setFormData(prevState => ({
                ...prevState,
                query: "No valid numbers extracted from paths."
              }));
            }
          } else {
            console.error("Failed to retrieve data from API.");
            
            // Update the formData state with an error message
            setFormData(prevState => ({
              ...prevState,
              query: "Failed to retrieve data from API."
            }));
          }
        } catch (error) {
          console.error("Error sending image to API:", error);
          
          // Update the formData state with an error message
          setFormData(prevState => ({
            ...prevState,
            query: `Error sending image to API: ${error.message}`
          }));
        }
      };
      /////////////////////////////////////////////////////////////////////////
      
      const generatePDFselecte = async () => {
        const selectedData = apiData.filter(item => checkboxes.current[item.Numero]?.checked);
    
        if (selectedData.length === 0) {
            alert("No brands selected.");
            return;
        }
    
        const config = {
            pageWidth: 297, // A4 height in mm, landscape orientation
            pageHeight: 210, // A4 width in mm, landscape orientation
            marginLeft: 5,
            marginRight: 5,
            marginTop: 40, // Increased to accommodate header image
            marginBottom: 10,
            headerImageWidth: 270,
            headerImageHeight: 20,
            fontSize: 8,
            headerFontSize: 9,
            rowHeight: 17,
            imageWidth: 20, // Reduced width
            imageHeight: 20 // Reduced height
        };
    
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
    
        const headers = ["Numero", "Image", "Name", "Date Depot", "Date Expiration", "Deposant", "Mandataire", "Classe Nice", "Statut"];
        const columnWidths = [15, 30, 40, 25, 25, 50, 40, 30, 27]; // Adjusted column widths
    
        const addHeaderImage = () => {
            pdf.addImage(headerImage, 'JPEG', config.marginLeft, 5, config.headerImageWidth, config.headerImageHeight);
        };
    
        const drawHeader = () => {
            pdf.setFontSize(config.headerFontSize);
            pdf.setFont('helvetica', 'bold');
            let xOffset = config.marginLeft;
            headers.forEach((header, index) => {
                pdf.text(header, xOffset, config.marginTop - 2);
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
                item.Name?.ompic,
                cleanDate(renderOmpicAndTm2(item.Date_depot.ompic, item.Date_depot.tm)),
                cleanDate(renderOmpicAndTm2(item.Date_expiration.ompic, item.Date_expiration.tm)),
                item.BrandOwner?.ompic,
                item.Representative_name?.ompic,
                item.ClasseNice?.ompic,
                renderOmpicAndTm2(item.Statut.ompic, item.Statut.tm)
            ];
    
            for (let index = 0; index < cellData.length; index++) {
                if (index === 1) {
                    // Handle image
                    const imageUrl = `http://192.168.2.111/ipp/Assets/Brand_image/${item.Numero}.jpg`;
                    await loadImage(imageUrl)
                        .then(img => {
                            let imgWidth = img.width;
                            let imgHeight = img.height;
                            const aspectRatio = imgWidth / imgHeight;
    
                            // Resize image proportionally to fit within the designated area
                            if (imgWidth > config.imageWidth || imgHeight > config.imageHeight) {
                                if (aspectRatio > 1) {
                                    imgWidth = config.imageWidth;
                                    imgHeight = imgWidth / aspectRatio;
                                } else {
                                    imgHeight = config.imageHeight;
                                    imgWidth = imgHeight * aspectRatio;
                                }
                            }
    
                            // Center the image vertically within the cell
                            const yOffset = y - (imgHeight / 2) + (config.rowHeight / 2);
    
                            pdf.addImage(
                                img.src,
                                'JPEG',
                                xOffset,
                                yOffset,
                                imgWidth,
                                imgHeight,
                                '',
                                'FAST'
                            );
                        })
                        .catch(err => {
                            console.error(`Failed to load image: ${imageUrl}`, err);
                            // Handle the error gracefully, e.g., add a placeholder text or image
                            pdf.text('Image not available', xOffset, y + (config.rowHeight / 2));
                        });
                } else {
                    let text = cellData[index];
                    let fontSize = config.fontSize;
                    pdf.setFontSize(fontSize);
                    while (pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor > columnWidths[index] - 2) {
                        fontSize--;
                        pdf.setFontSize(fontSize);
                        if (fontSize < 6) break; // Set a minimum font size
                    }
                    pdf.text(text, xOffset, y + (config.rowHeight / 2), { maxWidth: columnWidths[index] - 2 });
                }
                xOffset += columnWidths[index];
            }
        };
    
        const drawPage = async (dataSlice, pageNumber) => {
            if (pageNumber > 1) {
                pdf.addPage();
            }
            addHeaderImage();
            drawHeader();
    
            let y = config.marginTop + 7; // Increased spacing after header
            for (const item of dataSlice) {
                await drawRow(item, y);
                y += config.rowHeight;
            }
        };
    
        function cleanDate(dateString) {
            return dateString ? dateString.replace('00:00:00', '').trim() : '';
        }
    
        const loadImage = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous"; // Handle CORS issues
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = url;
            });
        };
    
        const itemsPerPage = Math.floor((config.pageHeight - config.marginTop - config.marginBottom) / config.rowHeight);
    
        for (let i = 0, pageNumber = 1; i < selectedData.length; i += itemsPerPage, pageNumber++) {
            await drawPage(selectedData.slice(i, i + itemsPerPage), pageNumber);
        }
    
        pdf.save('download.pdf');
    };


    const renderOmpicAndTm2 = (ompic, tm) => {
      if (!ompic && !tm) {
          // If both ompic and tm are empty, return an empty string
          return '';
      }
  
      ompic = String(ompic).replace(/\s+/g, ' ').trim().replace("00:00:00", "");
      tm = String(tm).replace(/\s+/g, ' ').trim().replace("00:00:00", "");
  
      if (ompic === tm) {
          // If ompic and tm are the same, display only one
          return ompic || tm;
      } else {
          // Display ompic on top and tm on the bottom with blue color
          return `${ompic}\n${tm}`; // Return as a string with newline separator
      }
  };
/////////////////////////////////////////////////////////////
const updateBrands = async () => {
  const selectedData = apiData.filter(item => checkboxes.current[item.Numero]?.checked);

  if (selectedData.length === 0) {
    alert("No brands selected.");
    return;
  }

  setIsLoadingtwo(true);

  const requestData = {
    Marques: selectedData.map(item => ({
      NumeroTitre: item.Numero,
      Nommarque: item.Name.ompic || item.Name.tm,
      deposant: item.BrandOwner.ompic || item.BrandOwner.tm,
      Id: item.MappingId // Assuming you have this field in your data
    })),
    Type: "Directinfo" // or "ompic" based on your needs
  };

  try {
    console.log("Sending request:", JSON.stringify(requestData));

    const response = await fetch("http://192.168.2.111:56478/Update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    console.log("Update successful");

    // Optionally, refresh your data here
    // await fetchData();

  } catch (error) {
    console.error("Failed to update brands:", error);
    alert(`Failed to update brands. Error: ${error.message}`);
  } finally {
    setIsLoadingtwo(false);
  }
};
////////////////////////////////////////////////////

const updateompic = async () => {
  const selectedData = apiData.filter(item => checkboxes.current[item.Numero]?.checked);

  if (selectedData.length === 0) {
    alert("No brands selected.");
    return;
  }

  setIsLoadingtwo(true);

  const requestData = {
    Marques: selectedData.map(item => ({
      NumeroTitre: item.Numero,
      Nommarque: item.Name.ompic || item.Name.tm,
      deposant: item.BrandOwner.ompic || item.BrandOwner.tm,
      Id: item.MappingId // Assuming you have this field in your data
    })),
    Type: "ompic_global" // or "ompic" based on your needs
  };

  try {
    console.log("Sending request:", JSON.stringify(requestData));

    const response = await fetch("http://192.168.2.111:56478/Update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const responseText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${responseText}`);
    }

    console.log("Update successful");

    // Optionally, refresh your data here
    // await fetchData();

  } catch (error) {
    console.error("Failed to update brands:", error);
    alert(`Failed to update brands. Error: ${error.message}`);
  } finally {
    setIsLoadingtwo(false);
  }
};


////////////////////////////////////////////////////

      
const generatePDFforSelected = async () => {
  setIsLoadingtwo(true);
  const selectedData = apiData.filter(item => checkboxes.current[item.Numero]?.checked);

  if (selectedData.length === 0) {
      alert("No brands selected.");
      setIsLoadingtwo(false);
      return;
  }

  const requestData = selectedData.map(item => ({
      Num_marque: item.Numero || '',
      Nom_marque: renderOmpicAndTm2(item.Name.ompic, item.Name.tm) || '',
      Deposant: item.BrandOwner.tm || '',
      Mandataire: renderOmpicAndTm2(item.Representative_name.ompic, item.Representative_name.tm) || '',
      Date_depot: renderOmpicAndTm2(item.Date_depot.ompic, item.Date_depot.tm) || '',
      Date_expiration: renderOmpicAndTm2(item.Date_expiration.ompic, item.Date_expiration.tm) || '',
      Classe_Nice: renderOmpicAndTm2(item.ClasseNice.ompic, item.ClasseNice.tm) || '',
      Statut: renderOmpicAndTm2(item.Statut.ompic, item.Statut.tm) || ''
  }));

  try {
    const response = await fetch("http://localhost:56478/api/Pdf/Generaterapele_FR", {
      method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
      });

      if (response.ok) {
          const blob = await response.blob();
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "generated.pdf";
          link.click();
          URL.revokeObjectURL(link.href);
      } else {
          console.error("Failed to generate PDF.");
      }
  } catch (error) {
      console.error("Error generating PDF:", error);
  }

  setIsLoadingtwo(false);
};

const generatePDFforSelectedang = async () => {
  const selectedData = apiData.filter(item => checkboxes.current[item.Numero]?.checked);
  setIsLoadingtwo(true);
  if (selectedData.length === 0) {
      alert("No brands selected.");
      setIsLoadingtwo(false);
      return;
  }

  const requestData = selectedData.map(item => ({
      Num_marque: item.Numero || '',
      Nom_marque: renderOmpicAndTm2(item.Name.ompic, item.Name.tm) || '',
      Deposant: item.BrandOwner.tm || '',
      Mandataire: renderOmpicAndTm2(item.Representative_name.ompic, item.Representative_name.tm) || '',
      Date_depot: renderOmpicAndTm2(item.Date_depot.ompic, item.Date_depot.tm) || '',
      Date_expiration: renderOmpicAndTm2(item.Date_expiration.ompic, item.Date_expiration.tm) || '',
      Classe_Nice: renderOmpicAndTm2(item.ClasseNice.ompic, item.ClasseNice.tm) || '',
      Statut: renderOmpicAndTm2(item.Statut.ompic, item.Statut.tm) || ''
  }));

  try {
      const response = await fetch("http://localhost:56478/api/Pdf/Generaterapele_Ang", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
      });

      if (response.ok) {
          const blob = await response.blob();
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = "generated.pdf";
          link.click();
          URL.revokeObjectURL(link.href);
      } else {
          console.error("Failed to generate PDF.");
      }
  } catch (error) {
      console.error("Error generating PDF:", error);
  }

  setIsLoadingtwo(false);
};

const Addval4_btn = async () => {
  const selectedData = apiData.filter(item => checkboxes.current[item.Numero]?.checked);
  console.log("enter function")
  if (selectedData.length === 0) {
      alert("No brands selected.");
      return;
  }

  const requestData = selectedData.map(item => ({
    Num: item.Numero || ''
  }));

  const response = await fetch("http://192.168.2.111:56478/api/Watchlist", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
  });

  if (response.ok) {
      
  } else {
      
  }
  setIsLoadingtwo(false);
};

        // Function to change the current page
        const paginate = (pageNumber) => setCurrentPage(pageNumber)
        const iconClickHandlers = {
          
          iconPdf: generatePDF,  // This key must match exactly with the name in `iconList`
          iconPdfSelect: generatePDFselecte,  // This key must match exactly with the name in `iconList`
          iconAlertFn:generatePDFforSelected ,
          iconAlertEnd:generatePDFforSelectedang,
          iconBrand:updateBrands ,
          iconUpload:updateompic,
          iconEnRegistrer: () => generatecertifica("enregistre"),
          iconReNouvellement: () => generatecertifica("renouve"),
          
      };

      
      const generatecertifica = async (status) => {
        // Retrieve selected data based on checked checkboxes
        const selectedData = apiData.filter(item => checkboxes.current[item.Numero]?.checked);
    
        if (selectedData.length === 0) {
            alert("No brands selected.");
            return;
        }
    
        const requestData = {
            NumeroTitres: selectedData.map(item => item.Numero),
            Status: status
        };
    
        try {
            const response = await fetch("http://localhost:56478/api/Pdf/UpdateTemplate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
    
            if (!response.ok) {
                throw new Error("Failed to generate PDF");
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = status === "enregistre" ? "Certi_enre.pdf" : "Certi_renouv.pdf";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error:", error);
        }
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
               <section>
                    <PageTitle>Recherche Bd</PageTitle>
                    <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16" onSubmit={handleSubmit}>
                         <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides:</h3>
                         <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <div className="lg:col-span-2 flex flex-wrap lg:gap-x-9 gap-x-6">
                                   <CheckBox onChange={() => setFullForm(!fullForm)} id="rechercheBdToggleForm" label="Afficher/Masquer les champs" />
                                   <CheckBox id="rechercheBdSimilarClass" label="Classe similaire" />
                              </div>
                              <InputField id="rechercheBdCondition" label="condition par text" type="text" placeholder="text"  value={formData.prompt}
  onChange={(e) => handleInputChange(e, 'prompt')}/>
                                <div className="photo-picker">
                                  <label htmlFor="photoPicker">Choisir une photo</label>
                                  <input
                                    type="file"
                                    id="photoPicker"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                  />
                                  {formData.photo && (
    <div id="imagePreview" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img
        src={URL.createObjectURL(formData.photo)}
        alt="Preview"
        style={{ maxWidth: '200px', maxHeight: '200px' }}
      />
      <button
        className="delete-photo"
        onClick={handleDeletePhoto}
        style={{
          background: 'none',
          border: '1px solid #ccc',
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        ✕
      </button>
    </div>
  )}
                                </div>
                                                              
                              <InputField id="rechercheBdBrandName" label="Nom de la marque" type="text" placeholder="Nom" value={formData.Nom}
  onChange={(e) => handleInputChange(e, 'Nom')}/>
                              <InputField id="rechercheBdDialNumber" label="Numero de marque" type="text" placeholder="Numero" value={formData.Numero}
  onChange={(e) => handleInputChange(e, 'Numero')}/>
                              <InputField id="rechercheBdApplicant" label="Déposant" type="text" placeholder="Nom"  value={formData.Deposant.nom}
  onChange={(e) => handleInputChange(e, 'Deposant','nom')}/>
                              <InputField id="rechercheBdRepresentative" label="Mandataire" type="text" placeholder="Mandataire" value={formData.Mandataire.nom}
  onChange={(e) => handleInputChange(e, 'Mandataire','nom')}/>
                         </div>
                         {fullForm && <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <InputField id="rechercheBdDepositorAddress" label="Adresse déposant" type="text" placeholder="Adresse" value={formData.Deposant.adresse}
  onChange={(e) => handleInputChange(e, 'Deposant','adresse')}/>
                              <InputField id="rechercheBdProxyAddress" label="Adresse mandataire" type="text" placeholder="address"value={formData.Mandataire.adresse}
  onChange={(e) => handleInputChange(e, 'Mandataire','adresse')}/>
                              <InputField id="rechercheBdDepositorCountry" label="Pays déposant" type="text" placeholder="Pays" value={formData.Deposant.pays}
  onChange={(e) => handleInputChange(e, 'Deposant','pays')}/>
                              <InputField id="rechercheBdMandatoryCountry" label="Pays mandataire" type="text" placeholder="Pays" value={formData.Mandataire.pays}
  onChange={(e) => handleInputChange(e, 'Mandataire','pays')}/>
                              <InputField id="rechercheBdFilingStartDate" label="Date dépot début" type="date" value={formData.Date_depot.Start}
  onChange={(e) => handleInputChange(e, 'Date_depot','Start')}/>
                              <InputField id="rechercheBdFilingEndDate" label="Date dépot fin" type="date" value={formData.Date_depot.Finish}
  onChange={(e) => handleInputChange(e, 'Date_depot','Finish')}/>
                              <InputField id="rechercheBdExpirationStartDate" label="Date expiration début" type="date" value={formData.Date_Exp.Start}
  onChange={(e) => handleInputChange(e, 'Date_Exp','Start')}/>
                              <InputField id="rechercheBdExpirationEndDate" label="Date expiration fin" type="date" value={formData.Date_Exp.Finish}
  onChange={(e) => handleInputChange(e, 'Date_Exp','Finish')}/>
                              <InputField id="rechercheBdPublicationStartDate" label="Date publication début" type="date" value={formData.Date_Pub.Start}
  onChange={(e) => handleInputChange(e, 'Date_Pub','Start')}/>
                              <InputField id="rechercheBdPublicationEndDate" label="Date publication fin" type="date" value={formData.Date_Pub.Finish}
  onChange={(e) => handleInputChange(e, 'Date_Pub','Finish')}/>
                              <InputField id="rechercheBdGazetteNumber" label="N° gazette" type="text" placeholder="Nº"value={formData.Gazette}
  onChange={(e) => handleInputChange(e, 'Gazette')}/>
                              <InputField id="rechercheBdEmail" label="email" type="text" placeholder="email" value={formData.Email}
  onChange={(e) => handleInputChange(e, 'Deposant')}/>
                              <InputField id="rechercheBdOpposition" label="Opposition (minimum)" type="text" placeholder="opposition"value={formData.Oppositionnb}
  onChange={(e) => handleInputChange(e, 'Oppositionnb')}/>
                              <InputField id="rechercheBdNiceClass" label="Classe nice" type="text" placeholder="Classe" value={formData.Classnice}
  onChange={(e) => handleInputChange(e, 'Classnice')}/>
                              <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6">
                                   <DropDown id={"rechercheBdBrandTypeOmpic"} list={BrandTypeOmpic} label={"type marque (ompic)"} defaultText={"Ompic"}value={formData.Typemarque.Ompic}
  onChange={(e) => handleInputChange(e, 'Typemarque','Ompic')}/>
                                   <DropDown id={"rechercheBdBrandTypeTm"} list={BrandTypeTm} label={"type marque (Tm)"} defaultText={"Tm"} value={formData.Typemarque.Tm}
  onChange={(e) => handleInputChange(e, 'Typemarque','Tm')}/>
                              </div>
                              <InputField id="rechercheBdPreviousLawOpposition" label="Droit antérieure opposition" type="text" placeholder="opposition" value={formData.Opposant}
  onChange={(e) => handleInputChange(e, 'Deposant')}/>
                              <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6">
                                   <DropDown id={"rechercheBdStateOmpic"} list={StateOmpic} label={"Etat(Ompic)"} defaultText={"Ompic"} value={formData.Etat.Ompic}
  onChange={(e) => handleInputChange(e, 'Etat','Ompic')}/>
                                   <DropDown id={"rechercheBdStateTm"} list={StateTm} label={"Etat(Tm)"} defaultText={"Tm"} value={formData.Etat.Tm}
  onChange={(e) => handleInputChange(e, 'Etat','Tm')}/>
                              </div>
                              <InputField id="rechercheBdOpponent" label="Opposant" type="text" placeholder="Opposant" value={formData.Opposant}
  onChange={(e) => handleInputChange(e, 'Opposant')}/>
                         </div>}
                         <div className="flex flex-wrap md:gap-4 gap-2">
                         <Button type={"submit"} name={"rechercheBdSearch"} onClick={() => handleButtonClick("rechercheBdSearch")}>
                          Chercher
                        </Button>                       
                        
                        <Button type={"button"} name={"rechercheBdPhoto"} bg={true} onClick={() => handleButtonClick("rechercheBdPhoto")}>
                          Recherche pho
                        </Button>
                        <Button type={"button"} name={"rechercheBdAdd"} bg={true} onClick={() => handleButtonClick("rechercheBdAdd")}>
                          Ajouter
                        </Button>
                        <Button type={"button"} name={"SearchPro"} bg={true} onClick={() => handleButtonClick("SearchPro")}>
                        SearchPro
                        </Button>
                        <Button type={"button"} name={"SearchProAll"} bg={true} onClick={() => handleButtonClick("SearchProAll")}>
                        SearchProAll
                        </Button>
                         </div>
                    </form>
               </section>
               <section className="bg-white py-10 shadow-lg rounded-md">
                    <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                    <DropDown
                      id={"rechercheBdColumnToggleForm"}
                      list={columnToggle}
                      label={"Afficher / Masquer Colonne"}
                      defaultText={"sélectionner une colonne"}
                      classes={"max-w-80 w-full"}
                      onChange={handleColumnToggle} // Pass your onChange handler function here
                    />
                         {/* <Button type={"button"} name={"rechercheBdColumnToggleBtn"} classes={"h-fit"} onClick={handleColumnToggle}>AFFICHER / MASQUER</Button> */}
                         <IconDev list={iconList} classes={"lg:mt-0 mt-4 xl:w-auto xl:flex-grow"} onClickHandlers={iconClickHandlers} />
                         <Pagination
                          itemsPerPage={itemsPerPage}
                          totalItems={sortedData.length}
                          paginate={paginate}
                          setCurrentPage={setCurrentPage}
                          currentPage={currentPage}
                        />
                    </div>
                    {isLoadingtwo && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      )}
                    <div className="overflow-x-scroll xl:sl-scroll-hidden" id="content-to-print">
                    {sortedData.length > 0 && (
                      <p style={{ fontSize: '14px', marginBottom: '35px',marginLeft :'35px', color: '#666' }}>
                        Nombre de résultats : {sortedData.length}
                      </p>
                    )}
                         <table name="rechercheBdTable" className="xl:w-full w-max ">
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
                                {currentItems.length > 0 ? (
                                  currentItems.map((item, index) => (
                                    <tr key={index}>
                                      <td>
                                        {/* Add a checkbox with a unique ID based on item.Numero */}
                                        <input type="checkbox" id={`checkbox_${item.Numero}`} ref={el => (checkboxes.current[item.Numero] = el)} />
                                      </td>
                                      <td>{item.Numero}</td>
                                      <td>
                                        {/* Image here, using item.ImgUrl for the src attribute */}
                                        <img src={item.ImgUrl} alt="Brand" style={{ width: "100px", height: "auto" }} onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/100"; }} />
                                      </td>
                                      <td className="Nom_marque">{renderOmpicAndTm(item.Name.ompic,item.Name.tm)}</td>
                                      <td className="Deposant"
                                          style={clickableStyle}
                                          onClick={() => handleInsightsClick(item, 'Deposant')}
                                        
                                      >{renderOmpicAndTm(item.BrandOwner.ompic,item.BrandOwner.tm)}</td>
                                      <td 
                                        className="Mandataire"
                                        style={clickableStyle}
                                        onClick={() => handleInsightsClick(item, 'Mandataire')}
                                        
                                      >
                                        {renderOmpicAndTm(item.Representative_name.ompic, item.Representative_name.tm)}
                                      </td>
                                      <td className="Date_depot">{renderOmpicAndTm(item.Date_depot.ompic,item.Date_depot.tm)}</td>
                                      <td className="Date_expiration">{renderOmpicAndTm(item.Date_expiration.ompic,item.Date_expiration.tm)}</td>
                                      <td className="whitespace-normal break-words max-w-[200px] min-w-[100px] Classe_Nice">{renderOmpicAndTm(item.ClasseNice.ompic,item.ClasseNice.tm)}</td>
                                      <td className="Statut">{renderOmpicAndTm(item.Statut.ompic,item.Statut.tm)}</td>
                                      <td className={`Type hidden_searchbd`}>{renderOmpicAndTm(item.Type.ompic, item.Type.tm)}</td>
                                      <td className={`Adresse_deposant hidden_searchbd`}>{renderOmpicAndTm(item.Applicant_address.ompic, item.Applicant_address.tm)}</td>
                                      <td className={`Email hidden_searchbd`}>{renderOmpicAndTm(item.Email.ompic, item.Email.tm)}</td>
                                      <td className={`Loi hidden_searchbd`}>{renderOmpicAndTm(item.Loi.ompic, item.Loi.tm)}</td>
                                      <td className={`Numero_publication hidden_searchbd`}>{renderOmpicAndTm(item.Numero_publication.ompic, item.Numero_publication.tm)}</td>
                                      <td className={`Applicant_legalentity hidden_searchbd`}>{renderOmpicAndTm(item.Applicant_legalentity, '')}</td>
                                      <td className={`Applicant_nationalityCode hidden_searchbd`}>{renderOmpicAndTm(item.Applicant_nationalityCode, '')}</td>
                                      <td className={`Representative_countryCode hidden_searchbd`}>{renderOmpicAndTm(item.Representative_nationalityCode, '')}</td>
                                      <td className={`Adresse_mandataire hidden_searchbd`}>{renderOmpicAndTm(item.Representative_address, '')}</td>
                                      <td className={`Representative_city hidden_searchbd`}>{renderOmpicAndTm(item.Representative_city, '')}</td>
                                      <td className={`Representative_countryCode hidden_searchbd`}>{renderOmpicAndTm(item.Representative_countryCode, '')}</td>
                                      <td className={`OppositionDate hidden_searchbd`}>{renderOmpicAndTm(item.OppositionDate, '')}</td>
                                      <td className={`Opposition_earlierMark_applicationNumber hidden_searchbd`}>{renderOmpicAndTm(item.Opposition_earlierMark_applicationNumber, '')}</td>
                                      <td className={`Opposition_applicant_name hidden_searchbd`}>{renderOmpicAndTm(item.Opposition_applicant_name, '')}</td>
                                      <td className={`Opposition_applicant_legalentity hidden_searchbd`}>{renderOmpicAndTm(item.Opposition_applicant_legalentity, '')}</td>
                                      <td className={`Opposition_nationaliyCode hidden_searchbd`}>{renderOmpicAndTm(item.Opposition_nationaliyCode, '')}</td>
                                      <td className={`Opposition_applicant_address hidden_searchbd`}>{renderOmpicAndTm(item.Opposition_applicant_address, '')}</td>
                                      <td className={`Opposition_applicant_city hidden_searchbd`}>{renderOmpicAndTm(item.Opposition_applicant_city, '')}</td>
                                      <td className={`Opposition_applicant_countryCode hidden_searchbd`}>{renderOmpicAndTm(item.Opposition_applicant_countryCode, '')}</td>

                                      <td  style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                      <Button style={{ marginBottom: '0.5rem' }} onClick={() => handleDetailsClick(item)}>Details</Button>

                                      <Button bg={true} onClick={() => handleOmpicClick(item.Numero)}>Ompic</Button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="100%">Loading data or no data available...</td>
                                  </tr>
                                )}
                              </tbody>
                         )}
                              
                         </table>
                         {isPopupOpen && (
  <InfoPopup
    data={popupData}
    type={popupType}
    onClose={() => setIsPopupOpen(false)}
  />
)}
                         {!isLoading && renderOmpicAndTm.length === 0 && (
                         <tbody>
                              <tr>
                                   <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No Brand found.</td>
                              </tr>
                         </tbody>
                    )}    
                    </div>
               </section>
          </>
     )
}