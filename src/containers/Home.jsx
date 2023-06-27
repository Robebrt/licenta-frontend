import React from "react";
import '../style/home.css';
import backgroundImage from '../../public/background.jpg';
const Home = () => {
    return (
        <div className="home-container">
            <div className="background">
                <img src={backgroundImage} alt="Background" className="background-image" />
            </div>
            <div className="content">
                <h2 className="header2">Bun venit pe CineVerse!</h2>
                <p className="paragraph">Această aplicație vă permite să țineți evidența emisiunilor și filmelor din Top 250 IMDb.</p>
                <p className="paragraph">Puteți căuta și vizualiza informații detaliate despre fiecare titlu, salva preferințele și vizionările, și multe altele.</p>
                <p className="paragraph">Începeți să explorați și să descoperiți cele mai bune filme și emisiuni ale tuturor timpurilor!</p>
            </div>
        </div>
    );
}
export default Home;