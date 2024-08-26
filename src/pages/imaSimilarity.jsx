import Button from "../components/Button/button";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import IconDev from "../components/IconDiv/iconDiv";
import Pagination from "../components/Pagination/pagination";
import InputField from "../components/Input/inputField";

export default function ImaSimilarity() {
     const iconList = ["iconSearch"]
     return (
          <>
               <PageTitle>Similitude des images</PageTitle>
               <section className="bg-white py-10 shadow-lg rounded-md overflow-x-scroll xl:sl-scroll-hidden">
                    <form className="flex flex-wrap items-center gap-x-6 px-8 mb-8 ">
                         <InputField id="ImaSimilarityImage" label="Image" type="file" required={true} classes={"lg:w-1/2"} />
                         <IconDev list={iconList} classes={"!w-auto flex-grow"} />
                         <Pagination classes={"!mt-0"} />
                    </form>
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
                                        <Button>Valider</Button>
                                        <Button bg={true}>Supprimer</Button>
                                        <Button>delete all</Button>
                                   </td>
                              </tr>
                         </tbody>
                    </table>
               </section>
          </>
     )
}