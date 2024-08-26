import { useState } from "react";
import PageTitle from "../components/Titles/pageTitle";
import firstImg from "../assets/brand/Adidas.png";
import secondImg from "../assets/brand/pepsi.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button/button";


export default function CompareCompany() {
     const [show1st, setShow1st] = useState(false);
     const [show2nd, setShow2nd] = useState(false);
     const [show3rd, setShow3rd] = useState(false);
     const [show4th, setShow4th] = useState(false);
     const [result1st, setResult1st] = useState(false);
     const [result2nd, setResult2nd] = useState(false);

     return (<>
          <PageTitle classes={'flex flex-wrap justify-between item-center'}><span>Comparer l'entreprise</span> <Button classes={'text-xs'}>Telecharger</Button></PageTitle>
          <section className="grid lg:grid-cols-2 grid-cols-1 gap-x-6">
               <div className="bg-white py-10 px-8 shadow-lg rounded-md mb-16 h-fit">
                    <h3 className="text-base capitalize font-semibold text-slate mb-2">Marque contester</h3>
                    <div className="flex flex-wrap gap-4 my-4">
                         <div className="max-w-40"><img src={firstImg} alt="" /></div>
                         <div className="flex-grow w-0 space-y-3 my-auto">
                              <p className="font-medium">Desposant: <span className="font-normal">GCL GROUP AFRICA</span></p>
                              <p className="font-medium">Date Depot: <span className="font-normal">10/11/2020</span></p>
                              <p className="font-medium">Date Expiration: <span className="font-normal">10/11/2020</span></p>
                              <p className="font-medium">Classe Nice: <span className="font-normal">35, 39, 42</span></p>
                         </div>
                    </div>
                    <div>
                         <button onClick={() => setShow1st(!show1st)} className="relative w-full pb-1 mb-3 font-medium border-b border-sky/30">
                              Produits et services
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span>
                         </button>
                         <p className={`${show1st ? 'opacity-100, visible h-full' : 'opacity-0 invisible h-0'} sl-animated-md`}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est magnam cupiditate quam temporibus natus dolore rerum placeat eos ullam! Pariatur ut expedita accusantium voluptate distinctio! Nihil commodi saepe sequi. Culpa.</p>
                    </div>
               </div>
               <div className="bg-white py-10 px-8 shadow-lg rounded-md mb-16 h-fit">
                    <h3 className="text-base capitalize font-semibold text-slate mb-2">Marque contester</h3>
                    <div className="flex flex-wrap gap-4 my-4">
                         <div className="max-w-40"><img src={secondImg} alt="" /></div>
                         <div className="flex-grow w-0 space-y-3 my-auto">
                              <p className="font-medium">Desposant: <span className="font-normal">GCL GROUP AFRICA</span></p>
                              <p className="font-medium">Date Depot: <span className="font-normal">10/11/2020</span></p>
                              <p className="font-medium">Date Expiration: <span className="font-normal">10/11/2020</span></p>
                              <p className="font-medium">Classe Nice: <span className="font-normal">35, 39, 42</span></p>
                         </div>
                    </div>
                    <div>
                         <button onClick={() => setShow2nd(!show2nd)} className="relative w-full pb-1 mb-3 font-medium border-b border-sky/30">
                         Produits et services
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5"><FontAwesomeIcon icon={faSortDown} /></span>
                         </button>
                         <p className={`${show2nd ? 'opacity-100, visible h-full' : 'opacity-0 invisible h-0'} sl-animated-md`}>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Est magnam cupiditate quam temporibus natus dolore rerum placeat eos ullam! Pariatur ut expedita accusantium voluptate distinctio! Nihil commodi saepe sequi. Culpa.</p>
                    </div>
               </div>
          </section>
          <section className="bg-white py-10 px-8 shadow-lg rounded-md mb-16">
               <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate">Comparaison produits et services</h3>
                    <Button onClick={() => setShow3rd(!show3rd)}>{show3rd ? 'Masquer' : 'Afficher'}</Button>
               </div>
               <div className={`grid lg:grid-cols-2 grid-cols-1 gap-x-6 overflow-hidden sl-animated-md ${show3rd ? 'opacity-100 visible h-full' : 'opacity-0 invisible h-0'}`}>
                    <div>
                         <h4 className="font-medium uppercase mb-1">Prompt:</h4>
                         <p className="border border-sky/30 rounded-md p-4 max-h-60 overflow-y-auto mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, architecto eum quidem delectus dolorem totam saepe impedit nemo et laborum ducimus veritatis unde vel consectetur enim voluptatibus. Dolorem natus soluta corrupti, assumenda tempore veniam eaque rerum porro magnam animi voluptatum doloremque maiores ipsam placeat sint? Similique, magni nisi dolore, officiis nulla blanditiis esse cumque quisquam totam natus minus minima saepe hic a, dolorem quis eligendi quod ea! Dolores laborum qui vel? Ullam, neque in. Sapiente, fuga? Magni, nihil. Ipsum sapiente vel laudantium voluptate a voluptas consequuntur dolore nulla harum fugit, illum minus sunt, sit autem non quas id ratione, magni rem possimus voluptatum aliquam excepturi doloribus reprehenderit. Corporis odio reiciendis ab sequi, nostrum accusantium aliquid nulla eveniet? Quis rem debitis impedit nisi maiores tempora provident? Dolores repudiandae, excepturi molestias blanditiis modi quaerat autem magnam soluta temporibus saepe. Unde ex eaque, dolorem praesentium ipsum quidem, exercitationem tenetur illo quis porro cupiditate.</p>
                         <Button onClick={() => setResult1st(true)} bg={true}>AI generation</Button>
                    </div>
                    {result1st && <div>
                         <h4 className="font-medium uppercase mb-1">Result:</h4>
                         <p className="border border-sky/30 rounded-md p-4 max-h-60 overflow-y-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, architecto eum quidem delectus dolorem totam saepe impedit nemo et laborum ducimus veritatis unde vel consectetur enim voluptatibus. Dolorem natus soluta corrupti, assumenda tempore veniam eaque rerum porro magnam animi voluptatum doloremque maiores ipsam placeat sint? Similique, magni nisi dolore, officiis nulla blanditiis esse cumque quisquam totam natus minus minima saepe hic a, dolorem quis eligendi quod ea! Dolores laborum qui vel? Ullam, neque in. Sapiente, fuga? Magni, nihil. Ipsum sapiente vel laudantium voluptate a voluptas consequuntur dolore nulla harum fugit, illum minus sunt, sit autem non quas id ratione, magni rem possimus voluptatum aliquam excepturi doloribus reprehenderit. Corporis odio reiciendis ab sequi, nostrum accusantium aliquid nulla eveniet? Quis rem debitis impedit nisi maiores tempora provident? Dolores repudiandae, excepturi molestias blanditiis modi quaerat autem magnam soluta temporibus saepe. Unde ex eaque, dolorem praesentium ipsum quidem, exercitationem tenetur illo quis porro cupiditate.</p>
                    </div>}
               </div>
          </section>
          <section className="bg-white py-10 px-8 shadow-lg rounded-md">
               <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate">Comparaison des signes</h3>
                    <Button onClick={() => setShow4th(!show4th)}>{show4th ? 'Masquer' : 'Afficher'}</Button>
               </div>
               <div className={`grid lg:grid-cols-2 grid-cols-1 gap-x-6 overflow-hidden sl-animated-md ${show4th ? 'opacity-100 visible h-full' : 'opacity-0 invisible h-0'}`}>
                    <div>
                         <h4 className="font-medium uppercase mb-1">Prompt:</h4>
                         <p className="border border-sky/30 rounded-md p-4 max-h-60 overflow-y-auto mb-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, architecto eum quidem delectus dolorem totam saepe impedit nemo et laborum ducimus veritatis unde vel consectetur enim voluptatibus. Dolorem natus soluta corrupti, assumenda tempore veniam eaque rerum porro magnam animi voluptatum doloremque maiores ipsam placeat sint? Similique, magni nisi dolore, officiis nulla blanditiis esse cumque quisquam totam natus minus minima saepe hic a, dolorem quis eligendi quod ea! Dolores laborum qui vel? Ullam, neque in. Sapiente, fuga? Magni, nihil. Ipsum sapiente vel laudantium voluptate a voluptas consequuntur dolore nulla harum fugit, illum minus sunt, sit autem non quas id ratione, magni rem possimus voluptatum aliquam excepturi doloribus reprehenderit. Corporis odio reiciendis ab sequi, nostrum accusantium aliquid nulla eveniet? Quis rem debitis impedit nisi maiores tempora provident? Dolores repudiandae, excepturi molestias blanditiis modi quaerat autem magnam soluta temporibus saepe. Unde ex eaque, dolorem praesentium ipsum quidem, exercitationem tenetur illo quis porro cupiditate.</p>
                         <Button onClick={() => setResult2nd(true)} bg={true}>AI generation</Button>
                    </div>
                    {result2nd && <div>
                         <h4 className="font-medium uppercase mb-1">Result:</h4>
                         <p className="border border-sky/30 rounded-md p-4 max-h-60 overflow-y-auto">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate, architecto eum quidem delectus dolorem totam saepe impedit nemo et laborum ducimus veritatis unde vel consectetur enim voluptatibus. Dolorem natus soluta corrupti, assumenda tempore veniam eaque rerum porro magnam animi voluptatum doloremque maiores ipsam placeat sint? Similique, magni nisi dolore, officiis nulla blanditiis esse cumque quisquam totam natus minus minima saepe hic a, dolorem quis eligendi quod ea! Dolores laborum qui vel? Ullam, neque in. Sapiente, fuga? Magni, nihil. Ipsum sapiente vel laudantium voluptate a voluptas consequuntur dolore nulla harum fugit, illum minus sunt, sit autem non quas id ratione, magni rem possimus voluptatum aliquam excepturi doloribus reprehenderit. Corporis odio reiciendis ab sequi, nostrum accusantium aliquid nulla eveniet? Quis rem debitis impedit nisi maiores tempora provident? Dolores repudiandae, excepturi molestias blanditiis modi quaerat autem magnam soluta temporibus saepe. Unde ex eaque, dolorem praesentium ipsum quidem, exercitationem tenetur illo quis porro cupiditate.</p>
                    </div>}
               </div>
          </section>
     </>)
}