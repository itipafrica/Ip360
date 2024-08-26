import Button from "../components/Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PageTitle from "../components/Titles/pageTitle";
import Pagination from "../components/Pagination/pagination";

export default function Formulaires() {
     return (
          <section>
               <PageTitle>Formulaires</PageTitle>
               <div className="bg-white py-10 shadow-lg rounded-md">
                    <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                         <Pagination classes={"!mt-0"} />
                    </div>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                         <table name="GeneratePdfTable" className="xl:w-full w-max">
                              <thead>
                                   <tr>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> ID</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> N° Marque anterieure</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Nature marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> N° Marque contester</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Nature marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Action</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                        <td><Button>supprimer</Button></td>
                                   </tr>
                              </tbody>
                         </table>
                    </div>
                    <div className="flex flex-wrap md:gap-4 gap-2 ml-9 md:mt-6 mb-4">
                         <Button>Générer les documents</Button>
                         <Link to={`/app/result`}><Button bg={true}>Resultat</Button></Link>
                    </div>
               </div>
          </section>
     )
}