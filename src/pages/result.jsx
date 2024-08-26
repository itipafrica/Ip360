import Button from "../components/Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../components/Titles/pageTitle";
import { Link } from "react-router-dom";
import Pagination from '../components/Pagination/pagination';

export default function Result() {
     return (
          <section>
               <PageTitle>Resultat</PageTitle>
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
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Nom marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Deposant</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Nature marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> N° Marque contestere</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Nom marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Deposant</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Nature marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Action</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                        <td>Brand number</td>
                                        <td>Representative</td>
                                        <td>Date Depot</td>
                                        <td>Date Expiration</td>
                                        <td>Nice Classes</td>
                                        <td>Brand number</td>
                                        <td>Representative</td>
                                        <td>Date Depot</td>
                                        <td>Date Expiration</td>
                                        <td><Link to={`/app/compare`}><Button bg={true}>Traiter</Button></Link></td>
                                   </tr>
                              </tbody>
                         </table>
                    </div>
               </div>
          </section>
     )
}