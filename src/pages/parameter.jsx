import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../components/Titles/pageTitle";
import Button from "../components/Button/button";
import Pagination from "../components/Pagination/pagination";

export default function Parameter() {
    const [gazettes, setGazettes] = useState([]);
    const [newGazette, setNewGazette] = useState({ num_pub: '', date: '' });
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingGazette, setEditingGazette] = useState({ num_pub: '', date: '' });

    useEffect(() => {
        fetch('http://192.168.2.111:56478/api/alertes/gazettes')
            .then(response => response.json())
            .then(data => setGazettes(data))
            .catch(error => console.error('Error fetching gazettes:', error));
    }, []);

    const handleAddGazette = async () => {
        const formattedDate = new Date(newGazette.date).toISOString().split('T')[0];

        const response = await fetch('http://192.168.2.111:56478/api/alertes/gazettes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...newGazette, date: formattedDate })
        });

        if (response.ok) {
            setGazettes([...gazettes, { ...newGazette, date: formattedDate }]);
            setNewGazette({ num_pub: '', date: '' });
        } else {
            const errorText = await response.text();
            console.error('Failed to add gazette:', errorText);
            window.alert('Failed to add gazette: ' + errorText);
        }
    };

    const handleUpdateGazette = async () => {
        const formattedDate = new Date(editingGazette.date).toISOString().split('T')[0];

        const response = await fetch(`http://192.168.2.111:56478/api/alertes/gazettes/${editingGazette.num_pub}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...editingGazette, date: formattedDate })
        });

        if (response.ok) {
            setGazettes(gazettes.map((g, index) => index === editingIndex ? { ...editingGazette, date: formattedDate } : g));
            setEditingIndex(null); // Exit edit mode
        } else {
            const errorText = await response.text();
            console.error('Failed to update gazette:', errorText);
            window.alert('Failed to update gazette: ' + errorText);
        }
    };

    const handleDeleteGazette = async (num_pub) => {
        const response = await fetch(`http://192.168.2.111:56478/api/alertes/gazettes/${num_pub}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            setGazettes(gazettes.filter(g => g.num_pub !== num_pub));
        } else {
            const errorText = await response.text();
            console.error('Failed to delete gazette:', errorText);
            window.alert('Failed to delete gazette: ' + errorText);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0];
    };

    return (
        <section>
            <PageTitle>Parametre</PageTitle>
            <div className="bg-white py-10 shadow-lg rounded-md">
                <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                    <Pagination classes={"!mt-0"} />
                </div>
                <div className="overflow-x-scroll xl:sl-scroll-hidden">
                    <table name="ParameterTable" className="xl:w-full w-max">
                        <thead>
                            <tr>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Numero publication</th>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Date</th>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gazettes.map((gazette, index) => (
                                <tr key={index}>
                                    {editingIndex === index ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editingGazette.num_pub}
                                                    onChange={(e) => setEditingGazette({ ...editingGazette, num_pub: e.target.value })}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="date"
                                                    value={formatDate(editingGazette.date)}
                                                    onChange={(e) => setEditingGazette({ ...editingGazette, date: e.target.value })}
                                                />
                                            </td>
                                            <td className="flex gap-1">
                                                <Button bg={true} onClick={handleUpdateGazette}>Save</Button>
                                                <Button onClick={() => setEditingIndex(null)}>Cancel</Button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{gazette.num_pub}</td>
                                            <td>{formatDate(gazette.date)}</td>
                                            <td className="flex gap-1">
                                                <Button onClick={() => handleDeleteGazette(gazette.num_pub)}>Supprimer</Button>
                                                <Button bg={true} onClick={() => { setEditingIndex(index); setEditingGazette(gazette); }}>Modifier</Button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={newGazette.num_pub}
                                        onChange={(e) => setNewGazette({ ...newGazette, num_pub: e.target.value })}
                                        placeholder="Numero publication"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="date"
                                        value={newGazette.date}
                                        onChange={(e) => setNewGazette({ ...newGazette, date: e.target.value })}
                                    />
                                </td>
                                <td>
                                    <Button bg={true} onClick={handleAddGazette}>Ajouter</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}