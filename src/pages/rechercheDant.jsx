import { useState, useEffect } from "react";
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import DropDown from "../components/Input/dropDown";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import IconDev from "../components/IconDiv/iconDiv";
import Pagination from "../components/Pagination/pagination";
import SortableHeader from "../components/SortableHeader/SortableHeader";
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import AtomicSpinner from 'atomic-spinner';

export default function RechercheDant() {
    const [fullForm, setFullForm] = useState(false);
    const BrandTypeOmpic = ["autres", "mixte", "figuratif", "dénominatif", "tridimensionnel", "sonore"];
    const BrandTypeTm = ["combined", "sound", "other"];
    const StateOmpic = ["opposition", "dechue", "irrecevable", "en cours d'examen", "opposition suspendue", "rejetee", "retiree", "expiree", "renouvlee", "enregistree", "en examen de forme", "consideree comme retiree", "opposition en cours", "renoncee", "publication programmee", "en instance de regularisation", "publiee", "en examen des motifs absolus", "radiee", "en poursuite de procedure"];
    const StateTm = ["registered", "registration cancelled", "application opposed", "registration surrendered", "application refused", "expired", "application withdrawn", "application filed", "application published", "appeal pending", "renewed"];
    const columnToggle = ["Nom_marque", "Applicant_name", "Representative_name", "Date_depot", "Date_expiration", "ClasseNice", "Statut", "Applicant_address", "Pays", "Representative_address", "Representative_countryCode", "Type", "Email", "Telephone", "Opposition_applicant_name", "Opposition_earlierMark_applicationNumber", "Nombre_opposition"];
    const priorityValue = ["NEANT", "20%", "50%", "80%", "100%"];
    const iconList = ["iconUpload", "iconSelectUpload", "iconBrand"];
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [apiData, setApiData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [valeurAnteriorite, setValeurAnteriorite] = useState("NEANT");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedResults, setSelectedResults] = useState({});

    useEffect(() => {
        setSearchResults(apiData);
    }, [apiData]);

    const [sortColumn, setSortColumn] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const columns = [
        { columnName: "Numero", label: "Numero", hidden: false },
        { columnName: "Image", label: "Image", hidden: false },
        { columnName: "Name.ompic", label: "Nom marque", hidden: false },
        { columnName: "BrandOwner.ompic", label: "Deposant", hidden: false },
        { columnName: "Representative_name.ompic", label: "Mandataire", hidden: false },
        { columnName: "Date_depot.ompic", label: "Date depot", hidden: false },
        { columnName: "Date_expiration.ompic", label: "Date expiration", hidden: false },
        { columnName: "ClasseNice.ompic", label: "Classe nice", hidden: false },
        { columnName: "Statut.ompic", label: "Statut marque", hidden: false },
        { columnName: "20", label: "20%", hidden: false },
        { columnName: "50", label: "50%", hidden: false },
        { columnName: "80", label: "80%", hidden: false },
        { columnName: "100", label: "100%", hidden: false },
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
    const handleColumnToggle = (selectedValue) => {
        const selectedColumn = String(selectedValue).replace(/\s+/g, "_");
        console.log(selectedColumn);
        const elements = document.getElementsByClassName(selectedColumn);
        console.log(elements);
        for (const element of elements) {
            element.classList.toggle('hidden_searchbd');
        }
    };

    const navigate = useNavigate();

    const handleDetailsClick = (item) => {
        navigate(`/app/company_details`, { state: { brandDetails: item } });
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

    const applySortingLogic = (data, sortColumn, sortOrder) => {
        if (!sortColumn) {
            return data;
        }

        const sortedData = [...data];

        sortedData.sort((a, b) => {
            const columnA = getColumnValue(a, sortColumn);
            const columnB = getColumnValue(b, sortColumn);

            if (typeof columnA === 'string') {
                return sortOrder === 'asc' ? columnA.localeCompare(columnB) : columnB.localeCompare(columnA);
            } else if (columnA instanceof Date) {
                return sortOrder === 'asc' ? columnA - columnB : columnB - columnA;
            } else if (typeof columnA === 'number') {
                return sortOrder === 'asc' ? columnA - columnB : columnB - columnA;
            }

            return 0;
        });

        return sortedData;
    };

    const handleSort = (columnName) => {
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

    const sortedData = apiData ? applySortingLogic(apiData, sortColumn, sortOrder) : [];

    const handleButtonClick = async (buttonName) => {
        console.log(`Button clicked: ${buttonName}`);

        if (buttonName === "rechercheBdSearch") {
        } else if (buttonName === "rechercheBdOmpic") {
        } else if (buttonName === "rechercheBdWipo") {
        } else if (buttonName === "rechercheBdPhoto") {
        } else if (buttonName === "rechercheBdAdd") {
        }
    };

    const handleInputChange = (e, section, field = null, subattribute = null) => {
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
            }
        } else if (field) {
            setFormData(prevState => ({
                ...prevState,
                [section]: {
                    ...prevState[section],
                    [field]: e.target.value,
                },
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [section]: e.target.value,
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const apiEndpoint = 'http://localhost:56478/api/RechercheBd';

        try {
            const requestBody = [{
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
                prompt: formData.prompt
            }];
            console.log(requestBody);
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data);
            setApiData(data);
            const sortedData = applySortingLogic(data, "Numero", "desc");
        } catch (error) {
            console.error("Failed to send data to API:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
        prompt: ''
    });

    const renderOmpicAndTm = (ompic, tm) => {
        if (!ompic && !tm) {
            return '';
        }

        ompic = String(ompic).replace(/\s+/g, ' ').trim().replace("00:00:00", "");
        tm = String(tm).replace(/\s+/g, ' ').trim().replace("00:00:00", "");

        if (ompic === tm) {
            return <div>{ompic || tm}</div>;
        } else {
            return (
                <>
                    <div>{ompic}</div>
                    <div style={{ color: 'blue' }}>{tm}</div>
                </>
            );
        }
    };

    const handleOmpicClick = (numero) => {
        let link = "";
        if (numero.startsWith("T-")) {
            const number = numero.substring(2);
            link = `https://www3.wipo.int/madrid/monitor/fr/showData.jsp?ID=ROM.${number}`;
        } else {
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

    const handleValeurAnterioriteChange = (e) => {
      setValeurAnteriorite(e.target ? e.target.value : e);
  };

  const handleCheckboxChange = (numero, similarityValue, isChecked) => {
    setSelectedResults(prevState => {
        const newState = { ...prevState };
        if (isChecked) {
            newState[numero] = similarityValue; // Ensure similarityValue is correct (e.g., "50%")
        } else {
            delete newState[numero];
        }
        return newState;
    });
};

const handleGeneratePdf = async () => {
  try {
    // Map selected results to match the structure expected by the API
    const selectedResultsArray = Object.keys(selectedResults).map(numero => {
      const result = searchResults.find(r => r.Numero === numero);
      return {
        Numero: result.Numero,
        ImageUrl: result.ImgUrl,
        Name: {
          ompic: result.Name.ompic,
          tm: result.Name.tm,
        },
        BrandOwner: {
          ompic: result.BrandOwner.ompic,
          tm: result.BrandOwner.tm,
        },
        Date_depot: {
          ompic: result.Date_depot.ompic,
          tm: result.Date_depot.tm,
        },
        Date_expiration: {
          ompic: result.Date_expiration.ompic,
          tm: result.Date_expiration.tm,
        },
        ClasseNice: {
          ompic: result.ClasseNice.ompic,
          tm: result.ClasseNice.tm,
        },
        Statut: {
          ompic: result.Statut.ompic,
          tm: result.Statut.tm,
        },
        DegreSimilarite: selectedResults[numero]
      };
    });

    // Prepare the payload
    const payload = {
      ValeurAnteriorite: valeurAnteriorite,
      NomMarque: formData.Nom,
      ClasseNice: formData.Classnice || 'all class nice', // Default to 'all class nice' if empty
      SearchResults: selectedResultsArray
    };

    console.log('Payload:', JSON.stringify(payload)); // Add logging for debugging

    // Send the payload to the API
    const response = await fetch('http://localhost:56478/api/Pdf/GenerateRapportAnteriorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API call failed with status: ${response.status} and message: ${errorText}`);
    }

    // Handle the response and download the PDF
    const blob = await response.blob();
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Rapport_anteriore.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error("Failed to generate PDF:", error);
  }
};
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = sortedData ? sortedData.slice(indexOfFirstItem, indexOfLastItem) : null;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
     return (
          <>
               <section>
                    <PageTitle>Rapport Du Recherche</PageTitle>
                    <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16" onSubmit={handleSubmit}>
                         <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides:</h3>
                         <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <div className="lg:col-span-2 flex flex-wrap lg:gap-x-9 gap-x-6">
                                   <CheckBox onChange={() => setFullForm(!fullForm)} id="RechercheDantToggleForm" label="Afficher/Masquer les champs" />
                              </div>
                              <InputField id="RechercheDantBrandName" label="Nom de la marque" type="text" placeholder="Nom" value={formData.Nom}
  onChange={(e) => handleInputChange(e, 'Nom')} />
                              <InputField id="RechercheDantDialNumber" label="Numero de marque" type="text" placeholder="Numero" value={formData.Numero}
  onChange={(e) => handleInputChange(e, 'Numero')} />
                              <InputField id="RechercheDantApplicant" label="Déposant" type="text" placeholder="Nom" value={formData.Deposant.nom}
  onChange={(e) => handleInputChange(e, 'Deposant','nom')} />
                              <InputField id="RechercheDantRepresentative" label="Mandataire" type="text" placeholder="Mandataire" value={formData.Mandataire.nom}
  onChange={(e) => handleInputChange(e, 'Mandataire','nom')} />
                         </div>
                         {fullForm && <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <InputField id="RechercheDantDepositorAddress" label="Adresse déposant" type="text" placeholder="Adresse" value={formData.Deposant.adresse}
  onChange={(e) => handleInputChange(e, 'Deposant','adresse')} />
                              <InputField id="RechercheDantProxyAddress" label="Adresse mandataire" type="text" placeholder="address" value={formData.Mandataire.adresse}
  onChange={(e) => handleInputChange(e, 'Mandataire','adresse')} />
                                    <InputField id="RechercheDantDepositorCountry" label="Pays déposant" type="text" placeholder="Pays"value={formData.Deposant.pays}
  onChange={(e) => handleInputChange(e, 'Deposant','pays')} />
                              <InputField id="RechercheDantMandatoryCountry" label="Pays mandataire" type="text" placeholder="Pays" value={formData.Mandataire.pays}
  onChange={(e) => handleInputChange(e, 'Mandataire','pays')} />
                              <InputField id="RechercheDantFilingStartDate" label="Date dépot début" type="date" value={formData.Date_depot.Start}
  onChange={(e) => handleInputChange(e, 'Date_depot','Start')} />
                              <InputField id="RechercheDantFilingEndDate" label="Date dépot fin" type="date" value={formData.Date_depot.Finish}
  onChange={(e) => handleInputChange(e, 'Date_depot','Finish')} />
                              <InputField id="RechercheDantExpirationStartDate" label="Date expiration début" type="date"value={formData.Date_Exp.Start}
  onChange={(e) => handleInputChange(e, 'Date_Exp','Start')} />
                              <InputField id="RechercheDantExpirationEndDate" label="Date expiration fin" type="date" value={formData.Date_Exp.Finish}
  onChange={(e) => handleInputChange(e, 'Date_Exp','Finish')} />
                              <InputField id="rechercheBdOpposition" label="Opposition (minimum)" type="text" placeholder="opposition" value={formData.Oppositionnb}
  onChange={(e) => handleInputChange(e, 'Oppositionnb')} />
                              <InputField id="RechercheDantEmail" label="email" type="text" placeholder="email"value={formData.Email}
  onChange={(e) => handleInputChange(e, 'Deposant')} />
                              <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6">
                                   <DropDown id={"RechercheDantBrandTypeOmpic"} list={BrandTypeOmpic} label={"type marque (ompic)"} defaultText={"Ompic"}value={formData.Typemarque.Ompic}
  onChange={(e) => handleInputChange(e, 'Typemarque','Ompic')} />
                                   <DropDown id={"RechercheDantBrandTypeTm"} list={BrandTypeTm} label={"type marque (Tm)"} defaultText={"Tm"}value={formData.Typemarque.Tm}
  onChange={(e) => handleInputChange(e, 'Typemarque','Tm')}/>
                              </div>
                              <InputField id="RechercheDantNiceClass" label="Classe nice" type="text" placeholder="Classe" value={formData.Classnice}
  onChange={(e) => handleInputChange(e, 'Classnice')} />
                              <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6">
                                   <DropDown id={"RechercheDantStateOmpic"} list={StateOmpic} label={"Etat(Ompic)"} defaultText={"Ompic"} value={formData.Etat.Ompic}
  onChange={(e) => handleInputChange(e, 'Etat','Ompic')} />
                                   <DropDown id={"RechercheDantStateTm"} list={StateTm} label={"Etat(Tm)"} defaultText={"Tm"}  value={formData.Etat.Tm}
  onChange={(e) => handleInputChange(e, 'Etat','Tm')}/>
                              </div>
                              <InputField id="RechercheDantPreviousLawOpposition" label="Droit antérieure opposition" type="text" placeholder="opposition" value={formData.Opposant}
  onChange={(e) => handleInputChange(e, 'Deposant')} />
                              <InputField id="RechercheDantOpponent" label="Opposant" type="text" placeholder="Opposant"  value={formData.Opposant}
  onChange={(e) => handleInputChange(e, 'Opposant')} />
                         </div>}
                         <div className="flex flex-wrap md:gap-4 gap-2">
                         <Button type={"submit"} name={"recherchedantSearch"} onClick={() => handleButtonClick("rechercheBdSearch")}>
                          Chercher
                        </Button>
                        <Button type={"button"} name={"recherchedantPhoto"} bg={true} onClick={() => handleButtonClick("rechercheBdPhoto")}>
                          Recherche pho
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
                          <Button type={"button"} name={"RechercheDantColumnToggleBtn"} classes={"h-fit"}>AFFICHER / MASQUER</Button>
                          <DropDown
    id={"RechercheDantPriorityValueForm"}
    list={priorityValue}
    label={"Valeur d'anteriorité"}
    defaultText={"NEANT"}
    classes={"max-w-40 w-full lg:mt-0 mt-6"}
    onChange={handleValeurAnterioriteChange}
/>
<Button type={"button"} name={"RechercheDantPriorityValueBtn"} classes={"h-fit"} onClick={handleGeneratePdf}>RAPPORT D'ANTÉRIORITÉ</Button>
                         <div className="w-auto flex-grow flex flex-wrap">
                              <IconDev list={iconList} classes={"lg:mt-0 mt-4 !w-auto flex-grow"} />
                               <Pagination
                          itemsPerPage={itemsPerPage}
                          totalItems={sortedData.length}
                          paginate={paginate}
                          setCurrentPage={setCurrentPage}
                          currentPage={currentPage}
                        />
                                              </div>
                    </div>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                    <table name="RechercheDantTable" className="xl:w-full w-max">
                    <thead>
                                   <tr>
                                        <th>SL</th>
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
                                          <input
                                              type="checkbox"
                                              id={`checkbox_${item.Numero}`}
                                              onChange={(e) => handleCheckboxChange(item.Numero, '50%', e.target.checked)} // Adjust similarity value as needed
                                          />
                                      </td>
                                      <td>{item.Numero}</td>
                                      <td>
                                          <img src={item.ImgUrl} alt="Brand" style={{ width: "100px", height: "auto" }} />
                                      </td>
                                      <td className="Nom_marque">{renderOmpicAndTm(item.Name.ompic, item.Name.tm)}</td>
                                      <td className="Deposant">{renderOmpicAndTm(item.BrandOwner.ompic, item.BrandOwner.tm)}</td>
                                      <td className="Mandataire">{renderOmpicAndTm(item.Representative_name.ompic, item.Representative_name.tm)}</td>
                                      <td className="Date_depot">{renderOmpicAndTm(item.Date_depot.ompic, item.Date_depot.tm)}</td>
                                      <td className="Date_expiration">{renderOmpicAndTm(item.Date_expiration.ompic, item.Date_expiration.tm)}</td>
                                      <td className="Classe_Nice">{renderOmpicAndTm(item.ClasseNice.ompic, item.ClasseNice.tm)}</td>
                                      <td className="Statut">{renderOmpicAndTm(item.Statut.ompic, item.Statut.tm)}</td>
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
                                      <td>
                    <input
                        type="checkbox"
                        id={`value20_${item.Numero}`}
                        value="20%"
                        onChange={(e) => handleCheckboxChange(item.Numero, e.target.value, e.target.checked)}
                    /> 
                    </td>
                    <td>
                    <input
                        type="checkbox"
                        id={`value50_${item.Numero}`}
                        value="50%"
                        onChange={(e) => handleCheckboxChange(item.Numero, e.target.value, e.target.checked)}
                    /> 
                    </td>
                    <td>
                    <input
                        type="checkbox"
                        id={`value80_${item.Numero}`}
                        value="80%"
                        onChange={(e) => handleCheckboxChange(item.Numero, e.target.value, e.target.checked)}
                    /> 
                    </td>
                    <td>
                    <input
                        type="checkbox"
                        id={`value100_${item.Numero}`}
                        value="100%"
                        onChange={(e) => handleCheckboxChange(item.Numero, e.target.value, e.target.checked)}
                    /> 
                </td>
                                      <td style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                         {!isLoading && renderOmpicAndTm.length === 0 && (
                         <tbody>
                              <tr>
                                   <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No data found.</td>
                              </tr>
                         </tbody>
                    )}    
                    </div>
               </section>
          </>
     )
}