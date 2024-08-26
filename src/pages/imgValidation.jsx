import Button from "../components/Button/button";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../components/Pagination/pagination";

export default function ImgValidation() {
     return (
          <>
               <PageTitle>Validation des Images</PageTitle>
               <section className="bg-white py-10 shadow-lg rounded-md overflow-x-scroll xl:sl-scroll-hidden">
                    <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8 ">
                         <Pagination classes={"!mt-0"} />
                    </div>
                    <table className="xl:w-full w-max">
                         <thead>
                              <tr>
                                   <th><FontAwesomeIcon icon={faArrowDown} /> Numero Marque</th>
                                   <th><FontAwesomeIcon icon={faArrowDown} /> Image</th>
                                   <th><FontAwesomeIcon icon={faArrowDown} /> Image</th>
                                   <th><FontAwesomeIcon icon={faArrowDown} /> Nom Marque ant</th>
                                   <th><FontAwesomeIcon icon={faArrowDown} /> Score</th>
                                   <th><FontAwesomeIcon icon={faArrowDown} /> Action</th>
                              </tr>
                         </thead>
                         <tbody>
                              <tr>
                                   <td className="flex items-center gap-1">
                                        <Button bg={true}>Valider</Button>
                                        <Button>Supprimer</Button>
                                   </td>
                              </tr>
                         </tbody>
                    </table>
               </section>
          </>
     )
}