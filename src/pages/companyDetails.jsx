import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PageTitle from "../components/Titles/pageTitle";
import Button from "../components/Button/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import ReactToPrint from 'react-to-print';

export default function CompanyDetails() {
    const [show1st, setShow1st] = useState(false);
    const location = useLocation();
    const navigate = useNavigate(); // Instantiate useNavigate
    const [isEditing, setIsEditing] = useState(false);
    const componentRef = useRef(); // Create a ref for the printable component

    const handleUpdate = () => {
        if (!isEditing) {
            document.querySelectorAll('input[type="hidden"]').forEach(input => {
                input.type = 'text';
                input.className = 'border border-gray-300 rounded px-2 py-1 mt-1 w-full';
            });
            setIsEditing(true);
        } else {
            const updatedDetails = {};
            document.querySelectorAll('input[type="text"]').forEach(input => {
                updatedDetails[input.id] = input.value;
                input.type = 'hidden';
                input.className = '';
            });
            console.log('Submitting updated details:', updatedDetails);
            setIsEditing(false);
        }
    };

    const { brandDetails } = location.state || {};
    console.log(brandDetails);
    // Redirect if brandDetails is not available
    if (!brandDetails) {
        navigate('/app'); // Navigate to the home page or another appropriate route
        // Alternatively, you could return null or some placeholder content if you don't want to redirect immediately
        return null; // Ensure that the rest of your component does not execute
    };

    const renderOmpicAndTm = (ompic, tm) => {
        if (!ompic && !tm) {
            // If both ompic and tm are empty, return an empty string
            return '';
        }

        ompic = String(ompic).replace(/\s+/g, ' ').trim().replace("00:00:00","");
        tm = String(tm).replace(/\s+/g, ' ').trim().replace("00:00:00","");

        if (ompic === tm) {
            // If ompic and tm are the same, display only one
            return <div>{ompic || tm}</div>;
        } else {
            // Display ompic on top and tm on the bottom with blue color
            return (
                <>
                    <div>{ompic || 'N/A'}</div>
                    <div style={{ color: 'blue' }}>{tm || 'N/A'}</div>
                </>
            );
        }
    };

    return (
        <>
            <style>
                {`
                    @media print {
                        .no-print {
                            display: none !important;
                        }
                    }
                `}
            </style>
            <PageTitle classes={'flex flex-wrap justify-between item-center'}>
                <span>Fiche Detaillee De La Marque</span> 
                <ReactToPrint
                    trigger={() => <Button classes={'text-xs no-print'}>Generer PDF</Button>}
                    content={() => componentRef.current}
                    pageStyle="@page { size: auto;  margin: 20mm; } @media print { body { -webkit-print-color-adjust: exact; } }"
                />
            </PageTitle>
            <div ref={componentRef}>
                <section className="bg-white py-10 px-8 shadow-lg rounded-md mb-16 h-fit">
                    <h3 className="flex flex-wrap justify-between item-center text-base capitalize font-semibold text-slate mb-2">
                        Informations sur la marque
                        <Button classes={'text-xs no-print'} onClick={handleUpdate}>
                            {isEditing ? 'Save' : 'Update'}
                        </Button>
                    </h3>
                    <div className="flex flex-wrap gap-4 my-4">
                        <div className="max-w-40">
                            <img src={brandDetails.ImgUrl} alt="" />
                        </div>
                        <div className="flex-grow w-0 font-medium grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                            <div>
                                <p>Nom Marque : <span className="font-normal">{renderOmpicAndTm(brandDetails.Name.ompic, brandDetails.Name.tm)}</span></p>
                                <input type="hidden" id="nomMarque" defaultValue={brandDetails.Name.ompic} />
                            </div>
                            <div>
                                <p>Numero Marque : <span className="font-normal">{brandDetails.Numero}</span></p>
                                <input type="hidden" id="numeroMarque" defaultValue={brandDetails.Numero} />
                            </div>
                            <div>
                                <p>Date Depot : <span className="font-normal">{renderOmpicAndTm(brandDetails.Date_depot.ompic, brandDetails.Date_depot.tm)}</span></p>
                                <input type="hidden" id="dateDepot" defaultValue={brandDetails.Date_depot.ompic} />
                            </div>
                            <div>
                                <p>Mandataire pays : <span className="font-normal">{/* Add appropriate value */}</span></p>
                                <input type="hidden" id="mandatairePays" defaultValue="" />
                            </div>
                            <div>
                                <p>Numero publication : <span className="font-normal">{renderOmpicAndTm(brandDetails.Numero_publication.ompic, brandDetails.Numero_publication.tm)}</span></p>
                                <input type="hidden" id="numeroPublication" defaultValue={brandDetails.Numero_publication.ompic} />
                            </div>
                            <div>
                                <p>Statut Marque : <span className="font-normal">{renderOmpicAndTm(brandDetails.Statut.ompic, brandDetails.Statut.tm)}</span></p>
                                <input type="hidden" id="statutMarque" defaultValue={brandDetails.Statut.ompic} />
                            </div>
                            <div>
                                <p>Deposant nationalité  :<span className="font-normal">{renderOmpicAndTm(brandDetails.Applicant_nationalityCode, '')}</span></p>
                                <input type="hidden" id="Deposant_nat" defaultValue={brandDetails.Applicant_nationalityCode} />
                            </div>
                            <div>
                                <p>Deposant  :<span className="font-normal">{renderOmpicAndTm(brandDetails.BrandOwner.ompic, brandDetails.BrandOwner.tm)}</span></p>
                                <input type="hidden" id="Deposant" defaultValue={brandDetails.BrandOwner.ompic} />
                            </div>
                            <div>
                                <p>Deposant adresse  :<span className="font-normal">{renderOmpicAndTm(brandDetails.Applicant_address.ompic, brandDetails.Applicant_address.tm)}</span></p>
                                <input type="hidden" id="Deposant_adresse" defaultValue={brandDetails.Applicant_address.ompic} />
                            </div>
                            <div>
                                <p>Date Expiration  :<span className="font-normal">{renderOmpicAndTm(brandDetails.Date_expiration.ompic, brandDetails.Date_expiration.tm)}</span></p>
                                <input type="hidden" id="Date_exp" defaultValue={brandDetails.Date_expiration.ompic} />
                            </div>
                            <div>
                                <p>Deposant pays :<span className="font-normal">{}</span></p>
                                <input type="hidden" id="Deposant_pays" defaultValue="" />
                            </div>
                            <div>
                                <p>Publication date :<span className="font-normal">{}</span></p>
                                <input type="hidden" id="Publication_date" defaultValue="" />
                            </div>
                            <div>
                                <p>Publication section :<span className="font-normal">{}</span></p>
                                <input type="hidden" id="Publication_sect" defaultValue="" />
                            </div>
                            <div>
                                <p>Mandataire nationalité :<span className="font-normal">{renderOmpicAndTm(brandDetails.Representative_nationalityCode, '')}</span></p>
                                <input type="hidden" id="Mandataire_nat" defaultValue={brandDetails.Representative_nationalityCode} />
                            </div>
                            <div>
                                <p>Mandataire :<span className="font-normal">{renderOmpicAndTm(brandDetails.Representative_name.ompic, brandDetails.Representative_name.tm)}</span></p>
                                <input type="hidden" id="Mandataire" defaultValue={brandDetails.Representative_name.ompic} />
                            </div>
                            <div>
                                <p>Mandataire adresse :<span className="font-normal">{renderOmpicAndTm(brandDetails.Representative_address, '')}</span></p>
                                <input type="hidden" id="Mandataire_adresse" defaultValue={brandDetails.Representative_address} />
                            </div>
                            <div>
                                <p>Type Marque :<span className="font-normal">{renderOmpicAndTm(brandDetails.Type.ompic, brandDetails.Type.tm)}</span></p>
                                <input type="hidden" id="Type" defaultValue={brandDetails.Type.ompic} />
                            </div>
                            <div>
                                <p>Mandataire ville :<span className="font-normal">{renderOmpicAndTm(brandDetails.Representative_city, '')}</span></p>
                                <input type="hidden" id="Mandataire_city" defaultValue={brandDetails.Representative_city} />
                            </div>
                            <div>
                                <p>Deposant ville :<span className="font-normal">{}</span></p>
                                <input type="hidden" id="Deposant_city" defaultValue="" />
                            </div>
                            <div>
                                <p>Classe de nice :<span className="font-normal">{renderOmpicAndTm(brandDetails.ClasseNice.ompic, brandDetails.ClasseNice.tm)}</span></p>
                                <input type="hidden" id="ClasseNice" value={brandDetails.ClasseNice.ompic} />
                            </div>
                            <div>
                                <p>Contact : <span className="font-normal">{renderOmpicAndTm(brandDetails.Email.ompic, brandDetails.Email.tm)}</span></p>
                                <input type="hidden" id="contact" defaultValue={brandDetails.Email.ompic} />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="bg-white py-10 px-8 shadow-lg rounded-md mb-16 h-fit">
                    <h3 className="flex flex-wrap justify-between item-center text-base capitalize font-semibold text-slate mb-2">Historique</h3>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                        <table name="rechercheBdTable" className="xl:w-full w-max">
                            <thead>
                                <tr>
                                    <th><FontAwesomeIcon icon={faArrowDown} /> Nom Champ</th>
                                    <th><FontAwesomeIcon icon={faArrowDown} /> Ancienne Valeur</th>
                                    <th><FontAwesomeIcon icon={faArrowDown} /> Nouvelle Valeur</th>
                                    <th><FontAwesomeIcon icon={faArrowDown} /> Date Modification</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Lorem</td>
                                    <td>Lorem</td>
                                    <td>Lorem</td>
                                    <td>05/04/2023 00:00:00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
                <section className="bg-white py-10 px-8 shadow-lg rounded-md">
                    <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-slate">Produits et services</h3>
                        <Button className="no-print" onClick={() => setShow1st(!show1st)}>{show1st ? 'Masquer' : 'Afficher'}</Button>
                    </div>
                    <div className={`overflow-hidden sl-animated-md ${show1st ? 'opacity-100 visible h-full' : 'opacity-0 invisible h-0'}`}>
                        <p>{renderOmpicAndTm(brandDetails.ClasseDetails.ompic, brandDetails.ClasseDetails.tm)}</p>
                    </div>
                </section>
            </div>
        </>
    )
}