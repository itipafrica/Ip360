import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import DropDown from "../components/Input/dropDown";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import SelectionField from "../components/Input/selectionField";
import Pagination from "../components/Pagination/pagination";

export default function RechercheOmpic() {
     const checkData1 = ["Exacte", "Phonétique"];
     const status = ["EN INSTANCE DE REGULARISATION", "EXPIREE", "OPPOSITION EN COURS", "RADIEE", "RENOUVELEE", "RENONCEE", "PUBLIEE", "ENREGISTREE", "REJETEE"];

     return (
          <>
               <section>
                    <PageTitle>Recherche ompic</PageTitle>
                    <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16">
                         <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides:</h3>
                         <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <div>
                                   <InputField id="RechercheOmpicBrandName" label="Nom de la marque" type="text" placeholder="Nom" required={true} />
                                   <SelectionField revere={true} dataArray={checkData1} id="RechercheOmpicBrandNameSelection" />
                              </div>
                              <InputField id="RechercheOmpicNiceClass" label="Classification de Nice" type="text" placeholder="Classe" />
                              <InputField id="RechercheOmpicFillingNum" label="Numéro de dépôt" type="text" placeholder="Numero" required={true} />
                              <DropDown id={"RechercheOmpicBrandStatus"} list={status} label={"État de la marque"} defaultText={"État"} />
                              <InputField id="RechercheOmpicFilingStartDate" label="Date dépot début" type="date" />
                              <InputField id="RechercheOmpicFilingEndDate" label="Date dépot fin" type="date" />
                              <InputField id="RechercheOmpicPriorityNum" label="Numéro de priorité" type="text" placeholder="Numero" required={true} />
                              <InputField id="RechercheOmpicHolder" label="Titulaire" type="text" placeholder="Nom" required={true} />
                         </div>
                         <div className="flex flex-wrap md:gap-4 gap-2">
                              <Button type={"submit"} name={"RechercheOmpicSearch"}>Chercher</Button>
                         </div>
                    </form>
               </section>
               <section className="bg-white py-10 shadow-lg rounded-md">
                    <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                         <Pagination classes={"!mt-0"} />
                    </div>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                         <table name="RechercheOmpicTable" className="xl:w-full w-max">
                              <thead>
                                   <tr>
                                        <th>SL</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Id</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Image</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Nom Marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Numero Titre</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Etat</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Titulaire</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Date Expiration</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Classe nice</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Action</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                        <td><CheckBox classes={"!mb-0"} id="RechercheOmpicTable" /></td>
                                        <td><Button bg={true}>Details</Button></td>
                                   </tr>
                              </tbody>
                         </table>
                    </div>
               </section>
          </>
     )
}