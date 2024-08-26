import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../components/Pagination/pagination";
import DropDown from "../components/Input/dropDown";
import AtomicSpinner from "atomic-spinner";

export default function RechercheTribunal() {
  const [fullForm, setFullForm] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [showParties, setShowParties] = useState({});
  const [showAvocats, setShowAvocats] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formKey, setFormKey] = useState(Date.now()); // Unique key to force re-render
  const pageSize = 10; // Define the page size
  const tribunal = ["autres", "mixte", "figuratif", "dénominatif", "tridimensionnel", "sonore"];
  const navigate = useNavigate(); // Instantiate useNavigate

  const handleSearch = async (event) => {
    if (event) event.preventDefault();

    setIsLoading(true); // Start loading

    const formData = new FormData(event.target);
    const searchPayload = {
      Parti1: formData.get("RechercheTribunalPartyName") || "",
      Avocat: formData.get("RechercheTribunalLawyerName") || "", // Changed from Parti2 to Avocat
      Numdossier: formData.get("RechercheTribunalCourtFileNum") || "",
      Typedossier: formData.get("RechercheTribunalTypeLegalFile") || "",
      Idcivil: formData.get("RechercheTribunalCivilFileId") || "",
      Juge: formData.get("RechercheTribunalAdvisorJudgeName") || "",
      Objet: formData.get("RechercheTribunalFolderObject") || "",
      DateJugDebut: formData.get("RechercheTribunalDecisionStartDate") || "",
      DateJugFin: formData.get("RechercheTribunalDecisionEndDate") || "",
      DateEnrngDebut: formData.get("RechercheTribunalRegistrationStartDate") || "",
      DateEnrngFin: formData.get("RechercheTribunalRegistrationEndDate") || "",
      CurrentPage: currentPage,
      PageSize: pageSize,
    };

    try {
      const response = await fetch("http://192.168.2.111:56478/api/Tribunal/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchPayload),
      });

      const data = await response.json();
      const uniqueResults = getUniqueResults(data.data || []);
      setSearchResults(uniqueResults); // Ensure data is an array
      setTotalRecords(uniqueResults.length); // Set the total records count based on unique results
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]); // Reset results on error
      setTotalRecords(0); // Reset total records on error
    } finally {
      setIsLoading(false); // End loading
      setFormKey(Date.now()); // Change key to reset form
    }
  };

  const getUniqueResults = (results) => {
    const uniqueResults = [];
    const uniqueIds = new Set();

    results.forEach((result) => {
      if (!uniqueIds.has(result.numDossier)) {
        uniqueIds.add(result.numDossier);
        uniqueResults.push(result);
      }
    });

    return uniqueResults;
  };

  const toggleVisibility = (type, id, section) => {
    if (type === "parties") {
      setShowParties((prevState) => ({
        ...prevState,
        [id]: { ...prevState[id], [section]: !prevState[id]?.[section] },
      }));
    } else if (type === "avocats") {
      setShowAvocats((prevState) => ({
        ...prevState,
        [id]: { ...prevState[id], [section]: !prevState[id]?.[section] },
      }));
    }
  };

  const parseHTMLList = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const items = Array.from(doc.querySelectorAll("li")).map((li) => li.textContent.trim());
    return items;
  };

  const renderList = (items, id, section) => (
    <ul id={`${section}_${id}`} className={section}>
      {items.length > 0 ? items.map((item, index) => <li key={index}>{item}</li>) : <li>-</li>}
    </ul>
  );

  const handleDetailsClick = (courtDetails) => {
    navigate('/app/court_details', { state: { courtDetails } });
  };

  const handleUpdate = async () => {
    const checkedDossiers = Object.keys(checkedItems).filter((key) => checkedItems[key]);
    if (checkedDossiers.length === 0) {
      alert("No dossiers selected for update.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5011/update_dossiers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          numeroCompletDossiers: checkedDossiers
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Update completed successfully!");
      } else {
        alert(`Update failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating dossiers:", error);
      alert("An error occurred while updating dossiers.");
    }
  };

  const handleCheckboxChange = (numDossier) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [numDossier]: !prevState[numDossier]
    }));
  };

  return (
    <>
      <section>
        <PageTitle>Recherche Tribunal</PageTitle>
        <form key={formKey} className="bg-white py-10 px-8 shadow-lg rounded-md mb-16" onSubmit={handleSearch}>
          <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides:</h3>
          <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
            <div className="lg:col-span-2 flex flex-wrap lg:gap-x-9 gap-x-6">
              <CheckBox onChange={() => setFullForm(!fullForm)} id="RechercheTribunalToggleForm" label="Afficher/Masquer les champs" />
            </div>
            <InputField id="RechercheTribunalCourtFileNum" name="RechercheTribunalCourtFileNum" label="Numéro de dossier du tribunal" type="text" placeholder="Numero" required={true} />
            <DropDown id="RechercheTribunalName" name="RechercheTribunalName" list={tribunal} label="Tribunal" defaultText="_" />
            <InputField id="RechercheTribunalTypeLegalFile" name="RechercheTribunalTypeLegalFile" label="Type de dossier judiciaire" type="text" placeholder="Type" required={true} />
            <InputField id="RechercheTribunalCivilFileId" name="RechercheTribunalCivilFileId" label="ID Dossier Civil" type="text" placeholder="id" required={true} />
          </div>
          {fullForm && (
            <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
              <InputField id="RechercheTribunalPartyName" name="RechercheTribunalPartyName" label="nom du parti" type="text" placeholder="nom" />
              <InputField id="RechercheTribunalLawyerName" name="RechercheTribunalLawyerName" label="Nom avocat" type="text" placeholder="nom" />
              <InputField id="RechercheTribunalAdvisorJudgeName" name="RechercheTribunalAdvisorJudgeName" label="Conseiller/juge rapporteur" type="text" placeholder="nom" />
              <InputField id="RechercheTribunalFolderObject" name="RechercheTribunalFolderObject" label="objet dossier" type="text" placeholder="nom" />
              <InputField id="RechercheTribunalDecisionStartDate" name="RechercheTribunalDecisionStartDate" label="Date Decision début" type="date" />
              <InputField id="RechercheTribunalDecisionEndDate" name="RechercheTribunalDecisionEndDate" label="Date Decision fin" type="date" />
              <InputField id="RechercheTribunalHearingFollowingStartDate" name="RechercheTribunalHearingFollowingStartDate" label="Date Audience suivant début" type="date" />
              <InputField id="RechercheTribunalHearingFollowingEndDate" name="RechercheTribunalHearingFollowingEndDate" label="Date Audience suivant fin" type="date" />
              <InputField id="RechercheTribunalRegistrationStartDate" name="RechercheTribunalRegistrationStartDate" label="Date enregistrement début" type="date" />
              <InputField id="RechercheTribunalRegistrationEndDate" name="RechercheTribunalRegistrationEndDate" label="Date enregistrement fin" type="date" />
              <InputField id="RechercheTribunalLastJudgmentStartDate" name="RechercheTribunalLastJudgmentStartDate" label="Date Dernier Jugement début" type="date" />
              <InputField id="RechercheTribunalFinalJudgmentEndDate" name="RechercheTribunalFinalJudgmentEndDate" label="Date Dernier Jugement fin" type="date" />
            </div>
          )}
          <div className="flex flex-wrap md:gap-4 gap-2">
            <Button type="submit" name="RechercheTribunalSearch">Chercher</Button>
            <Button type="button" name="UpdateDossiers" onClick={handleUpdate}>Update</Button>
          </div>
        </form>
      </section>
      <section className="bg-white py-10 shadow-lg rounded-md">
        <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
          <Pagination
            currentPage={currentPage}
            totalRecords={totalRecords}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            classes="!mt-0"
          />
        </div>
        <div className="flex justify-between items-center px-8 mb-4">
          <div className="text-sm">Showing {Math.min(searchResults.length, pageSize)} of {totalRecords} results</div>
        </div>
        <div className="overflow-x-scroll xl:sl-scroll-hidden" id="content-to-print">
          <table name="RechercheTribunalTable" className="xl:w-full w-max">
            <thead>
              <tr>
                <th><FontAwesomeIcon icon={faArrowDown} /> Select</th>
                <th><FontAwesomeIcon icon={faArrowDown} /> Num Dossier</th>
                <th><FontAwesomeIcon icon={faArrowDown} /> Parties</th>
                <th><FontAwesomeIcon icon={faArrowDown} /> Avocat</th>
                <th><FontAwesomeIcon icon={faArrowDown} /> Juge Rapporteur</th>
                <th><FontAwesomeIcon icon={faArrowDown} /> Tribunal</th>
                <th><FontAwesomeIcon icon={faArrowDown} /> Type dossier</th>
                <th><FontAwesomeIcon icon={faArrowDown} /> Object Dossier</th>
                <th><FontAwesomeIcon icon={faArrowDown} /> Date Dernier Jugement</th>
                <th><FontAwesomeIcon icon={faArrowDown} /> Action</th>
              </tr>
            </thead>
            {isLoading ? (
              <tbody style={{ position: 'relative', height: '200px' }}>
                <tr>
                  <td colSpan="10" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <AtomicSpinner />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {searchResults.length > 0 ? (
                  searchResults.map((result, index) => {
                    const partiesPlaintiffs = parseHTMLList(result.parties.split('<ul')[1] || '');
                    const partiesDefendants = parseHTMLList(result.parties.split('<ul')[2] || '');
                    const avocatsPlaintiffs = parseHTMLList(result.avocat.split('<ul')[1] || '');
                    const avocatsDefendants = parseHTMLList(result.avocat.split('<ul')[2] || '');

                    return (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={!!checkedItems[result.numDossier]}
                            onChange={() => handleCheckboxChange(result.numDossier)}
                          />
                        </td>
                        <td>{result.numDossier}</td>
                        <td>
                          <div>
                            <strong onClick={() => toggleVisibility('parties', result.numDossier, 'plaintiffs')}>مدعي:</strong>
                            {showParties[result.numDossier]?.plaintiffs && renderList(partiesPlaintiffs, result.numDossier, 'plaintiffs')}
                          </div>
                          <div>
                            <strong onClick={() => toggleVisibility('parties', result.numDossier, 'defendants')}>مدعى عليه:</strong>
                            {showParties[result.numDossier]?.defendants && renderList(partiesDefendants, result.numDossier, 'defendants')}
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong onClick={() => toggleVisibility('avocats', result.numDossier, 'dfteam')}>مدعي:</strong>
                            {showAvocats[result.numDossier]?.dfteam && renderList(avocatsPlaintiffs, result.numDossier, 'dfteam')}
                          </div>
                          <div>
                            <strong onClick={() => toggleVisibility('avocats', result.numDossier, 'st')}>مدعى عليه:</strong>
                            {showAvocats[result.numDossier]?.st && renderList(avocatsDefendants, result.numDossier, 'st')}
                          </div>
                        </td>
                        <td>{result.jugeRapporteur}</td>
                        <td>{result.tribunal}</td>
                        <td>{result.typeDossier}</td>
                        <td>{result.object}</td>
                        <td>{result.dateDernierJug}</td>
                        <td><Button bg={true} onClick={() => handleDetailsClick(result)}>Details</Button></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10">No results found</td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </section>
    </>
  );
}