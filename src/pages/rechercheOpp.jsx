import React, { useState, useEffect, useCallback } from "react";
import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import InputField from "../components/Input/inputField";
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import IconDev from "../components/IconDiv/iconDiv";
import Pagination from "../components/Pagination/pagination";
import { useLocation } from 'react-router-dom';
import headerImage from 'C:/Users/Administrateur/source/repos/test/test/images/header-IP-AFRICA.png';
import footerImg from 'C:/Users/Administrateur/source/repos/test/test/images/footer-ipafrica.jpg';
import jsPDF from 'jspdf';

export default function RechercheOpp() {
     const [fullForm, setFullForm] = useState(false);
     const iconList = ["iconSearch", "iconPdf", "iconPdfSelect"];

     const [isLoading, setIsLoading] = useState(false);

     const [apiData, setApiData] = useState(null);
     const [sortColumn, setSortColumn] = useState('');
     const [sortOrder, setSortOrder] = useState('asc');
     const columns = [
          { columnName: "Numero", label: "Numero Titre" ,hidden: false},
          { columnName: "Image", label: "Image" ,hidden: false},
          { columnName: "Name", label: "Nom marque",hidden: false },
          { columnName: "BrandOwner", label: "Deposant",hidden: false },
          { columnName: "Date_depot", label: "Date depot",hidden: false },
          { columnName: "Date_expiration", label: "Date expiration",hidden: false },
          { columnName: "Statut", label: "Statut marque",hidden: false },
     ];

     const handleColumnToggle = (selectedValue) => {
          const selectedColumn = String(selectedValue).replace(/\s+/g, "_");
          console.log(selectedColumn);
          const elements = document.getElementsByClassName(selectedColumn);
          console.log(elements);
          for (const element of elements) {
              element.classList.toggle('hidden_searchbd' );
          }
     };
    
     const [formData, setFormData] = useState({
          num_op: "",
          nom_marqcont: "",
          deposantcon: "",
          Classe_nicecon: "",
          nom_marqant: "",
          deposantant: "",
          Classe_niceant: "",
          num_marqcont: "",
          mandatairecont: "",
          num_marqant: "",
          mandataireant: "",
          Etatcont: "",
          prompt :""
     });

     const location = useLocation();

     useEffect(() => {
         const query = location.state?.query;
         console.log('Query from location state:', query);
     
         if (query) {
             submitForm(query);
         }
     }, [location.state]); 

     const submitForm = async (query) => {
         event.preventDefault();
         setIsLoading(true);
 
         const apiEndpoint = 'http://localhost:56478/api/Oppositions';
       
         try {
           const requestBody = {
             num_op: formData.num_op,
             prompt : query,
             nom_marqcont:formData.nom_marqcont,
             deposantcon: formData.deposantcon,
             Classe_nicecon: formData.Classe_nicecon,
             nom_marqant: formData.searcnom_marqanth_field,
             deposantant: formData.deposantant,
             Classe_niceant: formData.Classe_niceant,
             num_marqcont: formData.num_marqcont,
             mandatairecont: formData.mandatairecont,
             num_marqant: formData.num_marqant,
             mandataireant: formData.mandataireant,
             Etatcont: formData.Etatcont
           };
           console.log(requestBody);
           const response = await fetch(apiEndpoint, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify(requestBody),
           });
       
           if (!response.ok) {
             throw new Error(`API call failed with status: ${response.status}`);
           }
       
           const data = await response.json();
           console.log(data);
           setApiData(data);
           const sortedData = applySortingLogic(data, "Numero", "desc");
         } catch (error) {
           console.error("Failed to send data to API:", error);
         }
         finally {
           setIsLoading(false);
       }
     };

     const handleInputChange = (e, section, field = null, subattribute = null) => {
         if (subattribute) {
           try {
             const parsedJson = JSON.parse(e.target.value);
             setFormData(prevState => ({
               ...prevState,
               [section]: {
                 ...prevState[section],
                 [field]: {
                   ...prevState[section][field],
                   ...parsedJson,
                 },
               },
             }));
           } catch (error) {
             console.error("Error parsing JSON input:", error);
           }
         } else if (field) {
           setFormData(prevState => ({
             ...prevState,
             [section]: {
               ...prevState[section],
               [field]: e.target.value,
             },
           }));
         } else {
           setFormData(prevState => ({
             ...prevState,
             [section]: e.target.value,
           }));
         }
     };

     const handleSubmit = async (event) => {
         event.preventDefault();
         setIsLoading(true);

         const apiEndpoint = 'http://localhost:56478/api/Oppositions';
       
         try {
           const requestBody = {
              num_op: formData.num_op,
              prompt : formData.prompt,
              nom_marqcont:formData.nom_marqcont,
              deposantcon: formData.deposantcon,
              Classe_nicecon: formData.Classe_nicecon,
              nom_marqant: formData.searcnom_marqanth_field,
              deposantant: formData.deposantant,
              Classe_niceant: formData.Classe_niceant,
              num_marqcont: formData.num_marqcont,
              mandatairecont: formData.mandatairecont,
              num_marqant: formData.num_marqant,
              mandataireant: formData.mandataireant,
              Etatcont: formData.Etatcont
           };
           console.log(requestBody);
           const response = await fetch(apiEndpoint, {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify(requestBody),
           });
       
           if (!response.ok) {
             throw new Error(`API call failed with status: ${response.status}`);
           }
       
           const data = await response.json();
           console.log(data);
           setApiData(data);
           const sortedData = applySortingLogic(data, "Opposition_id", "desc");
         } catch (error) {
           console.error("Failed to send data to API:", error);
         }
         finally {
           setIsLoading(false);
       }
     };

     const applySortingLogic = (data, sortColumn, sortOrder) => {
         if (!sortColumn) {
           return data;
         }
       
         const sortedData = [...data];
       
         sortedData.sort((a, b) => {
           const columnA = getColumnValue(a, sortColumn);
           const columnB = getColumnValue(b, sortColumn);
       
           if (typeof columnA === 'string') {
             return sortOrder === 'asc' ? columnA.localeCompare(columnB) : columnB.localeCompare(columnA);
           } else if (columnA instanceof Date) {
             return sortOrder === 'asc' ? columnA - columnB : columnB - columnA;
           } else if (typeof columnA === 'number') {
             return sortOrder === 'asc' ? columnA - columnB : columnB - columnA;
           }
       
           return 0;
         });
       
         return sortedData;
     };

     const handleSort = (columnName) => {
       setSortColumn(columnName);
       setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
     };
       
     const getColumnValue = (obj, column) => {
         const columnHierarchy = column.split('.');
         let value = obj;
       
         for (const prop of columnHierarchy) {
           value = value[prop];
         }
       
         return value;
     };

     const generateSortableHeaders = () => {
         return columns.map((column) => (
           <SortableHeader
             key={column.columnName}
             columnName={column.columnName}
             label={column.label}
             sortColumn={sortColumn}
             sortOrder={sortOrder}
             onSort={handleSort}
             hidden={column.hidden || false}
           />
         ));
     };
       
    const sortedData = apiData ? applySortingLogic(apiData, sortColumn, sortOrder) : [];  

  

    const generatePDFAll = useCallback(async () => {
      const config = {
          pageWidth: 297,
          pageHeight: 210,
          marginLeft: 15,
          marginRight: 5,
          marginTop: 40,
          marginBottom: 20, // Increased bottom margin to accommodate page number
          headerImageWidth: 270,
          headerImageHeight: 20,
          fontSize: 8,
          headerFontSize: 9,
          rowHeight: 30,
          imageWidth: 20,
          imageHeight: 20
      };
  
      const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
      });
  
      const headers = ["Opposition ID", "Marque Contestée", "Image Contestée", "Image Antérieure", "Marque Antérieure", "Décision", "Statut"];
      const columnWidths = [20, 50, 30, 30, 50, 40, 40];
  
      const addHeaderImage = () => {
          pdf.addImage(headerImage, 'JPEG', config.marginLeft, 5, config.headerImageWidth, config.headerImageHeight);
      };
  
      const drawHeader = () => {
          pdf.setFontSize(config.headerFontSize);
          pdf.setFont('helvetica', 'bold');
          let xOffset = config.marginLeft;
          headers.forEach((header, index) => {
              pdf.rect(xOffset, config.marginTop - 10, columnWidths[index], 10);
              pdf.text(header, xOffset + 2, config.marginTop - 4);
              xOffset += columnWidths[index];
          });
      };
  
      const drawRow = async (item, y) => {
          pdf.setFontSize(config.fontSize);
          pdf.setFont('helvetica', 'normal');
          let xOffset = config.marginLeft;
  
          const cellData = [
              item.Opposition_id,
              `Nom: ${item.Nom_marque_contester}\nNum: ${item.N_depot_marque_contester}\nDéposant: ${item.Deposant_marque_contester}\nMandataire: ${item.MondataireCN}\nClasse: ${item.NiceClassCN}`,
              '', // Placeholder for contested image
              '', // Placeholder for earlier image
              `Nom: ${item.Nom_marque_anterieure}\nNum: ${item.N_depot_marque_anterieure}\nDéposant: ${item.Deposant_marque_anterieure}\nMandataire: ${item.MondataireAN}\nClasse: ${item.NiceClassAN}`,
              item.Decision,
              item.Statut
          ];
  
          let maxHeight = config.rowHeight;
  
          // Calculate the maximum height needed for this row
          cellData.forEach((cell, index) => {
              if (index !== 2 && index !== 3) { // Skip image cells
                  const cellHeight = pdf.getTextDimensions(cell, {maxWidth: columnWidths[index] - 4}).h + 4;
                  maxHeight = Math.max(maxHeight, cellHeight);
              }
          });
  
          // Draw cells and add content
          for (let index = 0; index < cellData.length; index++) {
              pdf.rect(xOffset, y, columnWidths[index], maxHeight);
              if (index === 2) {
                  // Handle contested image
                  await addImage(pdf, item.contester_img, xOffset + 5, y + (maxHeight - config.imageHeight) / 2, config.imageWidth, config.imageHeight);
              } else if (index === 3) {
                  // Handle earlier image
                  await addImage(pdf, item.ant_img, xOffset + 5, y + (maxHeight - config.imageHeight) / 2, config.imageWidth, config.imageHeight);
              } else {
                  pdf.text(cellData[index], xOffset + 2, y + 4, { maxWidth: columnWidths[index] - 4 });
              }
              xOffset += columnWidths[index];
          }
  
          return maxHeight; // Return the height of this row
      };
  
      const drawPage = async (dataSlice, pageNumber) => {
          if (pageNumber > 1) {
              pdf.addPage();
          }
          addHeaderImage();
          drawHeader();
  
          let y = config.marginTop;
          for (const item of dataSlice) {
              const rowHeight = await drawRow(item, y);
              y += rowHeight;
              if (y > config.pageHeight - config.marginBottom) {
                  addPageNumber(pageNumber);
                  pdf.addPage();
                  addHeaderImage();
                  drawHeader();
                  y = config.marginTop;
                  pageNumber++;
              }
          }
          addPageNumber(pageNumber);
      };
  
      const addImage = async (pdf, imgUrl, x, y, width, height) => {
          try {
              const img = await loadImage(imgUrl);
              pdf.addImage(img, 'JPEG', x, y, width, height);
          } catch (error) {
              console.error(`Failed to load image: ${imgUrl}`, error);
              pdf.text('Image not available', x, y + height / 2);
          }
      };
  
      const loadImage = (url) => {
          return new Promise((resolve, reject) => {
              const img = new Image();
              img.crossOrigin = "Anonymous";
              img.onload = () => resolve(img);
              img.onerror = reject;
              img.src = url;
          });
      };
  
      // New function to add page number
      const addPageNumber = (pageNumber) => {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          pdf.text(`Page ${pageNumber}`, config.pageWidth - 20, config.pageHeight - 10, { align: 'right' });
      };
  
      const itemsPerPage = Math.floor((config.pageHeight - config.marginTop - config.marginBottom) / config.rowHeight);
  
      for (let i = 0, pageNumber = 1; i < sortedData.length; i += itemsPerPage, pageNumber++) {
          await drawPage(sortedData.slice(i, i + itemsPerPage), pageNumber);
      }
  
      pdf.save('all_oppositions.pdf');
  }, [sortedData, headerImage]);

  const generatePDFSelected = useCallback(async () => {
    const selectedData = sortedData.filter(item => document.getElementById(`checkbox_${item.Opposition_id}`).checked);

    if (selectedData.length === 0) {
        alert("No oppositions selected.");
        return;
    }

    const config = {
        pageWidth: 297,
        pageHeight: 210,
        marginLeft: 15,
        marginRight: 5,
        marginTop: 40,
        marginBottom: 20, // Increased bottom margin to accommodate page number
        headerImageWidth: 270,
        headerImageHeight: 20,
        fontSize: 8,
        headerFontSize: 9,
        rowHeight: 30,
        imageWidth: 20,
        imageHeight: 20
    };

    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const headers = ["Opposition ID", "Marque Contestée", "Image Contestée", "Image Antérieure", "Marque Antérieure", "Décision", "Statut"];
    const columnWidths = [20, 50, 30, 30, 50, 40, 40];

    const addHeaderImage = () => {
        pdf.addImage(headerImage, 'JPEG', config.marginLeft, 5, config.headerImageWidth, config.headerImageHeight);
    };

    const drawHeader = () => {
        pdf.setFontSize(config.headerFontSize);
        pdf.setFont('helvetica', 'bold');
        let xOffset = config.marginLeft;
        headers.forEach((header, index) => {
            pdf.rect(xOffset, config.marginTop - 10, columnWidths[index], 10);
            pdf.text(header, xOffset + 2, config.marginTop - 4);
            xOffset += columnWidths[index];
        });
    };

    const drawRow = async (item, y) => {
        pdf.setFontSize(config.fontSize);
        pdf.setFont('helvetica', 'normal');
        let xOffset = config.marginLeft;

        const cellData = [
            item.Opposition_id,
            `Nom: ${item.Nom_marque_contester}\nNum: ${item.N_depot_marque_contester}\nDéposant: ${item.Deposant_marque_contester}\nMandataire: ${item.MondataireCN}\nClasse: ${item.NiceClassCN}`,
            '', // Placeholder for contested image
            '', // Placeholder for earlier image
            `Nom: ${item.Nom_marque_anterieure}\nNum: ${item.N_depot_marque_anterieure}\nDéposant: ${item.Deposant_marque_anterieure}\nMandataire: ${item.MondataireAN}\nClasse: ${item.NiceClassAN}`,
            item.Decision,
            item.Statut
        ];

        let maxHeight = config.rowHeight;

        // Calculate the maximum height needed for this row
        cellData.forEach((cell, index) => {
            if (index !== 2 && index !== 3) { // Skip image cells
                const cellHeight = pdf.getTextDimensions(cell, {maxWidth: columnWidths[index] - 4}).h + 4;
                maxHeight = Math.max(maxHeight, cellHeight);
            }
        });

        // Draw cells and add content
        for (let index = 0; index < cellData.length; index++) {
            pdf.rect(xOffset, y, columnWidths[index], maxHeight);
            if (index === 2) {
                // Handle contested image
                await addImage(pdf, item.contester_img, xOffset + 5, y + (maxHeight - config.imageHeight) / 2, config.imageWidth, config.imageHeight);
            } else if (index === 3) {
                // Handle earlier image
                await addImage(pdf, item.ant_img, xOffset + 5, y + (maxHeight - config.imageHeight) / 2, config.imageWidth, config.imageHeight);
            } else {
                pdf.text(cellData[index], xOffset + 2, y + 4, { maxWidth: columnWidths[index] - 4 });
            }
            xOffset += columnWidths[index];
        }

        return maxHeight; // Return the height of this row
    };

    const drawPage = async (dataSlice, pageNumber) => {
        if (pageNumber > 1) {
            pdf.addPage();
        }
        addHeaderImage();
        drawHeader();

        let y = config.marginTop;
        for (const item of dataSlice) {
            const rowHeight = await drawRow(item, y);
            y += rowHeight;
            if (y > config.pageHeight - config.marginBottom) {
                addPageNumber(pageNumber);
                pdf.addPage();
                addHeaderImage();
                drawHeader();
                y = config.marginTop;
                pageNumber++;
            }
        }
        addPageNumber(pageNumber);
    };

    const addImage = async (pdf, imgUrl, x, y, width, height) => {
        try {
            const img = await loadImage(imgUrl);
            pdf.addImage(img, 'JPEG', x, y, width, height);
        } catch (error) {
            console.error(`Failed to load image: ${imgUrl}`, error);
            pdf.text('Image not available', x, y + height / 2);
        }
    };

    const loadImage = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    };

    // New function to add page number
    const addPageNumber = (pageNumber) => {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${pageNumber}`, config.pageWidth - 20, config.pageHeight - 10, { align: 'right' });
    };

    const itemsPerPage = Math.floor((config.pageHeight - config.marginTop - config.marginBottom) / config.rowHeight);

    for (let i = 0, pageNumber = 1; i < selectedData.length; i += itemsPerPage, pageNumber++) {
        await drawPage(selectedData.slice(i, i + itemsPerPage), pageNumber);
    }

    pdf.save('selected_oppositions.pdf');
}, [sortedData, headerImage]);


      const iconClickHandlers = {
          
        iconPdf: generatePDFAll,  // This key must match exactly with the name in `iconList`
        iconPdfSelect :generatePDFSelected,
        
    };
     return (
          <>
               <section>
                    <PageTitle>recherche Oppositions</PageTitle>
                    <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16" onSubmit={handleSubmit}>
                         <h3 className="text-sm mb-2">Remplie ces champs par des valeurs valides:</h3>
                         <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <div className="lg:col-span-2 flex flex-wrap lg:gap-x-9 gap-x-6">
                                   <CheckBox onChange={() => setFullForm(!fullForm)} id="RechercheOppToggleForm" label="Afficher/Masquer les champs des marques antérieure" />
                              </div>
                              <InputField id="rechercheBdCondition" label="condition par text" type="text" placeholder="text"  value={formData.prompt}
  onChange={(e) => handleInputChange(e, 'prompt')}/>
                              <InputField id="RechercheOppOppositionNum" label="Numero de opposition" type="text" placeholder="Numero" required={false} value={formData.num_op}
  onChange={(e) => handleInputChange(e, 'num_op')}  />
                              <InputField id="RechercheOppTrademarkNum" label="Nom de la marque contestée" type="text" placeholder="Numero" required={false} value={formData.nom_marqcont}
  onChange={(e) => handleInputChange(e, 'nom_marqcont')}  />
                              <InputField id="RechercheOppApplicant" label="Déposant" type="text" placeholder="Nom" required={false} value={formData.deposantcon}
  onChange={(e) => handleInputChange(e, 'deposantcon')}  />
                              <InputField id="RechercheOppContestedBrand" label="Numero de marque contestée" type="text" placeholder="Numero" required={false} value={formData.num_marqcont}
  onChange={(e) => handleInputChange(e, 'num_marqcont')}  />
                              <InputField id="RechercheOppNiceClass" label="Classe nice" type="text" placeholder="Classe" value={formData.Classe_nicecon}
  onChange={(e) => handleInputChange(e, 'Classe_nicecon')}  />
                              <InputField id="RechercheOppRepresentative" label="Mandataire" type="text" placeholder="Mandataire" required={false} value={formData.mandatairecont}
  onChange={(e) => handleInputChange(e, 'mandatairecont')}  />
                              <InputField id="RechercheOppState" label="Etat" type="text" placeholder="Etat" required={false} value={formData.Etatcont}
  onChange={(e) => handleInputChange(e, 'Etatcont')}  />
                         </div>
                         {fullForm && <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-x-9">
                              <InputField id="RechercheOppEarlierMarkNum" label="Nom de la marque antérieure" type="text" placeholder="Nom"  value={formData.nom_marqant}
  onChange={(e) => handleInputChange(e, 'nom_marqant')} />
                              <InputField id="RechercheOppEarlierTrademarkNum" label="Numero de marque antérieure" type="text" placeholder="Numero" value={formData.num_marqant}
  onChange={(e) => handleInputChange(e, 'num_marqant')}  />
                              <InputField id="RechercheOppEarlierApplicant" label="Déposant" type="text" placeholder="Nom" value={formData.deposantant}
  onChange={(e) => handleInputChange(e, 'deposantant')}  />
                              <InputField id="RechercheOppEarlierNiceClass" label="Classe nice" type="text" placeholder="Classe" value={formData.Classe_niceant}
  onChange={(e) => handleInputChange(e, 'Classe_niceant')} />
                              <InputField id="RechercheOppEarlierRepresentative" label="Mandataire" type="text" placeholder="Mandataire"value={formData.mandataireant}
  onChange={(e) => handleInputChange(e, 'mandataireant')}  />
                              <InputField id="RechercheOppEarlierState" label="Etat" type="text" placeholder="Etat" value={formData.Etatcont}
  onChange={(e) => handleInputChange(e, 'Etatcont')}  />
                         </div>}
                         <div className="flex flex-wrap md:gap-4 gap-2">
                              <Button type={"submit"} name={"RechercheOppSearch"}>Chercher</Button>
                         </div>
                    </form>
               </section>
               <section className="bg-white py-10 shadow-lg rounded-md">
                    <div className="flex flex-wrap items-center gap-x-6 px-8 mb-8">
                         <IconDev list={iconList} classes={"lg:mt-0 mt-4 !w-0 flex-grow"} onClickHandlers={iconClickHandlers}/>
                         <Pagination classes={"!mt-0"} />
                    </div>
                    <div className="overflow-x-scroll xl:sl-scroll-hidden">
                         <table name="RechercheOppTable" className="xl:w-full w-max">
                              <thead>
                                   <tr>
                                        <th>SL</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Numéro Opposition</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Marque Contestée</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Image ipreport marque</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Image marque similaire</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Marque Antérieure</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Décision</th>
                                        <th><FontAwesomeIcon icon={faArrowDown} /> Statut</th>
                                   </tr>
                              </thead>
                              <tbody>
                              {sortedData.length > 0 ? (
                                  sortedData.map((item, index) => (
                                    <tr key={index}>
                                      <td>
                                        {/* Add a checkbox with a unique ID based on item.Numero */}
                                        <input type="checkbox" id={`checkbox_${item.Opposition_id}`} />
                                      </td>
                                      <td>{item.Opposition_id}</td>
                                      
                                      
                                      <td>
                                        <div>
                                             <strong>
                                             Nom Marque :
                                             </strong>
                                             {item.Nom_marque_contester}
                                        </div>
                                        <div>
                                             <strong>
                                             Numero Marque :
                                             </strong>
                                             {item.N_depot_marque_contester}
                                        </div>
                                        <div>
                                             <strong>
                                             Déposant Marque :
                                             </strong>
                                             {item.Deposant_marque_contester}
                                        </div>
                                        <div>
                                             <strong>
                                             Mandataire Marque :
                                             </strong>
                                             {item.MondataireCN}
                                        </div>
                                        <div>
                                             <strong>
                                             ClassNice Marque :
                                             </strong>
                                             {item.NiceClassCN}
                                        </div>
                                      </td>
                                      <td>
                                        {/* Image here, using item.ImgUrl for the src attribute */}
                                        <img src={item.contester_img} alt="Brand" style={{ width: "100px", height: "auto" }} />
                                      </td>
                                      <td>
                                        {/* Image here, using item.ImgUrl for the src attribute */}
                                        <img src={item.ant_img} alt="Brand" style={{ width: "100px", height: "auto" }} />
                                      </td>

                                      <td>
                                        <div>
                                             <strong>
                                             Nom Marque :
                                             </strong>
                                             {item.Nom_marque_anterieure}
                                        </div>
                                        <div>
                                             <strong>
                                             Numero Marque :
                                             </strong>
                                             {item.N_depot_marque_anterieure}
                                        </div>
                                        <div>
                                             <strong>
                                             Déposant Marque :
                                             </strong>
                                             {item.Deposant_marque_anterieure}
                                        </div>
                                        <div>
                                             <strong>
                                             Mandataire Marque :
                                             </strong>
                                             {item.MondataireAN}
                                        </div>
                                        <div>
                                             <strong>
                                             ClassNice Marque :
                                             </strong>
                                             {item.NiceClassAN}
                                        </div>
                                      </td>
                                      <td className="Date_depot">{item.Decision}</td>
                                      <td className="Date_expiration">{item.Statut}</td>
                                      
                                      
                                     

                                      <td  style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                      

                                      <Button bg={true} onClick={() => handleOmpicClick(item.Numero)}>Ompic</Button>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="100%">Loading data or no data available...</td>
                                  </tr>
                                )}
                              </tbody>
                         </table>
                    </div>
               </section>
          </>
     )
}