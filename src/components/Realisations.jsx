import { useEffect, useState, useRef } from "react";
import { IconButton, Chip } from "@mui/material";

// Cette version front-only suppose que les images se trouvent dans public/assets/images/realisation_XX/
// et que chaque dossier contient: Ap_01.jpg ... Ap_N.jpg et éventuellement Av_01.jpg ... Av_N.jpg
// ainsi qu'un fichier titre.html chargé via fetch relative URL.

const MAX_REALISATIONS = 50;

function imageExists(url) {
  // Détection fiable côté navigateur: charge une image et résout true/false
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url + `?t=${Date.now()}`; // éviter cache pendant dev
  });
}

async function detectRealisations() {
  const found = [];
  for (let i = 1; i <= MAX_REALISATIONS; i++) {
    const folderIdx = String(i).padStart(2, "0");
    const testUrl = `/assets/images/realisation_${folderIdx}/Ap_01.jpg`;
    const ok = await imageExists(testUrl);
    if (!ok) break;

    // Compte les Ap_XX.jpg
    let count = 1;
    while (
      await imageExists(
        `/assets/images/realisation_${folderIdx}/Ap_${String(count).padStart(
          2,
          "0"
        )}.jpg`
      )
    ) {
      count++;
      if (count > 200) break;
    }
    count--;

    found.push({ index: i, folder: folderIdx, count });
  }
  return found;
}

