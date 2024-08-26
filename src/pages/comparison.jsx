import React, { useState, useEffect } from 'react';
import Button from "../components/Button/button";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import IconDev from "../components/IconDiv/iconDiv"; // Ensure these components are correctly implemented
import Pagination from "../components/Pagination/pagination";
import InputField from "../components/Input/inputField"; // Adjust import paths as necessary

export default function Comparison() {
     const [data, setData] = useState([]);
     const [formData, setFormData] = useState({ Value1: '', Value2: '', Type: '' });
     const [editMode, setEditMode] = useState(false);
     const [editId, setEditId] = useState(null);
 
     useEffect(() => {
         fetch('http://localhost:56478/api/Susbrands/CompareSett')
             .then(response => response.json())
             .then(data => setData(data))
             .catch(error => console.error('Error:', error));
     }, []);
 
     const handleChange = (e) => {
         setFormData({ ...formData, [e.target.name]: e.target.value });
     };
 
     const handleSubmit = (e) => {
         e.preventDefault();
         submitData();
     };
 
     const handleSave = () => {
         submitData();
     };
 
     const submitData = () => {
         const method = editMode ? 'PUT' : 'POST';
         const endpoint = editMode ? `http://localhost:56478/api/Susbrands/Update/${editId}` : 'http://localhost:56478/api/Susbrands/Insert';
 
         fetch(endpoint, {
             method,
             headers: { 'Content-Type': 'application/json', },
             body: JSON.stringify(formData),
         })
         .then(() => {
             setEditMode(false);
             setEditId(null);
             setFormData({ Value1: '', Value2: '', Type: '' });
             return fetch('http://localhost:56478/api/Susbrands/CompareSett');
         })
         .then(response => response.json())
         .then(data => setData(data))
         .catch(error => console.error('Error:', error));
     };
 
     const handleEdit = (item) => {
         setEditMode(true);
         setEditId(item.id);
         setFormData({ Value1: item.value1, Value2: item.value2, Type: item.type });
     };
 
     const handleDelete = (id) => {
         fetch(`http://localhost:56478/api/Susbrands/Delete/${id}`, { method: 'DELETE' })
         .then(() => fetch('http://localhost:56478/api/Susbrands/CompareSett'))
         .then(response => response.json())
         .then(data => setData(data))
         .catch(error => console.error('Error:', error));
     };
 

      return (
          <>
              <PageTitle>Paramétrage du comparaison</PageTitle>
            <section className="bg-white py-10 shadow-lg rounded-md">
            <form onSubmit={handleSubmit} className="flex flex-col gap-x-6 px-8 mb-8">
    <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-9 w-full">
        <InputField 
            id="valeur1" 
            name="Value1" 
            label="Valeur 1" 
            type="text" 
            placeholder="Valeur 1" 
            value={formData.Value1} 
            onChange={handleChange} 
            required={true} 
            classes="w-full" 
        />
        <InputField 
            id="valeur2" 
            name="Value2" 
            label="Valeur 2" 
            type="text" 
            placeholder="Valeur 2" 
            value={formData.Value2} 
            onChange={handleChange} 
            required={true} 
            classes="w-full"
        />
    </div>
    <div className="flex flex-col lg:flex-row justify-center items-center w-full mt-4 gap-4">
        <InputField 
            id="type" 
            name="Type" 
            label="Type" 
            type="text" 
            placeholder="Type" 
            value={formData.Type} 
            onChange={handleChange} 
            required={true} 
            classes="w-full lg:w-2/4"
        />
        <br></br>
        <br></br>

        <Button type="submit">{editMode ? 'Update' : 'Insert'}</Button>
    </div>
</form>


                <div className="overflow-x-scroll xl:overflow-x-hidden">
                    <table className="xl:w-full w-max">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>valeur 1</th>
                                <th>valeur 2</th>
                                <th>type</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    {editId === item.id ? (
                                        <>
                                            <td><input name="Value1" type="text" value={formData.Value1} onChange={handleChange} /></td>
                                            <td><input name="Value2" type="text" value={formData.Value2} onChange={handleChange} /></td>
                                            <td><input name="Type" type="text" value={formData.Type} onChange={handleChange} /></td>
                                            <td>
                                            <Button onClick={handleSave}>Save</Button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{item.value1}</td>
                                            <td>{item.value2}</td>
                                            <td>{item.type}</td>
                                            <td className="flex items-center gap-1">
                                                <Button onClick={() => handleEdit(item)} bg={true}><FontAwesomeIcon icon={faEdit} /></Button>
                                                <Button onClick={() => handleDelete(item.id)}><FontAwesomeIcon icon={faTrashAlt} /></Button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </>
    );
}