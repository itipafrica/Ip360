import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import PageTitle from "../components/Titles/pageTitle";
import Pagination from "../components/Pagination/pagination";
import Button from "../components/Button/button";

export default function GeneratePdf() {
    const [alerts, setAlerts] = useState([]);
    
    useEffect(() => {
        fetch('http://192.168.2.111:56478/api/alertes')
            .then(response => response.json())
            .then(data => setAlerts(data))
            .catch(error => console.error('Error fetching alerts:', error));
    }, []);

    const handleExtractData = async (alert) => {
        const requestBody = {
            marque_anterieure_reference: alert.marque_anterieure_reference,
            marque_contester_reference: alert.marque_contester_reference,
            marque_anterieure: alert.marque_anterieure,
            marque_contester: alert.marque_contester,
            num_pub: alert.num_pub,
            marque_ant_nationale: alert.nature_marque_anterieure === 'nationale',
            marque_ant_internationale: alert.nature_marque_anterieure === 'internationale',
            marque_cont_nationale: alert.nature_marque_contester === 'nationale',
            marque_cont_internationale: alert.nature_marque_contester === 'internationale'
        };

        console.log("Sending request to extract data:", requestBody);

        try {
            const response = await fetch('http://192.168.2.111:56478/api/alertes/ExtractData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to extract data:', errorText);
                window.alert('Failed to extract data: ' + errorText);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Extract filename from Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'ExtractedData.pdf'; // Default filename

            if (contentDisposition && contentDisposition.includes('attachment')) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) { 
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error during data extraction:', error);
            window.alert('Error during data extraction: ' + error.message);
        }
    };
    const handleExtractDataFR = async (alert) => {
        const requestBody = {
            marque_anterieure_reference: alert.marque_anterieure_reference,
            marque_contester_reference: alert.marque_contester_reference,
            marque_anterieure: alert.marque_anterieure,
            marque_contester: alert.marque_contester,
            num_pub: alert.num_pub,
            marque_ant_nationale: alert.nature_marque_anterieure === 'nationale',
            marque_ant_internationale: alert.nature_marque_anterieure === 'internationale',
            marque_cont_nationale: alert.nature_marque_contester === 'nationale',
            marque_cont_internationale: alert.nature_marque_contester === 'internationale'
        };

        console.log("Sending request to extract data:", requestBody);

        try {
            const response = await fetch('http://192.168.2.111:56478/api/alertes/ExtractDataFR', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to extract data:', errorText);
                window.alert('Failed to extract data: ' + errorText);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            // Extract filename from Content-Disposition header
            const contentDisposition = response.headers.get('Content-Disposition');
            let filename = 'ExtractedData.pdf'; // Default filename

            if (contentDisposition && contentDisposition.includes('attachment')) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) { 
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error during data extraction:', error);
            window.alert('Error during data extraction: ' + error.message);
        }
    };
    const handleDeleteAlert = async (alert) => {
        const requestBody = {
            Marque_anterieure_reference: alert.marque_anterieure_reference,
            Marque_contester_reference: alert.marque_contester_reference
        };

        console.log("Sending request to delete alert:", requestBody);

        const response = await fetch('http://192.168.2.111:56478/api/alertes', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (response.ok) {
            setAlerts(alerts.filter(a => a.marque_anterieure_reference !== alert.marque_anterieure_reference || a.marque_contester_reference !== alert.marque_contester_reference));
            console.log('Alert deleted successfully from UI');
        } else {
            const errorText = await response.text();
            console.error('Failed to delete alert:', errorText);
            window.alert('Failed to delete alert: ' + errorText);
        }
    };

    return (
        <section>
            <PageTitle>Generer document</PageTitle>
            <div className="bg-white py-10 shadow-lg rounded-md">
                <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                    <Pagination classes={"!mt-0"} />
                </div>
                <div className="overflow-x-scroll xl:sl-scroll-hidden">
                    <table name="GeneratePdfTable" className="xl:w-full w-max">
                        <thead>
                            <tr>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Marque anterieure</th>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Marque contester</th>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Marque anterieure reference</th>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Marque contester reference</th>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Nature marque anterieure</th>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Nature marque contester</th>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Numero publication</th>
                                <th><FontAwesomeIcon icon={faArrowDown} /> Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {alerts.map((alert, index) => (
                                <tr key={index}>
                                    <td>{alert.marque_anterieure}</td>
                                    <td>{alert.marque_contester}</td>
                                    <td>{alert.marque_anterieure_reference}</td>
                                    <td>{alert.marque_contester_reference}</td>
                                    <td>{alert.nature_marque_anterieure}</td>
                                    <td>{alert.nature_marque_contester}</td>
                                    <td>{alert.num_pub}</td>
                                    <td>
                                        <Button bg={true} onClick={() => handleExtractData(alert)}>
                                            PDF ANG
                                        </Button>
                                        <Button bg={true} onClick={() => handleExtractDataFR(alert)}>
                                            PDF FR
                                        </Button>
                                        <Button style={{ marginBottom: '0.5rem' }} onClick={() => handleDeleteAlert(alert)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}