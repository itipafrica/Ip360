import { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import PageTitle from "../components/Titles/pageTitle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";

export default function CourtDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { courtDetails } = location.state || {};
  const [detailedData, setDetailedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourtDetails = async () => {
      if (!courtDetails || !courtDetails.numDossier) {
        navigate('/app');
        return;
      }

      try {
        const response = await fetch(`http://192.168.2.111:56478/api/Tribunal/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Numdossier: courtDetails.numDossier })
        });

        const data = await response.json();
        const detail = data.data.find(item => item.numDossier === courtDetails.numDossier);
        setDetailedData(detail);
      } catch (error) {
        console.error("Error fetching court details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourtDetails();
  }, [courtDetails, navigate]);

  const renderField = (label, value) => (
    <p style={{ textAlign: 'right', direction: 'rtl' }}>{label} : <span className="font-normal">{value || '-'}</span></p>
  );

  const parseParties = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    let plaintiffs = Array.from(doc.querySelectorAll(".plaintiffs li")).map(li => ({ name: li.textContent.trim(), role: 'مدعي' }));
    let defendants = Array.from(doc.querySelectorAll(".defendants li")).map(li => ({ name: li.textContent.trim(), role: 'مدعى عليه' }));
    
    // If there are no explicit defendants, check if the last plaintiff should be a defendant
    if (defendants.length === 0 && plaintiffs.length > 1) {
      const lastPlaintiff = plaintiffs.pop();
      defendants.push({ ...lastPlaintiff, role: 'مدعى عليه' });
    }
    
    return { plaintiffs, defendants };
  };

  const parseAvocats = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    let avocatsPlaintiffs = Array.from(doc.querySelectorAll(".dfteam_ li")).map(li => li.textContent.trim());
    let avocatsDefendants = Array.from(doc.querySelectorAll(".st_ li")).map(li => li.textContent.trim());
    
    // If there are no explicit defendant lawyers, assume the last lawyer is for the defendant
    if (avocatsDefendants.length === 0 && avocatsPlaintiffs.length > 1) {
      avocatsDefendants = [avocatsPlaintiffs.pop()];
    }
    
    return { avocatsPlaintiffs, avocatsDefendants };
  };

  const parseDecisions = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const decisions = Array.from(doc.querySelectorAll("li")).map(li => {
      const textContent = li.textContent.trim();
      const parts = textContent.split(", ");
      return {
        id: parts[0].split(": ")[1],
        type: parts[1].split(": ")[1],
        date: parts[2].split(": ")[1],
        content: parts[3] ? parts[3].split("<li>")[0].replace('Content:', '').trim() : '',
      };
    });

    return decisions.map((decision, index, array) => ({
      ...decision,
      datenext: (index + 1 < array.length) ? array[index + 1].date : '-',
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!detailedData) {
    return <div>No details found for this case.</div>;
  }

  const procedures = parseDecisions(detailedData.decisions || '');
  const { plaintiffs, defendants } = parseParties(detailedData.parties || '');
  const { avocatsPlaintiffs, avocatsDefendants } = parseAvocats(detailedData.avocat || '');

  const combinedParties = [
    ...plaintiffs.map((party, index) => ({
      ...party,
      avocat: avocatsPlaintiffs[index] || '-'
    })),
    ...defendants.map((party, index) => ({
      ...party,
      avocat: avocatsDefendants[index] || '-'
    }))
  ];

  return (
    <>
      <PageTitle classes={'flex flex-wrap justify-between item-center'} style={{ textAlign: 'right', direction: 'rtl' }}>
        <span>تفاصيل القضية</span>
      </PageTitle>
      <section className="bg-white py-10 px-8 shadow-lg rounded-md mb-16 h-fit">
        <h3 className="flex flex-wrap justify-between item-center text-base capitalize font-semibold text-slate mb-2" style={{ textAlign: 'right', direction: 'rtl' }}>
          معلومات عن القضية
        </h3>
        <div className="flex flex-wrap gap-4 my-4">
          <div className="flex-grow w-0 font-medium grid xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {renderField('نوع الملف', detailedData.typeDossier)}
            {renderField('تاريخ التسجيل', detailedData.dateEnregistrement)}
            {renderField('تاريخ آخر حكم/القرار', detailedData.dateDernierJug)}
            {renderField('رقم الملف بالمحكمة', detailedData.numDossier)}
            {renderField('المستشار/ القاضي المقرر', detailedData.jugeRapporteur)}
            {renderField('آخر حكم/قرار', detailedData.libelleDernierJugement)}
            {renderField('المحكمة', detailedData.tribunal)}
            {renderField('الموضوع', detailedData.object)}
            {renderField('الشعبة', detailedData.libEntite)}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 shadow-lg rounded-md">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4" style={{ textAlign: 'right', direction: 'rtl' }}>
          <h3 className="text-sm font-semibold text-slate">لائحة الإجراءات</h3>
        </div>
        <div className="overflow-x-scroll xl:sl-scroll-hidden">
          <table className="xl:w-full w-max" style={{ direction: 'rtl', textAlign: 'right' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> تاريخ الإجراء</th>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> نوع الإجراء</th>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> القرار</th>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> تاريخ الجلسة المقبلة</th>
              </tr>
            </thead>
            <tbody>
              {procedures.length > 0 ? (
                procedures.map((procedure, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'right' }}>{procedure.date}</td>
                    <td style={{ textAlign: 'right' }}>{procedure.type}</td>
                    <td style={{ textAlign: 'right' }}>{procedure.content}</td>
                    <td style={{ textAlign: 'right' }}>{procedure.datenext}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'right' }}>لا توجد إجراءات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white py-10 shadow-lg rounded-md">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-4" style={{ textAlign: 'right', direction: 'rtl' }}>
          <h3 className="text-sm font-semibold text-slate">لائحة الأطراف</h3>
        </div>
        <div className="overflow-x-scroll xl:sl-scroll-hidden">
          <table className="xl:w-full w-max" style={{ direction: 'rtl', textAlign: 'right' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> الصفة</th>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> اسم الطرف</th>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> المحامون</th>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> المفوضون القضائيون</th>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> الوكلاء</th>
                <th style={{ textAlign: 'right' }}><FontAwesomeIcon icon={faArrowDown} /> الممثلون القانونيون</th>
              </tr>
            </thead>
            <tbody>
              {combinedParties.length > 0 ? (
                combinedParties.map((party, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: 'right' }}>{party.role}</td>
                    <td style={{ textAlign: 'right' }}>{party.name}</td>
                    <td style={{ textAlign: 'right' }}>{party.avocat}</td>
                    <td style={{ textAlign: 'right' }}>-</td>
                    <td style={{ textAlign: 'right' }}>-</td>
                    <td style={{ textAlign: 'right' }}>-</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'right' }}>لا توجد أطراف</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}