function useRealisations() {
  const [realisations, setRealisations] = useState([]);
  useEffect(() => {
    let cancelled = false;
    detectRealisations().then((list) => {
      if (!cancelled) setRealisations(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);
  return realisations;
}

function RealisationBandeau({
  folder,
  count,
  index,
  activeZoom,
  setActiveZoom,
}) {
  const [position, setPosition] = useState(1);
  const [ratioAv, setRatioAv] = useState({});
  const [titreHtml, setTitreHtml] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // États pour la mosaïque
  const [showAp, setShowAp] = useState(true);
  const zoomMode = activeZoom === folder;

  useEffect(() => {
    fetch(`/assets/images/realisation_${folder}/titre.html`).then(async (r) => {
      setTitreHtml(r.ok ? await r.text() : "");
    });
  }, [folder]);

  // Suivi de la largeur d'écran (mobile <= 480px)
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 480);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Nettoyage du scroll lors du démontage du composant
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    async function loadRatios() {
      const ratiosAv = {};
      for (let j = 1; j <= count; j++) {
        const jj = String(j).padStart(2, "0");
        const imgAv = new Image();
        imgAv.src = `/assets/images/realisation_${folder}/Av_${jj}.jpg`;
        await new Promise((res) => {
          imgAv.onload = res;
          imgAv.onerror = res;
        });
        if (imgAv.naturalWidth && imgAv.naturalHeight)
          ratiosAv[j] = imgAv.naturalWidth / imgAv.naturalHeight;
        else ratiosAv[j] = 0;
      }
      setRatioAv(ratiosAv);
    }
    loadRatios();
  }, [folder, count]);

  const j = position;
  const jj = String(j).padStart(2, "0");
  const hasAv = (ratioAv[j] || 0) > 0;

  // Créer un tableau avec les images répétées pour la boucle infinie
  const extendedImages = [];
  // Ajouter toutes les images 3 fois pour permettre le défilement infini
  for (let i = 0; i < 3; i++) {
    for (let j = 1; j <= count; j++) {
      extendedImages.push(j);
    }
  }

  // Calculer l'offset réel pour le défilement (on commence au milieu du tableau)
  const scrollOffset = count + startIndex;

  // Gérer le repositionnement après la transition
  const handleTransitionEnd = () => {
    // Si on s'est trop éloigné du centre, repositionner sans animation
    if (startIndex >= count || startIndex <= -count) {
      setIsTransitioning(false);
      // Repositionner au milieu (modulo pour rester dans la première série)
      setStartIndex((prev) => {
        const normalized = ((prev % count) + count) % count;
        return normalized;
      });
      // Réactiver la transition après un court délai
      setTimeout(() => setIsTransitioning(true), 50);
    }
  };

  // Fonctions pour le carrousel
  const scrollLeft = () => {
    setStartIndex((prev) => prev - 1);
  };

  const scrollRight = () => {
    setStartIndex((prev) => prev + 1);
  };

  // Fonctions de zoom adaptées du JavaScript original
  function openZoom() {
    setActiveZoom(folder);
    setShowAp(true);
    // Désactiver le scroll du body en mode zoom
    document.body.style.overflow = "hidden";
  }

  function closeZoom() {
    setActiveZoom(null);
    // Réactiver le scroll du body
    document.body.style.overflow = "auto";
  }

  function switchApAv() {
    setShowAp(!showAp);
  }

  function zoomNext() {
    setPosition((p) => (p < count ? p + 1 : 1));
    setShowAp(true);
  }

  function zoomPrev() {
    setPosition((p) => (p > 1 ? p - 1 : count));
    setShowAp(true);
  }

  if (zoomMode) {
    // Mode zoom - affichage centré sur la colonne de droite
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: isMobile ? 0 : "30%",
          right: isMobile ? 0 : "2.5%",
          width: isMobile ? "100vw" : "auto",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.9)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={closeZoom}
      >
        <div
          style={{
            position: "relative",
            maxWidth: isMobile ? "100vw" : "90%",
            maxHeight: isMobile ? "100vh" : "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image principale */}
          <img
            src={`/assets/images/realisation_${folder}/${
              showAp ? "Ap" : "Av"
            }_${jj}.jpg`}
            style={{
              maxWidth: isMobile ? "100vw" : "100%",
              maxHeight: isMobile ? "100vh" : "80vh",
              width: "auto",
              height: "auto",
              cursor: hasAv ? "pointer" : "auto",
              objectFit: "contain",
              display: "block",
            }}
            alt={`${showAp ? "Après" : "Avant"} ${index}-${jj}`}
            onClick={(e) => {
              if (hasAv) {
                e.stopPropagation();
                switchApAv();
              }
            }}
          />

          {/* Image secondaire (avant/après) */}
          {hasAv && (
            <img
              src={`/assets/images/realisation_${folder}/${
                showAp ? "Av" : "Ap"
              }_${jj}.jpg`}
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                maxWidth: "30%",
                maxHeight: "30%",
                cursor: "pointer",
              }}
              alt={`${showAp ? "Avant" : "Après"} ${index}-${jj}`}
              onClick={(e) => {
                e.stopPropagation();
                switchApAv();
              }}
            />
          )}

          {/* Boutons de contrôle */}
          <IconButton
            onClick={closeZoom}
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              backgroundColor: "rgba(255, 0, 0, 0.8)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 0, 0, 1)",
              },
              width: 45,
              height: 45,
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: "bold" }}>✕</span>
          </IconButton>

          {hasAv && (
            <IconButton
              onClick={switchApAv}
              sx={{
                position: "absolute",
                bottom: 20,
                right: 20,
                backgroundColor: "rgba(74, 101, 129, 0.8)",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(74, 101, 129, 1)",
                },
                width: 45,
                height: 45,
              }}
            >
              <span style={{ fontSize: "20px", fontWeight: "bold" }}>⇄</span>
            </IconButton>
          )}

          <IconButton
            onClick={zoomPrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 20,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(74, 101, 129, 0.8)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(74, 101, 129, 1)",
              },
              width: 50,
              height: 50,
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: "bold" }}>‹</span>
          </IconButton>

          <IconButton
            onClick={zoomNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 20,
              transform: "translateY(-50%)",
              backgroundColor: "rgba(74, 101, 129, 0.8)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(74, 101, 129, 1)",
              },
              width: 50,
              height: 50,
            }}
          >
            <span style={{ fontSize: "28px", fontWeight: "bold" }}>›</span>
          </IconButton>

          {/* Badges Après/Avant */}
          <Chip
            label="APRÈS"
            onClick={() => setShowAp(true)}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: showAp
                ? "rgba(74, 101, 129, 1)"
                : "rgba(74, 101, 129, 0.6)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(74, 101, 129, 1)",
              },
            }}
          />

          <Chip
            label="AVANT"
            onClick={() => setShowAp(false)}
            sx={{
              position: "absolute",
              bottom: 20,
              left: 20,
              backgroundColor: !showAp
                ? "rgba(200, 0, 0, 1)"
                : "rgba(200, 0, 0, 0.6)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "rgba(200, 0, 0, 1)",
              },
            }}
          />
        </div>
      </div>
    );
  }

  const ITEM_WIDTH = isMobile ? 227 : 311;
  const ITEM_HEIGHT = isMobile ? 284 : 397;
  const ITEM_GAP = 10;

  return (
    <div
      style={{
        marginBottom: 15,
        borderRadius: "20px",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      <table
        style={{
          width: "100%",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                width: "100%",
                color: "#fff",
                backgroundColor: "rgba(128, 124, 115, 0.8)",

                fontSize: isMobile ? 16 : 16,
                textTransform: "none",
              }}
              dangerouslySetInnerHTML={{ __html: titreHtml }}
            />
          </tr>
        </tbody>
      </table>

      {/* Carrousel horizontal avec flèches */}
      <div
        style={{
          position: "relative",
          padding: isMobile ? "10px 20px" : "10px 50px",
        }}
      >
        {/* Bouton gauche - toujours visible */}
        <IconButton
          onClick={scrollLeft}
          sx={{
            position: "absolute",
            left: 5,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "rgba(74, 101, 129, 0.8)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(74, 101, 129, 1)",
            },
            width: 50,
            height: 50,
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: "bold" }}>‹</span>
        </IconButton>

        {/* Conteneur avec overflow hidden */}
        <div
          style={{
            overflow: "hidden",
            width: "100%",
          }}
        >
          {/* Ligne d'images qui défile */}
          <div
            ref={containerRef}
            style={{
              display: "flex",
              gap: `${ITEM_GAP}px`,
              transition: isTransitioning ? "transform 0.3s ease" : "none",
              transform: `translateX(-${
                scrollOffset * (ITEM_WIDTH + ITEM_GAP)
              }px)`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {/* Afficher toutes les images répétées */}
            {extendedImages.map((photoNum, idx) => {
              const photoJJ = String(photoNum).padStart(2, "0");
              const hasAvPhoto = (ratioAv[photoNum] || 0) > 0;

              return (
                <div
                  key={`img-${idx}`}
                  style={{
                    position: "relative",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    flexShrink: 0,
                    borderRadius: "20px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-8px) scale(1.03)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0,0,0,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.2)";
                  }}
                  onClick={() => {
                    setPosition(photoNum);
                    openZoom();
                  }}
                >
                  <img
                    src={`/assets/images/realisation_${folder}/Ap_${photoJJ}.jpg`}
                    style={{
                      width: `${ITEM_WIDTH}px`,
                      height: `${ITEM_HEIGHT}px`,
                      objectFit: "cover",
                      display: "block",
                    }}
                    alt={`Apres ${index}-${photoJJ}`}
                  />
                  {hasAvPhoto && (
                    <img
                      src={`/assets/images/realisation_${folder}/Av_${photoJJ}.jpg`}
                      style={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        height: "80px",
                        width: "auto",

                        borderRadius: "20px",
                      }}
                      alt={`Avant ${index}-${photoJJ}`}
                    />
                  )}
                  <Chip
                    label="APRÈS"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      backgroundColor: "rgba(74, 101, 129, 0.9)",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "10px",
                      height: "20px",
                      pointerEvents: "none",
                    }}
                  />
                  {hasAvPhoto && (
                    <Chip
                      label="AVANT"
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 5,
                        right: 5,
                        backgroundColor: "rgba(200, 0, 0, 0.9)",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "8px",
                        height: "16px",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 4,
                      left: 4,
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                      },
                      width: 36,
                      height: 36,
                      pointerEvents: "none",
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>🔍</span>
                  </IconButton>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bouton droite - toujours visible */}
        <IconButton
          onClick={scrollRight}
          sx={{
            position: "absolute",
            right: 5,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "rgba(74, 101, 129, 0.8)",
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(74, 101, 129, 1)",
            },
            width: 50,
            height: 50,
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: "bold" }}>›</span>
        </IconButton>
      </div>
    </div>
  );
}

export default function Realisations() {
  const realisations = useRealisations();
  const [activeZoom, setActiveZoom] = useState(null);

  if (realisations.length === 0) return null;
  return (
    <div id="realisations-container">
      {realisations.map(({ folder, count, index }) => (
        <RealisationBandeau
          key={folder}
          folder={folder}
          count={count}
          index={index}
          activeZoom={activeZoom}
          setActiveZoom={setActiveZoom}
        />
      ))}
    </div>
  );
}
