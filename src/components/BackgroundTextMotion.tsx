import { useEffect, useState } from 'react';

const BackgroundTextMotion = () => {
  const text = 'DESIGN • CODE • MOTION • CREATIVE • '.repeat(50);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const percent = scrollY / maxScroll;

      if (percent < 0.1) {
        setOpacity(1);
      } else if (percent > 0.6) {
        setOpacity(0);
      } else {
        setOpacity(1 - (percent - 0.1) / 0.5);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pointer-events-none absolute left-0 top-0 z-0 h-[220vh] w-full animate-curve-fade-in overflow-hidden transition-opacity duration-300 ease-out" style={{ opacity }}>
      <style>{`
        .background-text-motion {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 220vh;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.3s ease-out;
          animation: curveFadeIn 1.8s ease-out forwards;
        }

        .background-text-motion__svg {
          width: 100%;
          height: 100%;
        }

        .background-text-motion__path {
          fill: none;
          stroke: rgba(255,255,255,0.05);
          stroke-width: 2;
        }

        .background-text-motion__text {
          font-size: 18x;
          font-weight: 700;
          letter-spacing: 0.2em;
          fill: rgba(255,255,255,0.12);
          text-transform: uppercase;
          font-family: sans-serif;
        }

        

        @keyframes curveFadeIn {
            from {
                opacity: 0;
                transform: translateY(40px);
                filter: blur(12px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
                filter: blur(0);
            }
        }
      `}</style>

      

      <svg
        className="h-full w-full"
        viewBox="0 0 1920 2200"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="curvePath"
            className="fill-none stroke-2 stroke-white/5"
            d="
              M 0 1850

              C 200 1780, 
                320 1580, 
                520 1400

              S 1200 1350,
                1310 920

              S 1450 450,
                1600 250 
                

              S 1750 200,
                1900 0
            "
          />
        </defs>

        {/* Optional visible path for debugging */}
        {/* <use href="#curvePath" stroke="red" fill="none" /> */}

        <text className="fill-white/12 font-sans text-[18px] font-bold uppercase tracking-[0.2em]">
          <textPath href="#curvePath" startOffset="0%">
            <animate
              attributeName="startOffset"
              from="0%"
              to="-100%"
              dur="20s"
              repeatCount="indefinite"
            />
            {text}
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default BackgroundTextMotion;