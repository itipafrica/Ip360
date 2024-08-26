import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyActivityChart = ({ data }) => {
    if (!data) return null;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = months.map(month => ({
        name: month,
        value: data[month] || 0
    }));

    return (
        <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};
const InfoPopup = ({ data, type, onClose }) => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const name = type === 'Deposant' ? data.deposant : data.Mandataire;

    useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true);
            try {
                const response = await axios.post('http://192.168.2.111:56478/api/Stats', data);
                setInfo(response.data);
                setLoading(false);
                console.log('API Response:', response.data);
            } catch (err) {
                setError(`Failed to fetch information: ${err.message}`);
                setLoading(false);
            }
        };

        fetchInfo();
    }, [data]);

    if (loading) return <div className="info-popup">Loading...</div>;
    if (error) return <div className="info-popup">{error}</div>;
    if (!info) return null;

    return (
        <div className="info-popup bg-white p-4 border rounded shadow fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 max-h-90vh overflow-y-auto">
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">×</button>
            <h4 className="text-lg font-bold">{name}</h4>
            
            {info.LastBrand && (
                <>
                    <h5 className="text-md font-semibold mt-4">Last Brand</h5>
                    <p><strong>Name:</strong> {info.LastBrand.BrandName || 'N/A'}</p>
                    <p><strong>Deposit Date:</strong> {info.LastBrand.DepositDate ? new Date(info.LastBrand.DepositDate).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Source:</strong> {info.LastBrand.Source || 'N/A'}</p>
                    <p><strong>ST13:</strong> {info.LastBrand.ST13 || 'N/A'}</p>
                </>
            )}
            
            {info.MonthlyBrands && info.MonthlyBrands.length > 0 && (
                <>
                    <h5 className="text-md font-semibold mt-4">Monthly Brands</h5>
                    <MonthlyActivityChart data={info.MonthlyBrands[0]} />
                    <p>Total: {info.MonthlyBrands[0].TotalCount}, Ompic: {info.MonthlyBrands[0].OmpicCount}, Tm: {info.MonthlyBrands[0].TmCount}</p>
                </>
            )}
            
            {type === 'Mandataire' && info.TopDeposants && info.TopDeposants.length > 0 && (
                <>
                    <h5 className="text-md font-semibold mt-4">Top Deposants</h5>
                    <ul className="list-disc pl-5">
                        {info.TopDeposants.map((deposant, index) => (
                            <li key={index}>
                                {deposant.Deposant}: Total - {deposant.TotalCount}, Ompic - {deposant.OmpicCount}, Tm - {deposant.TmCount}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            
        </div>
    );
};

export default InfoPopup;