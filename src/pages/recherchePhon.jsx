import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../components/Pagination/pagination";
import SelectionField from "../components/Input/selectionField";

export default function RecherchePhon() {
     const method = ["Soundex", "Contains", "Paramétre", "Différence"];
     return (
          <>
               <section>
                    <PageTitle>Recherche phonetique</PageTitle>
                    <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16">
                         <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides:</h3>
                         <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <InputField id="RecherchePhonPublicationNum" label="Numéro de publication " type="text" placeholder="Numero" required={true} />
                              <SelectionField id="RecherchePhonMethod" dataArray={method} label="Méthodes" />
                              <InputField id="RecherchePhonReport" label="Importer Ip Report" type="file" required={true} />
                              <InputField id="RecherchePhonWallet" label="Importer Portefeuille" type="file" required={true} />
                              <InputField id="RecherchePhonImage" label="Importer images gazette" type="file" required={true} />
                         </div>
                         <div className="flex flex-wrap md:gap-4 gap-2">
                              <Button type={"submit"} name={"RecherchePhonFilter"}>Filtrer</Button>
                              <Button type={"button"} name={"RecherchePhonMaxFilter"} bg={true}>MaxFiltrer</Button>
                              <Button type={"button"} name={"RecherchePhonExcel"} bg={true}>Telecharger ipreport(Excel)</Button>
                              <Button type={"button"} name={"RecherchePhonResult"} bg={true}>Résultat ayant Cl com</Button>
                              <Button type={"button"} name={"RecherchePhonReset"} bg={true}>Réinitialiser</Button>
                         </div>
                    </form>
               </section>
               <section className="bg-white py-10 shadow-lg rounded-md">
                    <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                         <Pagination classes={"!mt-0"} />
                    </div>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                         <table name="RecherchePhonTable" className="xl:w-full w-max">
                              <thead>
                                   <tr>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Détails ip report marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Ip report marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Image ipreport marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Image marque similaire</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Portefeuille marque similaire</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Détails marque similaire</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Action</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                        <td className="flex gap-1">
                                             <Button>Générer Alerte</Button>
                                             <Button bg={true}>Alerte Maxfiltrer</Button>
                                        </td>
                                   </tr>
                              </tbody>
                         </table>
                    </div>
               </section>
          </>
     )
}