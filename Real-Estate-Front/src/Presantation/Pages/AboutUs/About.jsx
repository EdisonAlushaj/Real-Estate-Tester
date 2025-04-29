import coverImg from '../../../../public/image/p2.png';
import { NavLink } from "react-router-dom";
import image from '../../../../public/image/p2.png'
import certificate1 from '../../../../public/image/p5.png'
import certificate2 from '../../../../public/image/p6.png'
import certificate3 from '../../../../public/image/p7.png'
import './About.css';

function About() {
    return (
        <>
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ zIndex: '1', position: 'relative', backgroundColor: '' }}>
                <div className='position-relative' style={{ width: '100%', height: '20em' }}>
                    {/* Triangle overlay */}
                    <div className="triangle-overlay" style={{}}></div>

                    <div className="title position-absolute text-start" style={{}}>
                        <h1 style={{}}>Rreth Nesh</h1>
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

            <div className='about-txt justify-content-center align-items-center' style={{}}>
                <div className='about-txt-1 d-flex flex-column justify-content-center align-items-center' style={{}}>
                    <h1>Historia Jonë</h1>

                    <p style={{}}>Grande Real Estate është një kompani e suksesshme dhe me reputacion në sektorin e pasurive të paluajtshme, e vendosur në zemër të Kosovës. Me vite përvoje dhe përkushtim ndaj ekselencës, ne jemi këtu për t’ju ndihmuar të gjeni pronën e ëndrrave, të realizoni investimet më të mira dhe të arrini sukses afatgjatë në treg.</p>

                    <p style={{}}>Çfarë ofrojmë?

                        Shërbime të Personalizuara: Secili klient është unik, dhe ne ofrojmë zgjidhje të përshtatura për t’u përmbushur nevojat dhe objektivat tuaja specifike.
                        Ekspertizë Lokale dhe Globale: Me një njohuri të thelluar të tregut vendas dhe ndërkombëtar, ju ndihmojmë të bëni zgjedhjet e duhura.
                        Mbështetje Gjithëpërfshirëse: Nga kërkimi i pronës së duhur e deri te finalizimi i transaksionit, ekipi ynë qëndron pranë jush në çdo hap.
                        Rezultate të Dëshmuara: Historia jonë e suksesit përfshin qindra klientë të kënaqur që kanë gjetur pronat ideale dhe kanë arritur objektivat e tyre investuese.</p>

                    <p style={{}}>Grande Real Estate është partneri juaj i besueshëm për prona rezidenciale, komerciale dhe investime strategjike. Na besoni për t'ju ndihmuar të ndërtoni të ardhmen tuaj mbi baza të sigurta dhe të qëndrueshme.</p>
                </div>

                <div className='about-img d-flex flex-column justify-content-center' style={{}} >
                    <img src={image} alt="" style={{}} />
                </div>
            </div>

            <div className='certificat d-flex flex-column justify-content-center align-items-center gap-5' style={{}} >
                <h1>Certifikata të Arritjes</h1>

                <div className='certificat-img d-flex justify-content-center align-items-center gap-5' style={{}} >
                    <img src={certificate1} alt="Certifikata 1" style={{}} />
                    <img src={certificate2} alt="Certifikata 2" style={{}} />
                    <img src={certificate3} alt="Certifikata 3" style={{}} />
                </div>
            </div>
        </>
    );
}

export default About