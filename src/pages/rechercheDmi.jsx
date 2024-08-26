import { useState,useRef } from "react";
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import DropDown from "../components/Input/dropDown";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import IconDev from "../components/IconDiv/iconDiv";
import Pagination from "../components/Pagination/pagination";
import AtomicSpinner from 'atomic-spinner';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function RechercheDmi() {
     const [fullForm, setFullForm] = useState(false);
     const [designs, setDesigns] = useState([]); // State to store fetched designs
     const status = ["Application published", "Design lapsed", "Design surrendered", "Registered and fully published", "tridimensionnel", "sonore"];
     const columnToggle = ["Nom_design", "Deposant", "Mandataire", "Date_depot", "Date_expiration", "Classe", "Statut"];
     const iconList = ["iconSearch", "iconPdf", "iconPdfSelect"];
     const [isLoading, setIsLoading] = useState(false);
     const checkboxes = useRef({});
     const location = useLocation();
     const navigate = useNavigate();
     // Inline styles for the table cell and images


     const handleSubmit = async (event) => {
          event.preventDefault(); // Prevent default form submission behavior
          setIsLoading(true);
          // Collect data from the form
          const formData = {
               nom_dmi: event.target.RechercheDmiDesignBrand.value,
               num_dmi: event.target.RechercheDmiDesignNumber.value,
               deposant: event.target.RechercheDmiApplicant.value,
               mandataire: event.target.RechercheDmiRepresentative.value,
               date_depot_debut: fullForm ? event.target.RechercheDmiFilingStartDate.value : "",
               date_depot_fin: fullForm ? event.target.RechercheDmiFilingEndDate.value : "",
               date_exp_debut: fullForm ? event.target.RechercheDmiExpirationStartDate.value : "",
               date_exp_fin: fullForm ? event.target.RechercheDmiExpirationEndDate.value : "",
               status: fullForm ? event.target.RechercheDmiStatus.value : "",
               Classe_nice: fullForm ? event.target.RechercheDmiNiceClass.value : "",
          };

          // Send data to your API
          try {
               const response = await fetch('http://192.168.2.111:56478/api/RechercheDmi', { // Adjust the URL as needed
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
               });

               if (!response.ok) throw new Error('Network response was not ok');

               const data = await response.json();
               setDesigns(data); // Corrected to setDesigns
          } catch (error) {
               console.error('There was a problem with the fetch operation:', error);
          }
          finally {
               setIsLoading(false); // End loading
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


          const handleDetailsClick = (item) => {
               navigate(`/app/design_details`, { state: { designDetails: item } });
             };
           

     return (
          <>
               <section>
                    <PageTitle>Recherche DMI</PageTitle>
                    <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16" onSubmit={handleSubmit}>
                         <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides:</h3>
                         <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <div className="lg:col-span-2 flex flex-wrap lg:gap-x-9 gap-x-6">
                                   <CheckBox onChange={() => setFullForm(!fullForm)} id="RechercheDmiToggleForm" label="Afficher/Masquer les champs" />
                              </div>

                              <InputField id="RechercheDmiDesignBrand" name="RechercheDmiDesignBrand" label="Nom de design" type="text" placeholder="Nom" required={true} />
                              <InputField id="RechercheDmiDesignNumber" name="RechercheDmiDesignNumber" label="Numero de design" type="text" placeholder="Numero" required={true} />
                              <InputField id="RechercheDmiApplicant" name="RechercheDmiApplicant" label="Déposant" type="text" placeholder="Nom" required={true} />
                              <InputField id="RechercheDmiRepresentative" name="RechercheDmiRepresentative" label="Mandataire" type="text" placeholder="Mandataire" required={true} />
                         </div>
                         {fullForm && <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <InputField id="RechercheDmiFilingStartDate" name="RechercheDmiFilingStartDate" label="Date dépot début" type="date" />
                              <InputField id="RechercheDmiFilingEndDate" name="RechercheDmiFilingEndDate" label="Date dépot fin" type="date" />
                              <InputField id="RechercheDmiExpirationStartDate" name="RechercheDmiExpirationStartDate" label="Date expiration début" type="date" />
                              <InputField id="RechercheDmiExpirationEndDate" name="RechercheDmiExpirationEndDate" label="Date expiration fin" type="date" />
                              <DropDown id="RechercheDmiStatus" name="RechercheDmiStatus" list={status} label="Status" defaultText="_" />
                              <InputField id="RechercheDmiNiceClass" name="RechercheDmiNiceClass" label="Classe nice" type="text" placeholder="Classe" />
                         </div>}
                         <div className="flex flex-wrap md:gap-4 gap-2">
                              <Button type="submit" name="RechercheDmiSearch">Chercher</Button>
                         </div>
                    </form>
               </section>
               <section className="bg-white py-10 shadow-lg rounded-md overflow-x-auto">
                    <table className="xl:w-full w-max">
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
                                   <th>Numero Design</th>
                                   <th>Images</th>
                                   <th>Nom Design</th>
                                   <th>Déposant</th>
                                   <th>Date Depot</th>
                                   <th>Date Expiration</th>
                                   <th>Classe</th>
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
                                   {designs.map((design, index) => (
                                        <tr key={index}>
                                             <td>
                                        {/* Add a checkbox with a unique ID based on item.Numero */}
                                        <input type="checkbox" id={`checkbox_${design.applicationNumber}`} ref={el => (checkboxes.current[design.applicationNumber] = el)} />
                                      </td>
                                             <td>{design.applicationNumber}</td>
                                             <td style={{
                                                  display: 'block',
                                                  overflowX: 'auto',
                                                  whiteSpace: 'nowrap',
                                                  maxWidth: '360px', // Adjust based on your needs
                                                  height: '170px' // Height to accommodate images plus some padding
                                             }}>
                                                  <div style={{
                                                       display: 'inline-block',
                                                       paddingTop: '5px',
                                                       paddingBottom: '5px'
                                                  }}>
                                                       {design.imageUrl.map((url, imgIndex) => (
                                                            <img
                                                                 key={imgIndex}
                                                                 src={url}
                                                                 alt={`Design ${imgIndex + 1}`}
                                                                 style={{
                                                                      width: "100px",
                                                                      height: "100px",
                                                                      display: 'inline-block',
                                                                      marginRight: '10px', // Spacing between images
                                                                      borderRadius: '5px', // Adds modern rounded corners to images
                                                                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Adds shadow for depth
                                                                 }}
                                                            />
                                                       ))}
                                                  </div>
                                             </td>


                                             <td>{design.nom.join(", ")}</td>
                                             <td>{design.applicantName.join(", ")}</td>
                                             <td>{design.registrationDate}</td>
                                             <td>{design.expiryDate}</td>
                                             <td>{design.locarnoClass.join(", ")}</td>
                                             <td>
                                             <Button bg={true} onClick={() => handleDetailsClick(design)}>Details</Button>
                                             </td>
                                        </tr>
                                   ))}
                              </tbody>
                         )}
                    </table>
                    {!isLoading && designs.length === 0 && (
                         <tbody>
                              <tr>
                                   <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>No designs found.</td>
                              </tr>
                         </tbody>
                    )}    
                        </section>
          </>
     );
}
