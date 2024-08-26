import React, { useState, useEffect } from 'react';
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import DropDown from "../components/Input/dropDown";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../components/Pagination/pagination";

export default function NotificationManageIIpro() {
     const sanding = ["Email", "Poste", "Both"];
     const alertType = ["opposition", "renouvellement"];

     const [notifications, setNotifications] = useState([]);
     const [loading, setLoading] = useState(true);

     const [formState, setFormState] = useState({
          ref: "", // Changed from brandRef to ref to match the name attribute of the corresponding InputField
          nomMarqCont: "", // Changed from brandName to nomMarqCont to match the name attribute
          numMarqCont: "", // Changed from brandNum to numMarqCont to match the name attribute
          mandataireCont: "", // Changed from representative to mandataireCont to match the name attribute
          applicant: "", // Matches the name attribute
          trademarkApp: "", // Matches the name attribute
          dateDepotDebut: "", // Changed from notifyStartDate to dateDepotDebut to match the name attribute
          dateDepotFin: "", // Changed from notifyEndDate to dateDepotFin to match the name attribute
          niceClass: "", // Matches the name attribute
          status: "", // Matches the name attribute
          sandingBy: "", // Changed from sandingBy to match the corrected DropDown name attribute
          alertType: "", // Changed from alertType to match the corrected DropDown name attribute
          type: "local", // Add this line

      });
      

     useEffect(() => {
          const fetchNotifications = async () => {
               setLoading(true);
               try {
                    const type = 'local'; // This could be dynamically set based on user input or other logic
                    const response = await fetch(`http://localhost:56478/api/Rithual/getnotification?type=${type}`);
                    if (!response.ok) {
                         throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setNotifications(data);
               } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
               } finally {
                    setLoading(false);
               }
          };

          fetchNotifications();
     }, []);

     const handleInputChange = (e) => {
          const { name, value } = e.target;
          setFormState(prevState => ({
               ...prevState,
               [name]: value,
          }));
     };




     const handleSearch = async (e) => {
          e.preventDefault(); // Prevent the default form submit action
          setLoading(true);

          try {
               const response = await fetch('http://localhost:56478/api/Rithual/search', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formState),
                });

               if (!response.ok) {
                    throw new Error('Network response was not ok');
               }

               const data = await response.json();
               setNotifications(data);
          } catch (error) {
               console.error('There was a problem with the fetch operation:', error);
          } finally {
               setLoading(false);
          }
     };

     return (
          <>
               <section>
                    <PageTitle>Gestion des Notification</PageTitle>
                    <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16" onSubmit={handleSearch}>
                         <h3 className="text-sm mb-2">Saisie les informations des marques:</h3>
                         <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <InputField id="ref" name="ref" label="Référence du marque" type="text" placeholder="Référence" required={true} onChange={handleInputChange} />
                              <InputField id="nomMarqCont" name="nomMarqCont" label="Nom de la marque contestée" type="text" placeholder="Nom" required={true} onChange={handleInputChange} />
                              <InputField id="numMarqCont" name="numMarqCont" label="Numero de marque contestée" type="text" placeholder="Numero" required={true} onChange={handleInputChange} />
                              <InputField id="mandataireCont" name="mandataireCont" label="Mandataire" type="text" placeholder="Mandataire" required={true} onChange={handleInputChange} />
                              <InputField id="applicant" name="applicant" label="Déposant" type="text" placeholder="Nom" required={true} onChange={handleInputChange} />
                              <InputField id="trademarkApp" name="trademarkApp" label="Déposant marque anterieure" type="text" placeholder="Nom" required={true} onChange={handleInputChange} />
                              <InputField id="dateDepotDebut" name="dateDepotDebut" label="Début date de notification" type="date" onChange={handleInputChange} />
                              <InputField id="dateDepotFin" name="dateDepotFin" label="Fin date de notification" type="date" onChange={handleInputChange} />
                              <InputField id="niceClass" name="niceClass" label="Classe Nice" type="text" placeholder="Classe" onChange={handleInputChange} />
                              <InputField id="status" name="status" label="État" type="text" placeholder="État" onChange={handleInputChange} />
                              <DropDown id="sandingBy" name="sandingBy" list={sanding} label="Envoi par" defaultText="_" onChange={handleInputChange} />
                              <DropDown id="alertType" name="alertType" list={alertType} label="Type alerte" defaultText="_" onChange={handleInputChange} />

                              <DropDown
                                   name="sandingBy"
                                   id={"NotificationSandingBy"}
                                   list={sanding}
                                   label={"Envoi par"}
                                   defaultText={"_"}
                                   onChange={handleInputChange}
                              />
                              <DropDown
                                   name="AlertType"
                                   id="NotificationManageAlertType"
                                   list={alertType}
                                   label="Type alert"
                                   defaultText="_"
                                   onChange={handleInputChange}
                              />
                         </div>
                         <div className="flex flex-wrap md:gap-4 gap-2">
                              <Button type={"submit"} name={"NotificationManageSearch"}>Chercher</Button>
                         </div>
                    </form>
               </section>
               <section className="bg-white py-10 shadow-lg rounded-md">
                    <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                         <Pagination classes={"!mt-0"} />
                    </div>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                         <table name="NotificationManageTable" className="xl:w-full w-max">
                              <thead>
                                   <tr>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Reference</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Destinataire</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> date validation</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> moyen d'envoi</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> PDF</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   {notifications.map((notification, index) => (
                                        <tr key={index}>
                                             <td>{notification.idalert}</td>
                                             <td>{notification.deposantipp}</td>

                                             <td>{notification.datevalid}</td>
                                             <td>{notification.sendby}</td>

                                             <td className="flex gap-1">
                                                  <Button>Download</Button>
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