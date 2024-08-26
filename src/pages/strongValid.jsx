import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from "../components/Button/button";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faRepeat } from "@fortawesome/free-solid-svg-icons";
import DropDown from "../components/Input/dropDown";
import Pagination from "../components/Pagination/pagination";

export default function StrongValid() {
    const [marques, setMarques] = useState([]);
    const status = ["OPPOSITION", "DECHUE", "IRRECEVABLE", "EN COURS D'EXAMEN", "OPPOSITION SUSPENDUE", "REJETEE", "RETIREE", "EXPIREE", "RENOUVELEE", "ENREGISTREE", "EN EXAMEN DE FORME", "CONSIDEREE COMME RETIREE", "OPPOSITION EN COURS", "RENONCEE", "PUBLICATION PROGRAMMEE", "EN INSTANCE DE REGULARISATION", "PUBLIEE", "EN EXAMEN DES MOTIFS ABSOLUS", "RADIEE", "EN POURSUITE DE PROCEDURE"];
    const [editableMarques, setEditableMarques] = useState([]);
    const [updates, setUpdates] = useState([]); // Ensure updates is defined in the component's state
    const [searchParams, setSearchParams] = useState({
        type:'local',
        NomMarq: '',
        NumMarq : '',
        Deposant : '',
        Mandataire : '',
        ClasseNice : '',
        EtatMarqueOmpic : '',
        DateDepotDebut : '',
        DateDepotFin : '',
        DateExpDebut  : '',
        DateExpFin  : '',
    });
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:56478/api/Susbrands?type=local');
            setEditableMarques(response.data.map(marque => ({
                ...marque, editableNommarque2: marque.nommarque2
            })));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSearchParams(prevParams => ({ ...prevParams, [name]: value }));
    };

    const handleSearch = async (e) => {
        
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true);

        try {
            const response = await fetch('http://localhost:56478/api/Susbrands/searchsusmarque', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setEditableMarques(data); // Assuming the API returns the search result directly
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        } finally {
            setLoading(false);
        }
    };
    const updateMarque = async (index) => {
        const marqueToUpdate = editableMarques[index];
        try {
            await axios.post('http://localhost:56478/api/Susbrands/updateMarquesAll', {
                Updates: [{
                    NumeroTitre: marqueToUpdate.numeroTitre,
                    NewNommarque: marqueToUpdate.editableNommarque2,
                    OldNommarque: marqueToUpdate.nommarque,
                }],
                Type: 'local'
            });
            console.log('Marque updated successfully');
            fetchData(); // Optionally, refresh editableMarques from the server to reflect the update
        } catch (error) {
            console.error('Error updating marque:', error);
        }
    };

    const validateAllMarques = async (e) => {
        e.preventDefault(); // Prevent the form from causing a page reload
        try {
            await axios.post('http://localhost:56478/api/Susbrands/updateMarquesAll', {
                Updates: editableMarques.map(marque => ({
                    NumeroTitre: marque.numeroTitre,
                    NewNommarque: marque.editableNommarque2,
                    OldNommarque: marque.nommarque,
                })),
                Type: 'local'
            });
            console.log('All marques validated successfully');
            fetchData(); // Refresh data after successful bulk update
        } catch (error) {
            console.error('Error validating all marques:', error);
        }
    };

    return (
        <>
            <section>
                <PageTitle>Validation des noms</PageTitle>
                <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16">
                    <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides:</h3>
                    <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                        <InputField id="StrongValidBrandName" name="NomMarq" label="Nom de la marque contestée" type="text" placeholder="Nom" required={true} onChange={handleInputChange} />
                        <InputField id="StrongValidTrademarkNum" name="NumMarq" label="Numero de marque contestée" type="text" placeholder="Numero" required={true} onChange={handleInputChange} />
                        <InputField id="StrongValidApplicant" name="Deposant" label="Déposant" type="text" placeholder="Nom" required={true} onChange={handleInputChange} />
                        <InputField id="StrongValidRepresentative" name="Mandataire" label="Mandataire" type="text" placeholder="Mandataire" required={true} onChange={handleInputChange} />
                        <InputField id="StrongValidNiceClass" name="ClasseNice" label="Classe nice" type="text" placeholder="Classe" onChange={handleInputChange} />
                        <DropDown id="StrongValidState" name="etatMarque" list={status} label="État de la marque" defaultText="État" onChange={handleInputChange} />
                        <InputField id="StrongValidStartDate" name="DateDepotDebut" label="début date" type="date" onChange={handleInputChange} />
                        <InputField id="StrongValidEndDate" name="DateDepotFin" label="Fin date" type="date" onChange={handleInputChange} />
                    </div>
                    <div className="flex flex-wrap md:gap-4 gap-2">
                    <Button type="submit" onClick={handleSearch}>Chercher</Button>
                    <Button onClick={validateAllMarques} bg={true}>Validate All</Button>
                </div>
                </form>
            </section>
            <section className="bg-white py-10 shadow-lg rounded-md">              
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th>Numero marque</th>
                                <th>Image</th>
                                <th>Nom Marque</th>
                                <th>Nom Marque Validé</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {editableMarques.map((marque, index) => (
                                <tr key={index}>
                                    <td>{marque.numeroTitre}</td>
                                    <td>
                                        {/* Image here, using item.ImgUrl for the src attribute */}
                                        <img src={marque.ImgUrl} alt="Brand" style={{ width: "100px", height: "auto" }} />
                                    </td>    
                                    <td>{marque.nommarque}</td>
                                    <td>
                                        <InputField
                                            value={marque.editableNommarque2}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    </td>
                                    <td>
                                        <Button onClick={() => updateMarque(index)} bg={true}>Update</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}
