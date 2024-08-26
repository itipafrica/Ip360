import React, { useState } from 'react';
import { faEnvelope, faKey, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CheckBox from "../components/Input/checkBox";
import Button from "../components/Button/button";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        if (!email || !password) {
            setError('Please fill in both email and password.');
            return;
        }

        const data = JSON.stringify([{ Username: email, Password: password }]);
        
        try {
            const response = await fetch('http://192.168.2.111:56478/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            });
            const responseData = await response.json();
            if (responseData.length > 0) {
                navigate('/app');
            } else {
                setError('Invalid email or password.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('An error occurred during login. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3 className="uppercase font-semibold tracking-wider text-sm text-center py-6">Login Details</h3>
            <div className="relative border-b border-sky py-2 pl-8 mb-6">
                <input type="email" name="email" id="email" placeholder="ENTER USERNAME / EMAIL ADDRESS" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="email" className="absolute left-1 top-1/2 -translate-y-1/2"><FontAwesomeIcon icon={faEnvelope} /></label>
            </div>
            <div className="relative border-b border-sky py-2 pl-8 mb-4">
                <input type="password" name="password" id="password" placeholder="ENTER PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} />
                <label htmlFor="password" className="absolute left-1 top-1/2 -translate-y-1/2"><FontAwesomeIcon icon={faKey} /></label>
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="flex items-center justify-between gap-2 mb-6">
                <CheckBox revere={true} id="remember" label="Remember Me" classes={'!mb-0'} />
                <a href="#">Forget Password?</a>
            </div>
            <div className="text-center mb-6">
                <Button type={"submit"} name={"login"}><FontAwesomeIcon className="mr-2" icon={faLock} /> Login</Button>
            </div>
            <div>
                <p className="text-center">Don't have an Account? <Link to="/auth/registration" className="text-slate font-semibold">Create Here</Link></p>
            </div>
        </form>
    );
}
