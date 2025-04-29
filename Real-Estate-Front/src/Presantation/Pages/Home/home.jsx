import coverImg from '../../../../public/image/p1.png';
import coverImg2 from '../../../../public/image/cover5.jpg';
import bottomCover from '../../../../public/image/p4.png';
import { NavLink } from "react-router-dom";
import partner1 from '../../../../public/Partneret/Albaelktrika.png'
import partner2 from '../../../../public/Partneret/alxedrix-logo.png'
import partner3 from '../../../../public/Partneret/ASGETO.png'
import partner4 from '../../../../public/Partneret/bechtel-enka-logo.png'
import partner5 from '../../../../public/Partneret/emona.jpg'
import partner6 from '../../../../public/Partneret/Jusaj.png'
import partner7 from '../../../../public/Partneret/siemens-logo-big.png'
import icon1 from '../../../../public/image/p2.png';
import icon2 from '../../../../public/Icon/insurance-policy_12477023.png'
import icon3 from '../../../../public/Icon/insurance-policy_12477023.png'
import icon4 from '../../../../public/Icon/banking-service_15546762.png'
import icon5 from '../../../../public/Icon/package_969259.png'
import './Home.css'

function Home() {
    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center home-container" style={{ zIndex: '1', position: 'relative', backgroundColor: '' }}>
                <div className='cover position-relative' style={{ width: '100%', height: '40em' }}>
                    {/* Triangle overlay */}
                    <div className="triangle-overlay-1" style={{}}></div>

                    <div className="cover-text-1 position-absolute text-start" style={{}}>
                        <h1 style={{}}>Grande</h1>
                        <h4 style={{}}>Real Estate</h4>
                        <h4 style={{}}>International Real Estate</h4>
                        <p style={{}}>Kompani e suksesshme në logjistikë dhe transport mallrash me një ekip të përkushtuar dhe një rrjet të gjerë, ne sigurohemi që çdo ngarkesë të arrijë në destinacionin e saj me siguri dhe në kohë.</p>
                        <NavLink to="/app/about" style={{ color: '#19282F', textDecoration: 'none' }}>
                            <button style={{ padding: '0.5em 1em', backgroundColor: '#ffbb27', color: '#19282F', border: 'none', borderRadius: '5px' }}>LEXONI MË SHUMË</button>
                        </NavLink>
                    </div>
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <img src={coverImg} alt="Cover Image" className="img-fluid w-100" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(211, 236, 167, 0.3)', // #D3ECA7 with 40% opacity
                            zIndex: 1
                        }}></div>
                    </div>
                </div>
            </div>

            <div className='home-text d-flex flex-column justify-content-center align-items-center' style={{}}>
                <h1>Fuqizojmë Biznesin Tuaj</h1>
                <p style={{ fontSize: '1.1em', marginBlock: '' }}><b>Suksesi Ndërmjet Çdo Hapi Përpara</b></p>
                <p id='home-p' style={{}}>Zgjidhjet tona shtyjnë biznesin tuaj përpara, duke ju mbajtur konkurrues në një treg që ndryshon vazhdimisht. Ne ofrojmë shërbime inovative dhe të besueshme që përputhen me objektivat tuaja. Suksesi juaj është prioriteti ynë.</p>
            </div>

            <div className='about-text w-100 justify-content-center align-items-center' style={{}}>
                <div className='at-1 d-flex flex-column justify-content-center align-items-center'>
                    <div className='at-2 d-flex flex-column justify-content-center ' style={{}}>
                        <h1>Pse Të Na Zgjidhni</h1>

    

                        <div className='d-flex flex-column justify-content-center align-items-start w-100'>
                            <p>Përvojë dhe Ekspertizë: Me vite përvoje në tregun e pasurive të paluajtshme, ekipi ynë zotëron njohuri të thelluara dhe aftësi për t’ju ofruar zgjidhjet më të mira të përshtatura për nevojat tuaja.

                                Shërbim i Personalizuar: Çdo klient është unik, dhe ne e kuptojmë këtë. Prandaj, ofrojmë zgjidhje të personalizuara për të përmbushur qëllimet dhe pritshmëritë tuaja specifike.

                                Besueshmëri dhe Integritet: Ne ndërtojmë marrëdhënie të bazuara në besim dhe ndershmëri. Ju mund të mbështeteni te ne për një proces të qartë dhe të drejtë në çdo hap.

                                Rezultate të Dëshmuara: Kemi ndihmuar qindra klientë të gjejnë pronën ideale, të përfitojnë nga investimet e tyre dhe të përmbushin objektivat e tyre në mënyrë efektive.

                                Mbështetje Gjithëpërfshirëse: Nga këshillimi fillestar e deri te mbyllja e transaksionit, jemi pranë jush për të ofruar ndihmë dhe udhëzime në çdo fazë të procesit.

                                Përkushtim ndaj Ekselencës: Ne përpiqemi të tejkalojmë pritshmëritë tuaja dhe të ofrojmë shërbime që nuk janë vetëm të kënaqshme, por të jashtëzakonshme.

                                Zgjedhja jonë nuk është vetëm një hap drejt një pronë; është një partneritet që siguron suksesin dhe kënaqësinë tuaj afatgjatë. Na zgjidhni dhe përjetoni dallimin që sjellin profesionalizmi dhe përkushtimi ynë!</p>
                        </div>
                    </div>
                </div>

                <div className='at-3 d-flex flex-column justify-content-center align-items-center'>
                    <img src={icon1} alt="" style={{}} />
                </div>
            </div>

            <div className='about-text w-100 justify-content-center align-items-center' style={{}}>
                <div className='at-4 d-flex flex-column justify-content-center align-items-center'>
                    <img src={coverImg} alt="" style={{}} />
                </div>

                <div className='at-5 d-flex flex-column justify-content-center align-items-end'>
                    <div className='d-flex flex-column justify-content-center gap-4' style={{}}>
                        <h1>Ne ju ndihmojmë të bëni...</h1>

                        <p style={{}}>

                            Qoftë për të gjetur pronën e përsosur, për të siguruar një proces transaksioni efikas, apo për të naviguar nëpër sfidat e tregut të pasurive të paluajtshme, ne jemi këtu për të mbështetur ju në çdo hap të rrugës. Me vite përvoje dhe përkushtim ndaj ekselencës, ekipi ynë është i dedikuar për të ofruar zgjidhje që përmbushin nevojat tuaja specifike.</p>

                        <p style={{}}>Duke u kujdesur për çdo detaj dhe duke siguruar rezultate të shkëlqyera, ne përqendrohemi në ofrimin e shërbimeve të besueshme dhe të personalizuara që nxisin suksesin tuaj. Na besoni për të menaxhuar kërkesat tuaja në fushën e pasurive të paluajtshme me saktësi, në mënyrë që ju të mund të fokusoheni në atë që ka më shumë rëndësi—krijimin e një të ardhmeje të suksesshme dhe të qëndrueshme.</p>
                    </div>
                </div>
            </div>

            <div className='d-flex justify-content-center align-items-center w-100' style={{ height: '25em', marginTop: '3em' }}>
                <img src={bottomCover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div className='partners d-flex flex-column justify-content-center align-items-center gap-4' style={{}}>
                <p style={{ fontSize: '3em' }}>Partnerët Tanë</p>

                <div className='d-flex justify-content-center align-items-center gap-4' style={{ flexWrap: 'wrap', width: '90%' }}>
                    <img src={partner1} alt="" style={{ width: '9em', objectFit: 'contain' }} />
                    <img src={partner2} alt="" style={{ width: '9em', objectFit: 'contain' }} />
                    <img src={partner3} alt="" style={{ width: '9em', objectFit: 'contain' }} />
                    <img src={partner4} alt="" style={{ width: '9em', objectFit: 'contain' }} />
                    <img src={partner5} alt="" style={{ width: '9em', objectFit: 'contain' }} />
                    <img src={partner6} alt="" style={{ width: '9em', objectFit: 'contain' }} />
                    <img src={partner7} alt="" style={{ width: '9em', objectFit: 'contain' }} />
                </div>
            </div>
        </>
    );
}

export default Home