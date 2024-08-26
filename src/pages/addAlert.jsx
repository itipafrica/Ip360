import React, { useState } from 'react';
import IconDev from "../components/IconDiv/iconDiv";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";

export default function AddAlert() {
    const iconList = ["iconAdd"];
    const [formData, setFormData] = useState({
        marque_anterieure_reference: '',
        marque_contester_reference: '',
        marque_anterieure: '',
        marque_contester: '',
        num_pub: '',
        marque_ant_nationale: false,
        marque_ant_internationale: false,
        marque_cont_nationale: false,
        marque_cont_internationale: false
    });

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://192.168.2.111:56478/api/alertes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            alert('Alerte added successfully');
        } else {
            alert('Failed to add alerte');
        }
    };

    const iconClickHandlers = {
        iconAdd: handleSubmit,
    };

    return (
        <section>
            <PageTitle>Ajouter alerte</PageTitle>
            <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16" onSubmit={handleSubmit}>
                <h3 className="text-sm mb-2">Emplie ces champs par des valeurs valides:</h3>
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-9">
                    <div>
                        <InputField 
                            classes={"!mb-2"} 
                            id="marque_anterieure_reference" 
                            label="Marque antérieure" 
                            type="text" 
                            placeholder="lien ou numéro" 
                            required={true} 
                            onChange={handleChange} 
                            value={formData.marque_anterieure_reference}
                        />
                        <label>
                            <input 
                                type="checkbox" 
                                id="marque_ant_nationale" 
                                checked={formData.marque_ant_nationale} 
                                onChange={handleChange} 
                            />
                            Marque nationale
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                id="marque_ant_internationale" 
                                checked={formData.marque_ant_internationale} 
                                onChange={handleChange} 
                            />
                            Marque internationale
                        </label>
                    </div>
                    <div>
                        <InputField 
                            classes={"!mb-2"} 
                            id="marque_contester_reference" 
                            label="Marque à contester" 
                            type="text" 
                            placeholder="lien ou numéro" 
                            required={true} 
                            onChange={handleChange} 
                            value={formData.marque_contester_reference}
                        />
                        <label>
                            <input 
                                type="checkbox" 
                                id="marque_cont_nationale" 
                                checked={formData.marque_cont_nationale} 
                                onChange={handleChange} 
                            />
                            Marque nationale
                        </label>
                        <label>
                            <input 
                                type="checkbox" 
                                id="marque_cont_internationale" 
                                checked={formData.marque_cont_internationale} 
                                onChange={handleChange} 
                            />
                            Marque internationale
                        </label>
                    </div>
                    <InputField 
                        id="marque_anterieure" 
                        label="Marque antérieure" 
                        type="text" 
                        placeholder="Nom" 
                        required={true} 
                        onChange={handleChange} 
                        value={formData.marque_anterieure}
                    />
                    <InputField 
                        id="num_pub" 
                        label="Numéro publication" 
                        type="text" 
                        placeholder="numéro" 
                        required={true} 
                        onChange={handleChange} 
                        value={formData.num_pub}
                    />
                    <InputField 
                        id="marque_contester" 
                        label="Marque à contester " 
                        type="text" 
                        placeholder="Nom" 
                        required={true} 
                        onChange={handleChange} 
                        value={formData.marque_contester}
                    />
                </div>
                <div>
                    <IconDev list={iconList} classes={"lg:mt-0 mt-4 xl:w-auto xl:flex-grow"} onClickHandlers={iconClickHandlers} />
                </div>
            </form>
        </section>
    );
}