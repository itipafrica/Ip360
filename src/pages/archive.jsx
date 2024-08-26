import Button from "../components/Button/button";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import IconDev from "../components/IconDiv/iconDiv";
import Pagination from "../components/Pagination/pagination";

export default function Archive() {
     const iconList = ["iconSearch", "iconPdf", "iconPdfSelect"]
     return (
          <>
               <section>
                    <PageTitle>Archive</PageTitle>
                    <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16">
                         <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides</h3>
                         <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-9 ">
                              <InputField id="ArchiveRefAlert" label="Referance d'alert " type="text" placeholder="d'alert" required={true} />
                              <InputField id="ArchiveUserName" label="User Nom" type="text" placeholder="Nom" required={true} />
                              <InputField id="ArchiveCreationStartDate" label="date creation debut" type="date" required={true} />
                              <InputField id="ArchiveCreationEndDate" label="date creation fin" type="date" required={true} />
                              <InputField id="ArchiveType" label="Type" type="text" placeholder="type" required={true} />
                         </div>
                         <div>
                              <IconDev list={iconList} classes={"lg:mt-0 mt-4 xl:w-auto xl:flex-grow"} />
                         </div>
                    </form>
               </section>
               <section className="bg-white py-10 shadow-lg rounded-md">
                    <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                         <Pagination classes={"!mt-0"} />
                    </div>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                         <table name="ValidationTable" className="xl:w-full w-max">
                              <thead>
                                   <tr>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Ref</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Type</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> User</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Date creation</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Action</th>
                                   </tr>
                              </thead>
                              <tbody>
                                   <tr>
                                        <td><Button bg={true}>download</Button></td>
                                   </tr>
                              </tbody>
                         </table>
                    </div>
               </section>
          </>
     )
}