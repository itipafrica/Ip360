import React, { useState } from 'react';
import { faEnvelope, faKey, faLock, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button/button";
import { Link, useNavigate } from "react-router-dom";

export default function Registration() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    // Convert image file to base64 string
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleRegistration = async (e) => {
        e.preventDefault();
        
        if (!email || !password || !image) {
            alert('Please fill in all fields and select an image.');
            return;
        }
        
        try {
            const base64Image = await convertToBase64(image);
            
            const registrationData = JSON.stringify([{
                Username: email,
                Password: password,
                ImagePath: base64Image, // Send as base64
            }]);
            
            const response = await fetch('http://192.168.2.111:56478/api/Register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: registrationData,
            });
            
            if (response.ok) {
                // Assuming a successful registration redirects to the login page
                navigate('/auth/login');
            } else {
                const responseData = await response.text();
                console.error('Registration error:', responseData);
                alert('Registration failed: ' + responseData);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration.');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    return (
        <form onSubmit={handleRegistration}>
            <h3 className="uppercase font-semibold tracking-wider text-sm text-center py-6">Registration details</h3>
            <div className="relative border-b border-sky py-2 pl-8 mb-6">
                <input type="email" name="email" id="email" placeholder="ENTER USERNAME / EMAIL ADDRESS" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email" className="absolute left-1 top-1/2 -translate-y-1/2"><FontAwesomeIcon icon={faEnvelope} /></label>
            </div>
            <div className="relative border-b border-sky py-2 pl-8 mb-4">
                <input type="password" name="password" id="password" placeholder="ENTER PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="password" className="absolute left-1 top-1/2 -translate-y-1/2"><FontAwesomeIcon icon={faKey} /></label>
            </div>
            <div className="text-center mb-6">
                <div className="mb-4">
                    <label htmlFor="imageUpload" className="cursor-pointer mb-2 inline-block">
                        <FontAwesomeIcon icon={faUpload} /> Upload Profile Picture
                    </label>
                    <input type="file" id="imageUpload" onChange={handleImageChange} style={{ display: 'none' }} />
                    {imagePreview && (
                        <div>
                            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                        </div>
                    )}
                </div>
                <Button type={"submit"} name={"login"}><FontAwesomeIcon className="mr-2" icon={faLock} /> Register</Button>
            </div>
            <div>
                <p className="text-center">Already have an Account? <Link to="/auth/login" className="text-slate font-semibold">Login Account</Link></p>
            </div>
        </form>
    );
}
