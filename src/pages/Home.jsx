import Realisations from "../components/Realisations.jsx";
import { useEffect, useState } from "react";

function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effet parallax pour la colonne de droite
  useEffect(() => {
    const rightColumn = document.querySelector(".right-column");
    if (rightColumn) {
      const handleParallax = () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        rightColumn.style.backgroundPosition = `0 ${rate}px`;
      };

      window.addEventListener("scroll", handleParallax);
      return () => window.removeEventListener("scroll", handleParallax);
    }
  }, []);
  return (
    <div className="main-container">
      {/* Colonne gauche - Informations de contact */}
      <div
        className="left-column"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div
          className="modern-card"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <h1
            style={{
              fontSize: "3.5rem",
              marginBottom: "1rem",
              color: "#2C2C2C",
              whiteSpace: "nowrap",
            }}
          >
            NIDDOO SAS
          </h1>
          <h2
            style={{
              fontSize: "1.75rem",
              marginBottom: "2rem",
              color: "#2C2C2C",
              fontWeight: "400",
            }}
          >
            Construction / Rénovation <br/> Eco-responsable
          </h2>

          <div style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "1.4rem",
                marginBottom: "1rem",
                color: "#2C2C2C",
              }}
            >
              CONTACT
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <img
                src="/assets/images/icone adresse.png"
                width={34}
                style={{ marginRight: "12px" }}
              />
              <div
                style={{
                  color: "#2C2C2C",
                  fontWeight: "500",
                  fontSize: "1.05rem",
                }}
              >
                <div>52 bld de Sébastopol</div>
                <div>75003 Paris</div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <img
                src="/assets/images/icone mail.png"
                width={34}
                style={{ marginRight: "12px" }}
              />
              <a
                href="mailto:niddoo.immobilier@gmail.com"
                style={{
                  color: "#2C2C2C",
                  textDecoration: "none",
                  fontSize: "1.05rem",
                }}
              >
                niddoo.immobilier@gmail.com
              </a>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/assets/images/icone telephone.png"
                width={34}
                style={{ marginRight: "12px" }}
              />
              <a
                href="tel:+33614319648"
                style={{
                  color: "#2C2C2C",
                  textDecoration: "none",
                  fontSize: "1.05rem",
                }}
              >
                06 14 31 96 48
              </a>
            </div>
          </div>

          <div
            style={{ fontSize: "1rem", color: "#2C2C2C", lineHeight: "1.4" }}
          >
            <div style={{ marginBottom: "0.5rem" }}>901 892 869 RCS Paris</div>
            <div>© Copyright Niddoo</div>
            <div>All rights reserved</div>
          </div>
        </div>
      </div>

      {/* Colonne droite - Contenu principal */}
      <div className="right-column">
        <div className="modern-card">
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: "1.6",
              marginBottom: "2rem",
              fontStyle: "italic",
              textAlign: "justify",
            }}
          >
            Bienvenue chez Niddoo, <br/> Spécialistes de la
            rénovation éco-responsable, nous offrons une expertise complète avec
            maîtrise d'œuvre, plans d'architecte, garanties constructions et une
            assistance à la vente. Avec Niddoo, transformez votre espace en un
            nid tout doux, alliant confort et durabilité !
          </p>
        </div>

        <div
          id="activites"
          style={{
            width: "100%",
            paddingTop: "20px",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {/* Section Rénovation */}
          <div className="activity-section">
            <div
              className="modern-card"
              style={{
                textAlign: "center",
                backgroundColor: "#807c73",
                color: "white",
              }}
            >
              <img
                src="/assets/images/icone construction.png"
                width={85}
                style={{ marginBottom: "20px" }}
              />
              <h2
                style={{
                  fontSize: "1.6rem",
                  marginBottom: "15px",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                RENOVATION
              </h2>
              <ul
                style={{
                  textAlign: "left",
                  padding: "0",
                  margin: "0",
                  listStyle: "none",
                }}
              >
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "white",
                  }}
                >
                  • Rénovation totale
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "white",
                  }}
                >
                  • Rénovation partiellle
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "white",
                  }}
                >
                  • Surélévation
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "white",
                  }}
                >
                  • Extention
                </li>
              </ul>
            </div>
          </div>

          {/* Section Maîtrise d'Oeuvre */}
          <div className="activity-section">
            <div
              className="modern-card"
              style={{
                textAlign: "center",
                backgroundColor: "white",
                color: "#2C2C2C",
              }}
            >
              <img
                src="/assets/images/icone moe.png"
                width={85}
                style={{ marginBottom: "20px" }}
              />
              <h2
                style={{
                  fontSize: "1.6rem",
                  marginBottom: "15px",
                  color: "#2C2C2C",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
              }}
              >
                MAITRISE D'OEUVRE
              </h2>
              <ul
                style={{
                  textAlign: "left",
                  padding: "0",
                  margin: "0",
                  listStyle: "none",
                }}
              >
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "#2C2C2C",
                  }}
                >
                  • Conception
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "#2C2C2C",
                  }}
                >
                  • Exécution
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "#2C2C2C",
                  }}
                >
                  • Plan d'architecte 3D
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "#2C2C2C",
                  }}
                >
                  • Coordination des travaux
                </li>
              </ul>
            </div>
          </div>

          {/* Section Aide à la Vente */}
          <div className="activity-section">
            <div
              className="modern-card"
              style={{
                textAlign: "center",
                backgroundColor: "#807c73",
                color: "white",
              }}
            >
              <img
                src="/assets/images/icone 360.png"
                width={85}
                style={{ marginBottom: "20px" }}
              />
              <h2
                style={{
                  fontSize: "1.6rem",
                  marginBottom: "15px",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                AIDE A LA VENTE
              </h2>
              <ul
                style={{
                  textAlign: "left",
                  padding: "0",
                  margin: "0",
                  listStyle: "none",
                }}
              >
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "white",
                  }}
                >
                  • Home-staging
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "white",
                  }}
                >
                  • Photographie 2D
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "white",
                  }}
                >
                  • Vidéo 360°
                </li>
                <li
                  style={{
                    marginBottom: "6px",
                    fontSize: "1.15rem",
                    color: "white",
                  }}
                >
                  • Entretien et maintenance
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "40px", textAlign: "center" }}>
          <h1 className="section-title">NOS RÉALISATIONS</h1>
          <div
            style={{
              width: "85px",
              height: "3px",
              backgroundColor: "#5C5C5C",
              margin: "20px auto 40px auto",
              borderRadius: "8px",
            }}
          ></div>
        </div>

        <Realisations />

        <div
          className="modern-card footer-card"
          style={{ marginTop: 20, backgroundColor: "#807c73", color: "white" }}
        >
          <div className="footer-card__header">
            <div>
              <div
                style={{
                  fontSize: "3rem",
                  fontWeight: "bold",
                  marginBottom: "0.3rem",
                  lineHeight: "1.1",
                  color: "white",
                }}
              >
                NIDDOO SAS
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "400",
                  color: "white",
                  marginBottom: "0",
                }}
              >
                Construction / Rénovation Eco-responsable
              </div>
            </div>
          </div>
          <div className="footer-card__row">
            <img src="/assets/images/icone adresse.png" width={34} />
            <div style={{ color: "white" }}>
              52 bld de Sébastopol
              <br />
              75003 Paris
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
              marginBottom: "0px",
            }}
          >
            <div
              className="footer-card__row"
              style={{ marginBottom: 0, flex: "1 1 auto" }}
            >
              <img src="/assets/images/icone mail.png" width={34} />
              <a
                href="mailto:niddoo.immobilier@gmail.com"
                style={{ color: "white" }}
              >
                niddoo.immobilier@gmail.com
              </a>
            </div>
            <div
              className="footer-card__row"
              style={{ marginBottom: 0, flex: "1 1 auto" }}
            >
              <img src="/assets/images/icone telephone.png" width={34} />
              <a href="tel:+33614319648" style={{ color: "white" }}>
                06 14 31 96 48
              </a>
            </div>
          </div>
          <div className="footer-card__legal" style={{ color: "white" }}>
            <div id="rcs_num">901 892 869 RCS Paris</div>
            <div>© Copyright Niddoo — All rights reserved</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
