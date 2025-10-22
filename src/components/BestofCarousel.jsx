import { useEffect, useState, useRef } from "react";
import { IconButton } from "@mui/material";

// Fonction pour vérifier l'existence d'une image
function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url + `?t=${Date.now()}`;
  });
}

// Détecter les images .jpg et .jpeg du dossier Bestof
async function detectBestofImages() {
  const found = [];
  const imageExtensions = [".jpg", ".jpeg"];

  // Liste des fichiers potentiels basée sur ce qu'on a vu dans le dossier
  const potentialFiles = [
    "&&&.jpg",
    "13.jpg",
    "16.jpg",
    "23.jpg",
    "23a.jpeg",
    "24.jpg",
    "26.jpg",
    "29.jpg",
    "6.jpg",
    "8.jpg",
    "9.jpg",
    "Av_03.jpg",
    "ddd.jpg",
    "ééé.jpg",
  ];

  for (const filename of potentialFiles) {
    const url = `/assets/images/archives/Bestof/${filename}`;
    const exists = await imageExists(url);
    if (exists) {
      found.push({
        filename,
        url,
        name: filename.replace(/\.(jpg|jpeg)$/i, ""),
      });
    }
  }

  // Trier par ordre alphabétique
  return found.sort((a, b) => a.filename.localeCompare(b.filename));
}

function useBestofImages() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    let cancelled = false;
    detectBestofImages().then((list) => {
      if (!cancelled) setImages(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return images;
}

function BestofCarousel() {
  const images = useBestofImages();
  const [startIndex, setStartIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

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

  if (images.length === 0) return null;

  const ITEM_WIDTH = isMobile ? 150 : 200;
  const ITEM_HEIGHT = isMobile ? 150 : 200;
  const ITEM_GAP = 10;

  // Créer un tableau avec les images répétées pour la boucle infinie
  const extendedImages = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < images.length; j++) {
      extendedImages.push(j);
    }
  }

  // Calculer l'offset réel pour le défilement
  const scrollOffset = images.length + startIndex;

  // Gérer le repositionnement après la transition
  const handleTransitionEnd = () => {
    if (startIndex >= images.length || startIndex <= -images.length) {
      setIsTransitioning(false);
      setStartIndex((prev) => {
        const normalized =
          ((prev % images.length) + images.length) % images.length;
        return normalized;
      });
      setTimeout(() => setIsTransitioning(true), 50);
    }
  };

  // Fonctions pour le carousel
  const scrollLeft = () => {
    setStartIndex((prev) => prev - 1);
  };

  const scrollRight = () => {
    setStartIndex((prev) => prev + 1);
  };

  // Fonctions de zoom
  function openZoom(index) {
    setZoomedImage(index);
    setShowControls(true);
    document.body.style.overflow = "hidden";
  }

  function closeZoom() {
    setZoomedImage(null);
    document.body.style.overflow = "auto";
  }

  function zoomNext() {
    setZoomedImage((prev) => (prev + 1) % images.length);
  }

  function zoomPrev() {
    setZoomedImage((prev) => (prev - 1 + images.length) % images.length);
  }

  // Mode zoom
  if (zoomedImage !== null) {
    const currentImage = images[zoomedImage];

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
            src={currentImage.url}
            style={{
              maxWidth: isMobile ? "100vw" : "100%",
              maxHeight: isMobile ? "100vh" : "80vh",
              width: "auto",
              height: "auto",
              cursor: "pointer",
              objectFit: "contain",
              display: "block",
            }}
            alt={currentImage.name}
            onClick={(e) => {
              e.stopPropagation();
              setShowControls((prev) => !prev);
            }}
          />

          {/* Boutons de contrôle */}
          {showControls && (
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
          )}

          {showControls && (
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
          )}

          {showControls && (
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
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        marginBottom: 15,
        borderRadius: "20px",
        overflow: "hidden",
        backgroundColor: "white",
      }}
    >
      {/* Carrousel horizontal avec flèches */}
      <div
        style={{
          position: "relative",
          padding: isMobile ? "10px 20px" : "10px 50px",
        }}
      >
        {/* Bouton gauche */}
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
            {extendedImages.map((imageIndex, idx) => {
              const image = images[imageIndex];

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
                  onClick={() => openZoom(imageIndex)}
                >
                  <img
                    src={image.url}
                    style={{
                      width: `${ITEM_WIDTH}px`,
                      height: `${ITEM_HEIGHT}px`,
                      objectFit: "cover",
                      display: "block",
                    }}
                    alt={image.name}
                  />
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

        {/* Bouton droite */}
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

export default BestofCarousel;
