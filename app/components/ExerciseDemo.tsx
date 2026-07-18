// Animaciones SVG de cada ejercicio. La parte roja es la que se mueve.
// Se muestran dentro de "¿Cómo se hace?" en la pestaña Entreno.

const DEMOS: Record<string, string> = {
  "Press de pecho sentado": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Press de pecho sentado">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <rect x="28" y="98" width="48" height="7" rx="3" fill="#24242f"/>
      <line class="gear" x1="46" y1="98" x2="46" y2="66"/>
      <line class="fl" x1="52" y1="96" x2="82" y2="96"/>
      <line class="fl" x1="82" y1="96" x2="82" y2="116"/>
      <line class="fl" x1="52" y1="96" x2="55" y2="60"/>
      <circle class="fh" cx="55" cy="52" r="8"/>
      <line class="fm" x1="55" y1="63" x2="73" y2="67"/>
      <g class="swing" style="transform-origin:73px 67px; --a0:-42deg; --a1:14deg; --dur:2s">
        <line class="fm" x1="73" y1="67" x2="102" y2="67"/>
        <rect class="wt" x="100" y="59" width="9" height="16" rx="2"/>
      </g>
      <path class="arw" d="M118 67 h16 m-6 -5 l6 5 l-6 5"/>
    </svg>`,

  "Jalón al pecho (Lat Pull-down)": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Jalón al pecho">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <line class="gear" x1="70" y1="14" x2="70" y2="20"/>
      <circle class="gearf" cx="70" cy="12" r="5" stroke="#2b2b37" stroke-width="2"/>
      <rect x="52" y="100" width="40" height="7" rx="3" fill="#24242f"/>
      <line class="fl" x1="60" y1="98" x2="86" y2="98"/>
      <line class="fl" x1="86" y1="98" x2="86" y2="116"/>
      <line class="fl" x1="60" y1="98" x2="64" y2="60"/>
      <circle class="fh" cx="64" cy="52" r="8"/>
      <g class="swing" style="transform-origin:64px 60px; --a0:-24deg; --a1:24deg; --dur:2s">
        <line class="fm" x1="64" y1="60" x2="70" y2="22"/>
        <line class="fm" x1="60" y1="24" x2="80" y2="24" stroke-width="5"/>
      </g>
      <path class="arw" d="M96 40 v18 m-5 -6 l5 6 l5 -6"/>
    </svg>`,

  "Sentadilla a silla con mancuerna": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Sentadilla a silla">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <rect x="92" y="96" width="30" height="6" rx="2" fill="#24242f"/>
      <line class="gear" x1="118" y1="96" x2="118" y2="116"/>
      <g class="bob" style="--dy:16px; --dur:2.1s">
        <circle class="fh" cx="70" cy="44" r="8"/>
        <line class="fl" x1="70" y1="52" x2="70" y2="80"/>
        <line class="fm" x1="70" y1="62" x2="84" y2="74"/>
        <rect class="wt" x="80" y="72" width="10" height="8" rx="2"/>
        <line class="fl" x1="70" y1="80" x2="66" y2="96"/>
      </g>
      <line class="fl" x1="66" y1="96" x2="66" y2="116"/>
      <path class="arw" d="M100 66 v20 m-5 -6 l5 6 l5 -6"/>
    </svg>`,

  "Press de hombro con mancuernas": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Press de hombro">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <circle class="fh" cx="80" cy="40" r="8"/>
      <line class="fl" x1="80" y1="48" x2="80" y2="86"/>
      <line class="fl" x1="80" y1="86" x2="70" y2="116"/>
      <line class="fl" x1="80" y1="86" x2="90" y2="116"/>
      <g class="swing" style="transform-origin:80px 52px; --a0:26deg; --a1:0deg; --dur:1.8s">
        <line class="fm" x1="80" y1="52" x2="62" y2="60"/>
        <rect class="wt" x="55" y="55" width="10" height="9" rx="2"/>
      </g>
      <g class="swing" style="transform-origin:80px 52px; --a0:-26deg; --a1:0deg; --dur:1.8s">
        <line class="fm" x1="80" y1="52" x2="98" y2="60"/>
        <rect class="wt" x="95" y="55" width="10" height="9" rx="2"/>
      </g>
      <path class="arw" d="M118 66 v-20 m-5 6 l5 -6 l5 6"/>
    </svg>`,

  "Curl de bíceps sentado": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Curl de bíceps">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <rect x="52" y="100" width="40" height="7" rx="3" fill="#24242f"/>
      <line class="fl" x1="60" y1="98" x2="86" y2="98"/>
      <line class="fl" x1="86" y1="98" x2="86" y2="116"/>
      <line class="fl" x1="60" y1="98" x2="66" y2="58"/>
      <circle class="fh" cx="66" cy="50" r="8"/>
      <line class="fm" x1="66" y1="61" x2="76" y2="86"/>
      <g class="swing" style="transform-origin:76px 86px; --a0:8deg; --a1:-118deg; --dur:1.9s">
        <line class="fm" x1="76" y1="86" x2="90" y2="86"/>
        <rect class="wt" x="88" y="80" width="9" height="12" rx="2"/>
      </g>
      <path class="arw" d="M104 82 a20 20 0 0 1 -14 -22"/>
    </svg>`,

  "Crunch abdominal en polea alta": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Crunch en polea alta">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <line class="gear" x1="104" y1="16" x2="104" y2="30"/>
      <circle class="gearf" cx="104" cy="13" r="5" stroke="#2b2b37" stroke-width="2"/>
      <line class="fl" x1="60" y1="116" x2="86" y2="116"/>
      <line class="fl" x1="86" y1="116" x2="86" y2="96"/>
      <g class="swing" style="transform-origin:86px 96px; --a0:-6deg; --a1:40deg; --dur:2s">
        <line class="fm" x1="86" y1="96" x2="90" y2="66"/>
        <circle class="fh" cx="91" cy="58" r="8"/>
        <line class="fm" x1="90" y1="70" x2="104" y2="34"/>
      </g>
      <path class="arw" d="M112 52 a22 22 0 0 1 -8 24"/>
    </svg>`,

  "Aperturas / Pec Fly": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Aperturas de pecho">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <rect x="62" y="100" width="36" height="7" rx="3" fill="#24242f"/>
      <line class="fl" x1="80" y1="100" x2="80" y2="60"/>
      <circle class="fh" cx="80" cy="52" r="8"/>
      <g class="swing" style="transform-origin:80px 64px; --a0:-52deg; --a1:-4deg; --dur:2s">
        <line class="fm" x1="80" y1="64" x2="52" y2="64"/>
        <circle class="wt" cx="50" cy="64" r="6"/>
      </g>
      <g class="swing" style="transform-origin:80px 64px; --a0:52deg; --a1:4deg; --dur:2s">
        <line class="fm" x1="80" y1="64" x2="108" y2="64"/>
        <circle class="wt" cx="110" cy="64" r="6"/>
      </g>
      <path class="arw" d="M40 40 h12 m-4 -4 l4 4 l-4 4"/>
      <path class="arw" d="M120 40 h-12 m4 -4 l-4 4 l4 4"/>
    </svg>`,

  "Remo en polea baja": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Remo en polea baja">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <line class="fl" x1="56" y1="98" x2="96" y2="98"/>
      <line class="fl" x1="96" y1="98" x2="112" y2="98"/>
      <line class="fl" x1="56" y1="98" x2="58" y2="60"/>
      <circle class="fh" cx="58" cy="52" r="8"/>
      <g class="swing" style="transform-origin:58px 62px; --a0:-6deg; --a1:34deg; --dur:1.9s">
        <line class="fm" x1="58" y1="62" x2="104" y2="78"/>
        <rect class="wt" x="102" y="72" width="12" height="8" rx="2"/>
      </g>
      <path class="arw" d="M118 84 h-16 m6 -5 l-6 5 l6 5"/>
    </svg>`,

  "Curl femoral": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Curl femoral">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <rect x="40" y="86" width="70" height="7" rx="3" fill="#24242f"/>
      <circle class="fh" cx="48" cy="80" r="8"/>
      <line class="fl" x1="56" y1="84" x2="100" y2="84"/>
      <g class="swing" style="transform-origin:100px 84px; --a0:2deg; --a1:-96deg; --dur:2s">
        <line class="fm" x1="100" y1="84" x2="120" y2="84"/>
        <rect class="wt" x="118" y="78" width="8" height="12" rx="2"/>
      </g>
      <path class="arw" d="M132 78 a18 18 0 0 0 -14 -20"/>
    </svg>`,

  "Extensión de piernas": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Extensión de piernas">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <rect x="40" y="72" width="42" height="8" rx="3" fill="#24242f"/>
      <line class="gear" x1="46" y1="72" x2="46" y2="46"/>
      <circle class="fh" cx="46" cy="42" r="8"/>
      <line class="fl" x1="52" y1="72" x2="82" y2="72"/>
      <g class="swing" style="transform-origin:82px 72px; --a0:80deg; --a1:2deg; --dur:1.9s">
        <line class="fm" x1="82" y1="72" x2="112" y2="72"/>
        <rect class="wt" x="110" y="66" width="8" height="12" rx="2"/>
      </g>
      <path class="arw" d="M96 100 a26 26 0 0 1 22 -28"/>
    </svg>`,

  "Extensión de tríceps en polea": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Extensión de tríceps">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <line class="gear" x1="80" y1="14" x2="80" y2="28"/>
      <circle class="gearf" cx="80" cy="11" r="5" stroke="#2b2b37" stroke-width="2"/>
      <circle class="fh" cx="66" cy="46" r="8"/>
      <line class="fl" x1="66" y1="54" x2="66" y2="90"/>
      <line class="fl" x1="66" y1="90" x2="60" y2="116"/>
      <line class="fl" x1="66" y1="90" x2="72" y2="116"/>
      <line class="fm" x1="66" y1="56" x2="80" y2="64"/>
      <g class="swing" style="transform-origin:80px 64px; --a0:-58deg; --a1:16deg; --dur:1.8s">
        <line class="fm" x1="80" y1="64" x2="80" y2="30"/>
        <line class="fm" x1="72" y1="30" x2="88" y2="30" stroke-width="5"/>
      </g>
      <path class="arw" d="M98 44 v20 m-5 -6 l5 6 l5 -6"/>
    </svg>`,

  "Plancha": `
    <svg viewBox="0 0 160 130" role="img" aria-label="Plancha">
      <line class="grd" x1="12" y1="118" x2="148" y2="118"/>
      <g class="breathe">
        <circle class="fh" cx="40" cy="80" r="8"/>
        <line class="fm" x1="46" y1="82" x2="116" y2="96"/>
        <line class="fl" x1="52" y1="83" x2="50" y2="112"/>
        <line class="fl" x1="50" y1="112" x2="40" y2="112"/>
        <line class="fl" x1="116" y1="96" x2="120" y2="112"/>
      </g>
      <text x="80" y="40" text-anchor="middle" fill="#9a9aa8" font-size="12" font-family="system-ui">20-30 seg</text>
    </svg>`,
};

export default function ExerciseDemo({ name }: { name: string }) {
  const svg = DEMOS[name];
  if (!svg) return null;
  return <div className="exdemo" dangerouslySetInnerHTML={{ __html: svg }} />;
}
