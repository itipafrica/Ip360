import Button from "../components/Button/button";
import CheckBox from "../components/Input/checkBox";
import InputField from "../components/Input/inputField";
import SelectionField from "../components/Input/selectionField";
import PageTitle from "../components/Titles/pageTitle";

export default function Formulaire() {
     const nature = ["marque nationale", "marque internationale"];
     return (
          <section>
               <PageTitle>Formulaire</PageTitle>
               <form className="bg-white py-10 px-8 shadow-lg rounded-md mb-16">
                    <h3 className="text-sm mb-1">Remplie ces champs par des valeurs valides:</h3>
                    <p className="text-center text-red/70 italic mb-6">Formulaire d'opposition a une demande d'enregistrement de marque</p>
                    <div>
                         <span className="inline-block mb-2 uppercase tracking-wider">Nature du droit anterieue</span>
                         <CheckBox revere={true} id="FormulaireApplication" label="Propriétaire d’une demande d’enregistrement d’une marque antérieurement déposée." />
                         <CheckBox revere={true} id="FormulaireProtected" label=" Propriétaire d’une marque protégée." />
                         <CheckBox revere={true} id="FormulaireBenefiting" label="Propriétaire d’une marque bénéficiant d’une date de priorité antérieure." />
                         <CheckBox revere={true} id="FormulairePrior" label="Propriétaire d’une marque antérieure notoirement connue." />
                         <CheckBox revere={true} id="FormulaireExclusive" label="Bénéficiaire d’une licence exclusive d’exploitation." />
                         <CheckBox revere={true} id="FormulairePreviously" label="Titulaire d’une indication géographique ou appellation d’origine protégée ou antérieurement déposée." />
                    </div>
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-x-9 mt-9">
                         <div>
                              <InputField id="FormulaireTrademarkNumPrev" label="Numéro de dépot de la marque anterieure" type="text" placeholder="Numero" required={true} />
                              <SelectionField dataArray={nature} id="FormulaireTrademarkNumPrevSelection" label="Nature de la marque" />
                         </div>
                         <div>
                              <InputField id="FormulaireTrademarkNumDisp" label="Numéro de dépot de la marque contester" type="text" placeholder="Numero" required={true} />
                              <SelectionField dataArray={nature} id="FormulaireTrademarkNumDispSelection" label="Nature de la marque" />
                         </div>
                    </div>
                    <div className="flex flex-wrap md:gap-4 gap-2">
                         <Button type={"submit"} name={"FormulaireAddForm"}>Ajouter le formulaire</Button>
                         <Button type={"button"} name={"FormulaireViewForm"} bg={true}>Voir les formulaires</Button>
                    </div>
               </form>
          </section>
     )
}