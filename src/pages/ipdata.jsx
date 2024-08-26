import React, { useState, useEffect, useRef,useCallback , useMemo  } from 'react';
import Button from "../components/Button/button";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Pagination from "../components/Pagination/pagination";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import axios from 'axios';
import MapComponent  from '../components/map/locations'; // Adjust the path as needed

import { GoogleMap, LoadScript, Marker , MarkerClusterer,useLoadScript  } from '@react-google-maps/api';
import {APIProvider, Map} from '@vis.gl/react-google-maps';


const MonthlyActivityChart = ({ data }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [lineLength, setLineLength] = useState(0);
    const chartRef = useRef(null);
    
    
    const center = {
        lat: 31.7917, // Latitude for Morocco
        lng: -7.0926  // Longitude for Morocco
    };

    const generateRandomColor = () => {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    };
    const lineColor = useMemo(() => generateRandomColor(), [data]);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = months.map(month => ({
        name: month,
        value: data[month] || 0
    }));

    useEffect(() => {
        if (isHovered && chartRef.current) {
            const length = chartRef.current.getTotalLength();
            setLineLength(length);

            chartRef.current.style.transition = 'none';
            chartRef.current.style.strokeDasharray = length + ' ' + length;
            chartRef.current.style.strokeDashoffset = length;
            chartRef.current.getBoundingClientRect();

            chartRef.current.style.transition = 'stroke-dashoffset 2s ease-in-out';
            chartRef.current.style.strokeDashoffset = '0';
        } else if (chartRef.current) {
            chartRef.current.style.transition = 'none';
            chartRef.current.style.strokeDasharray = 'none';
        }
    }, [isHovered]);
    
    return (
        <ResponsiveContainer width={300} height={200}>
            <LineChart 
                data={chartData}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={lineColor}  
                    strokeWidth={2}
                    dot={false}
                    ref={chartRef}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

const CustomTooltip = ({ active, payload, label, dataType }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="custom-tooltip bg-white p-4 border rounded shadow">
                <p >
  {dataType === 'TopClasses' 
    ? `Class ${label} : ${data.TotalCount || data.BrandCount} `
    : `${label} : ${data.TotalCount || data.BrandCount}`
  }
</p>
                {dataType !== 'TopClasses' && <MonthlyActivityChart data={data} />}
            </div>
        );
    }
    return null;
};
const renderCustomAxisTick = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text 
                x={0} 
                y={0} 
                dy={16} 
                textAnchor="end" 
                fill="#666" 
                transform="rotate(-35)"
                style={{fontSize: '12px'}}
            >
                {payload.value.length > 20 ? `${payload.value.substring(0, 20)}...` : payload.value}
            </text>
        </g>
    );
};

const ChartComponent = ({ data, title, dataType }) => {
    const chartData = data.map(item => ({
        name: item[dataType === 'TopClasses' ? 'ClasseNice' : (dataType === 'Representatives' ? 'Representative' : 'Deposant')],
        TotalCount: item.TotalCount || item.BrandCount,
        ...item
    }));

    return (
        <div className="mb-10">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={450}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="name" 
                        interval={0} 
                        tick={renderCustomAxisTick}
                        height={60}
                    />
                    <YAxis />
                    <Tooltip content={<CustomTooltip dataType={dataType} />} />
                    <Legend />
                    <Bar dataKey="TotalCount" fill="#8884d8" />
                </BarChart>
            </ResponsiveContainer>
            

        </div>
        
    );
};

export default function Statsipp() {
    const [data, setData] = useState({
        Representatives: [],
        Deposants: [],
        TopClasses: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locations, setLocations] = useState([]);
    
    

    
const fetchLocations = async () => {
    try {
        const response = await axios.get('http://192.168.2.111:56478/api/Stats/getlocations');
        setLocations(response.data);
        console.log(response.data);
    } catch (error) {
        console.error('Error fetching locations:', error);
    }
};
    
    
     
    useEffect(() => {
        fetchData();
        fetchLocations();
    }, []);
     // Calculate the center as the average of all points
  

     
    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get('http://192.168.2.111:56478/api/Stats');
            
            setData(response.data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to fetch data from the API');
            setIsLoading(false);
        }
    };
    

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <PageTitle>Stats</PageTitle>
            <section className="bg-white py-10 shadow-lg rounded-md overflow-x-scroll xl:sl-scroll-hidden">
                <div className="container mx-auto px-4">
                    <Button className="mb-4" onClick={fetchData}>
                        <FontAwesomeIcon icon={faArrowDown} className="mr-2" />
                        Refresh Data
                    </Button>
                    
                    <ChartComponent data={data.Representatives} title="Representatives" dataType="Representatives" />
                    <ChartComponent data={data.Deposants} title="Deposants" dataType="Deposants" />
                    <br/>
                    <ChartComponent data={data.TopClasses} title="Top Classes" dataType="TopClasses" />
                    
     
                   
               
                    <MapComponent locations={locations} />
                

                    <Pagination className="mt-8" />
                </div>
            </section>
        </>
    );
}