import React from 'react';
import { Target, Eye, Gem, Building2, BedDouble, Star, Calendar } from 'lucide-react';

const HomeContent = () => {
  return (
      <div className="content-section">
        <div className="welcome-section">
          <h1 className="welcome-title">Bienvenidos a la Cadena de Hoteles Collection Royal</h1>
          <p className="welcome-description">
            Administre su experiencia hotelera con facilidad y elegancia a través de nuestro sistema exclusivo.
          </p>
        </div>

        <div className="company-cards">
          <div className="company-card">
            <div className="card-icon">
              <Target size={48} strokeWidth={1.5} />
            </div>
            <h2 className="card-title">Misión</h2>
            <p className="card-description">
              Brindar experiencias únicas de hospitalidad que superen las expectativas de nuestros huéspedes,
              combinando elegancia, confort y servicio excepcional en cada uno de nuestros hoteles.
            </p>
          </div>

          <div className="company-card">
            <div className="card-icon">
              <Eye size={48} strokeWidth={1.5} />
            </div>
            <h2 className="card-title">Visión</h2>
            <p className="card-description">
              Ser reconocidos como la cadena hotelera líder en excelencia y distinción,
              estableciendo nuevos estándares de lujo y hospitalidad en la industria a nivel mundial.
            </p>
          </div>

          <div className="company-card">
            <div className="card-icon">
              <Gem size={48} strokeWidth={1.5} />
            </div>
            <h2 className="card-title">Valores</h2>
            <ul className="values-list">
              <li>Excelencia en servicio</li>
              <li>Compromiso con la calidad</li>
              <li>Respeto y atención personalizada</li>
              <li>Innovación constante</li>
              <li>Responsabilidad social</li>
            </ul>
          </div>
        </div>

        <div className="stats-summary">
          <div className="stat-box">
            <Building2 size={32} className="stat-icon" strokeWidth={1.5} />
            <h3 className="stat-number">3</h3>
            <p className="stat-label">Hoteles de Lujo</p>
          </div>
          <div className="stat-box">
            <BedDouble size={32} className="stat-icon" strokeWidth={1.5} />
            <h3 className="stat-number">50+</h3>
            <p className="stat-label">Habitaciones</p>
          </div>
          <div className="stat-box">
            <Star size={32} className="stat-icon" strokeWidth={1.5} />
            <h3 className="stat-number">98%</h3>
            <p className="stat-label">Satisfacción</p>
          </div>
          <div className="stat-box">
            <Calendar size={32} className="stat-icon" strokeWidth={1.5} />
            <h3 className="stat-number">25+</h3>
            <p className="stat-label">Años de Experiencia</p>
          </div>
        </div>
      </div>
  );
};

export default HomeContent;