import React, { useEffect, useState, useRef } from "react";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button/button";
import { useLocation, useNavigate } from 'react-router-dom';
import ReactToPrint from 'react-to-print';

export default function DmiDetails() {
    const [show1st, setShow1st] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { designDetails } = location.state || {};
    const componentRef = useRef(); // Create a ref for the printable component

    useEffect(() => {
        if (!designDetails) {
            navigate('/app');
        }
    }, [designDetails, navigate]);

    // If designDetails is not available, render nothing
    if (!designDetails) {
        return null;
    }

    const ImageGallery = ({ images }) => {
        const [scrollPosition, setScrollPosition] = useState(0);

        const scroll = (direction) => {
            const gallery = document.getElementById('image-gallery');
            const scrollAmount = 110; // Width of image + margin
            if (direction === 'left') {
                gallery.scrollLeft -= scrollAmount;
            } else {
                gallery.scrollLeft += scrollAmount;
            }
            setScrollPosition(gallery.scrollLeft);
        };

        return (
            <div className="relative max-w-full overflow-hidden">
                <div
                    id="image-gallery"
                    className="flex overflow-x-auto scrollbar-hide"
                    style={{
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                >
                    {images.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Design ${index + 1}`}
                            className="w-40 h-40 object-cover inline-block mr-4 rounded-md shadow-md"
                        />
                    ))}
                </div>
                {scrollPosition > 0 && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full no-print"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                )}
                {scrollPosition < (images.length - 1) * 110 && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full no-print"
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                )}
            </div>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
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
                <span>Fiche Detaillee Du Design</span>
                <ReactToPrint
                    trigger={() => <Button classes={'text-xs no-print'}>Generer PDF</Button>}
                    content={() => componentRef.current}
                    pageStyle="@page { size: auto;  margin: 20mm; } @media print { body { -webkit-print-color-adjust: exact; } }"
                />
            </PageTitle>
            <div ref={componentRef}>
                <section className="bg-white py-10 px-8 shadow-lg rounded-md mb-16 h-fit">
                    <h3 className="flex flex-wrap justify-between item-center text-base capitalize font-semibold text-slate mb-2">
                        Informations sur le design
                    </h3>
                    <div className="my-8 flex justify-center">
                        <div className="w-full max-w-3xl">
                            <ImageGallery images={designDetails.imageUrl} />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 my-4">
                        <div className="flex-grow w-0 font-medium grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                            <p>Numéro de design : <span className="font-normal">{designDetails.applicationNumber}</span></p>
                            <p>Nom : <span className="font-normal">{designDetails.nom.join(", ")}</span></p>
                            <p>Designer : <span className="font-normal">{designDetails.designerName || 'N/A'}</span></p>
                            <p>Déposant : <span className="font-normal">{designDetails.applicantName.join(", ")}</span></p>
                            <p>Mandataire : <span className="font-normal">{designDetails.representativeName}</span></p>
                            <p>Date d'enregistrement : <span className="font-normal">{formatDate(designDetails.registrationDate)}</span></p>
                            <p>Date d'expiration : <span className="font-normal">{formatDate(designDetails.expiryDate)}</span></p>
                            <p>Classe Locarno : <span className="font-normal">{designDetails.locarnoClass.join(", ")}</span></p>
                            <p>Zone de Protection : <span className="font-normal">{designDetails.tProtection.join(", ")}</span></p>
                            <p>Statut du design : <span className="font-normal">{designDetails.designStatus}</span></p>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}