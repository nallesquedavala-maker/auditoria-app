

import { supabase } from "./supabaseClient";
import { useState, useEffect, useRef } from "react";

/* ══════════════════════════════════════════════════════
   DESIGN SYSTEM — Family Office / Wealth Management
══════════════════════════════════════════════════════ */
const T = {
  // Core palette — as specified
  bg:       "#1A1A1B",
  bg1:      "#1F1F20",
  bg2:      "#242425",
  bg3:      "#2C2C2E",
  bg4:      "#343436",
  gold:     "#B8860B",
  goldLt:   "#CFA020",
  goldPale: "#E8D090",
  goldDim:  "#B8860B1A",
  goldBrd:  "#B8860B40",
  goldBrdMd:"#B8860B70",
  ivory:    "#F5F5F0",
  ivoryMd:  "#C8C8C0",
  ivoryDim: "#88887E",
  smoke:    "#555550",
  // Alert colors — deep, not cheap
  danger:   "#8B0000",
  dangerLt: "#A83030",
  dangerDim:"#8B000015",
  warn:     "#7A4E00",
  warnLt:   "#B07820",
  warnDim:  "#7A4E0015",
  safe:     "#1A4A2A",
  safeLt:   "#2A7A44",
  safeDim:  "#1A4A2A15",
  border:   "#2A2A2C",
  borderMd: "#363638",
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400;500&display=swap');
`;

const CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; background: ${T.bg}; font-size: 16px; }
body {
  background: ${T.bg};
  color: ${T.ivory};
  font-family: 'DM Mono', monospace;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}
::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: ${T.bg}; }
::-webkit-scrollbar-thumb { background: ${T.goldBrd}; border-radius: 2px; }

/* ── type scale ── */
.serif  { font-family: 'Libre Baskerville', Georgia, serif; }
.mono   { font-family: 'DM Mono', monospace; }

/* ── keyframes ── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.3} }
@keyframes scanV  { 0%{transform:translateY(-100%)} 100%{transform:translateY(4000px)} }
@keyframes borderPulse {
  0%,100% { border-color: ${T.goldBrd}; }
  50%     { border-color: ${T.goldBrdMd}; }
}
@keyframes grain {
  0%,100% { transform:translate(0,0); }
  20%     { transform:translate(-1px,1px); }
  40%     { transform:translate(1px,-1px); }
  60%     { transform:translate(-1px,-1px); }
  80%     { transform:translate(1px,1px); }
}
@keyframes numberCount {
  from { opacity:0; transform:scale(.92); }
  to   { opacity:1; transform:scale(1); }
}
@keyframes alertIn {
  from { opacity:0; transform:translateX(-8px); }
  to   { opacity:1; transform:translateX(0); }
}

/* ── scroll reveal ── */
.reveal {
  opacity: 0;
  transform: translateY(22px);
  transition: opacity .85s cubic-bezier(.16,1,.3,1),
              transform .85s cubic-bezier(.16,1,.3,1);
}
.reveal.in { opacity:1; transform:translateY(0); }
.reveal.d1 { transition-delay:.10s; }
.reveal.d2 { transition-delay:.20s; }
.reveal.d3 { transition-delay:.30s; }
.reveal.d4 { transition-delay:.40s; }

/* ── grain texture ── */
.grain::before {
  content: '';
  position: fixed; inset: -200%;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  background-size: 300px;
  animation: grain 10s steps(10) infinite;
  pointer-events: none; z-index: 0;
}

/* ── scan line ── */
.scan-wrap { position:relative; overflow:hidden; }
.scan-wrap::after {
  content: ''; position:absolute; left:0; right:0; top:0;
  height:100px;
  background: linear-gradient(180deg, transparent, ${T.gold}04, transparent);
  animation: scanV 8s linear infinite; pointer-events:none;
}

/* ── gold shimmer button ── */
.btn-gold {
  display: inline-flex; align-items:center; justify-content:center; gap:10px;
  font-family: 'DM Mono', monospace;
  font-size: 10px; font-weight:500; letter-spacing:2.5px; text-transform:uppercase;
  color: #0E0E0C;
  background: linear-gradient(
    135deg,
    ${T.gold} 0%, ${T.goldLt} 40%, ${T.gold} 60%, #7A5808 100%
  );
  background-size: 200% auto;
  border: none; padding: 16px 40px; border-radius: 2px;
  cursor: pointer; min-height:52px;
  transition: background-position .5s ease, filter .2s, transform .15s;
  box-shadow: 0 4px 24px ${T.goldDim}, 0 1px 0 ${T.goldBrd} inset;
  position: relative; overflow: hidden;
}
.btn-gold::after {
  content:''; position:absolute; inset:0;
  background: linear-gradient(135deg, rgba(255,255,255,.12) 0%, transparent 50%);
  pointer-events:none;
}
.btn-gold:hover {
  background-position: right center;
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 8px 32px ${T.goldDim}, 0 1px 0 ${T.goldBrd} inset;
}
.btn-gold:active { transform:translateY(0); }
.btn-gold:disabled { opacity:.35; cursor:not-allowed; transform:none; }

.btn-ghost {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  font-family:'DM Mono',monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase;
  color:${T.gold}; background:transparent;
  border:1px solid ${T.goldBrd}; padding:12px 28px; border-radius:2px;
  cursor:pointer; min-height:44px; transition:all .2s;
}
.btn-ghost:hover { background:${T.goldDim}; border-color:${T.goldBrdMd}; }

/* ── cards ── */
.card {
  background: ${T.bg2};
  border: 1px solid ${T.border};
  border-radius: 3px;
  position: relative;
  transition: border-color .3s, box-shadow .3s;
}
.card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:1px;
  background: linear-gradient(90deg, transparent, ${T.gold}50, transparent);
  pointer-events:none;
}
.card:hover { border-color: ${T.goldBrd}; }
.card-vault {
  border-color: ${T.border};
  cursor: default;
  transition: border-color .35s ease, box-shadow .35s ease;
}
.card-vault:hover {
  border-color: ${T.goldBrdMd};
  box-shadow: 0 0 0 1px ${T.goldDim}, 0 8px 32px ${T.goldDim};
}
.card-active { border-color: ${T.goldBrdMd}; animation: borderPulse 3s infinite; }

/* ── eyebrow ── */
.eyebrow {
  font-family:'DM Mono',monospace; font-size:8px;
  letter-spacing:4px; text-transform:uppercase; color:${T.gold};
  display:block;
}

/* ── tags ── */
.tag {
  display:inline-flex; align-items:center; gap:5px;
  font-family:'DM Mono',monospace;
  font-size:7px; letter-spacing:1.5px; text-transform:uppercase;
  font-weight:500; padding:3px 9px; border-radius:1px;
}
.tag-danger { background:${T.dangerDim}; color:${T.dangerLt}; border:1px solid ${T.danger}40; }
.tag-warn   { background:${T.warnDim};   color:${T.warnLt};   border:1px solid ${T.warn}40; }
.tag-safe   { background:${T.safeDim};   color:${T.safeLt};   border:1px solid ${T.safe}40; }
.tag-gold   { background:${T.goldDim};   color:${T.gold};     border:1px solid ${T.goldBrd}; }

/* ── alert ── */
.alert-danger {
  background:${T.dangerDim}; border:1px solid ${T.danger}40; border-radius:2px;
  padding:12px 16px; display:flex; gap:10px; align-items:flex-start;
  animation: alertIn .3s ease;
}
.alert-warn {
  background:${T.warnDim}; border:1px solid ${T.warn}40; border-radius:2px;
  padding:12px 16px; display:flex; gap:10px; align-items:flex-start;
  animation: alertIn .3s ease;
}

/* ── inputs ── */
select, input[type="text"], input[type="number"] {
  background: ${T.bg1} !important;
  border: 1px solid ${T.borderMd} !important;
  color: ${T.ivory} !important;
  font-family: 'DM Mono', monospace !important;
  font-size: 12px !important;
  padding: 13px 16px !important;
  border-radius: 2px !important;
  width: 100%; outline: none !important;
  transition: border-color .2s, box-shadow .2s;
  -webkit-appearance: none; appearance: none; letter-spacing:.3px;
}
select:focus, input:focus {
  border-color: ${T.gold} !important;
  box-shadow: 0 0 0 3px ${T.goldDim} !important;
}
select option { background: ${T.bg2}; }
input::placeholder { color: ${T.smoke} !important; }

/* ── option button ── */
.opt-btn {
  padding:13px 16px; border:1px solid ${T.border};
  border-radius:2px; cursor:pointer; display:flex; align-items:center; gap:12px;
  background:${T.bg1}; transition:all .18s;
  font-family:'DM Mono',monospace; font-size:11px; color:${T.ivoryMd};
  min-height:48px; text-align:left; width:100%;
}
.opt-btn:hover { border-color:${T.goldBrd}; background:${T.goldDim}; color:${T.ivory}; }
.opt-btn.selected {
  border-color:${T.gold}; background:${T.goldDim}; color:${T.ivory};
}
.opt-btn.danger { border-color:${T.danger}40; background:${T.dangerDim}; color:${T.dangerLt}; }
.opt-btn.danger:hover,.opt-btn.danger.selected { border-color:${T.dangerLt}; }
.opt-btn.warn { border-color:${T.warn}40; background:${T.warnDim}; color:${T.warnLt}; }

/* ── progress ── */
.progress-track {
  height:2px; background:${T.bg3}; border-radius:1px; overflow:hidden;
}
.progress-fill {
  height:100%;
  background: linear-gradient(90deg, ${T.gold}, ${T.goldLt});
  border-radius:1px;
  transition: width .6s cubic-bezier(.4,0,.2,1);
}

/* ── thermometer ── */
.therm-outer {
  width:24px; background:${T.bg1}; border:1px solid ${T.border};
  border-radius:12px; overflow:hidden; display:flex; align-items:flex-end;
}
.therm-fill {
  width:100%; border-radius:0 0 12px 12px;
  transition: height 1.4s cubic-bezier(.4,0,.2,1), background .8s;
}

/* ── dividers ── */
hr.d  { border:none; border-top:1px solid ${T.border}; }
hr.dg { border:none; border-top:1px solid ${T.goldBrd}; }

/* ── layout ── */
.wrap   { max-width:960px;  margin:0 auto; padding:0 28px; }
.wrap-sm{ max-width:720px;  margin:0 auto; padding:0 28px; }
.wrap-lg{ max-width:1100px; margin:0 auto; padding:0 28px; }
.sec    { padding:104px 0; }
.sec-sm { padding:72px 0; }
.g2 { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
.g3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px; }
@media(max-width:700px){
  .g2,.g3{ grid-template-columns:1fr; }
  .wrap,.wrap-sm,.wrap-lg{ padding:0 20px; }
  .sec{ padding:72px 0; }
}

/* ── locked gradient ── */
.locked-fade {
  position:relative; user-select:none;
}
.locked-fade::after {
  content:''; position:absolute; inset:0;
  background:linear-gradient(180deg,transparent 20%,${T.bg2} 85%);
  pointer-events:none;
}

/* ── blockquote ── */
.bq-mark {
  font-family:'Libre Baskerville',serif;
  font-size:72px; line-height:.75; color:${T.goldBrd};
  display:block; margin-bottom:-8px;
}

/* ── nav dot ── */
.nav-dot {
  width:6px; height:6px; border-radius:50%;
  background:${T.gold}; flex-shrink:0;
  animation: pulse 3s infinite;
}
`;

/* ══════════════════════════════════════════════════════
   SCORING ENGINE — 15 questions × 3 categories
══════════════════════════════════════════════════════ */
const QS = {
  realestate: [
    { text:"¿Existe fideicomiso de garantía constituido ante banco regulado?",
      opts:["Sí — número de contrato verificable en banco regulado","En proceso de constitución (sin número activo)","No existe fideicomiso"],
      w:[0,-20,-50], critical:[null,"Protocolo pendiente no protege tu capital hoy. Solo firma cuando el número sea verificable.","PUNTO DE QUIEBRE: Sin fideicomiso, tus recursos no tienen protección legal. Art. 2317 C.C."], src:"CONDUSEF / CNBV 2025" },
    { text:"¿El terreno tiene escrituras inscritas en el Registro Público?",
      opts:["Sí — folio registral verificable hoy","En trámite de registro","No está escriturado"],
      w:[0,-15,-30], critical:[null,null,"Sin escritura registrada, el emisor puede vender la misma unidad a múltiples compradores."], src:"Código Civil Federal Art. 2317" },
    { text:"¿El desarrollador tiene más de tres proyectos entregados y documentados?",
      opts:["Sí — proyectos verificables con testimonios directos","1-2 proyectos entregados","Primer proyecto o sin historial documentado"],
      w:[0,-10,-25], critical:[null,null,null], src:"Criterio estándar de due diligence" },
    { text:"¿El rendimiento anual prometido supera el 25%?",
      opts:["No — entre 8% y 20% anual, modelo documentado","Entre 20% y 35% anual","Sí — más del 35% anual"],
      w:[0,-20,-35], critical:[null,"Supera el benchmark inmobiliario formal. Exige sustento del modelo financiero.","Rendimiento imposible de sostener en bienes raíces sin apalancamiento fraudulento."], src:"Benchmark CNBV / CONDUSEF 2025" },
    { text:"¿El contrato especifica el destino exacto de los fondos?",
      opts:["Sí — partidas detalladas con supervisión de perito","De forma general","No especificado en el instrumento"],
      w:[0,-10,-20], critical:[null,null,"Sin destino específico, los recursos pueden usarse discrecionalmente."], src:"Ley Federal de Protección al Consumidor" },
    { text:"¿Existen garantías reales ejecutables (hipoteca o aval bancario)?",
      opts:["Sí — hipoteca o aval de institución bancaria formal","Garantía personal del promotor","Solo promesa verbal o moral"],
      w:[0,-10,-20], critical:[null,null,"Las promesas verbales no son ejecutables judicialmente."], src:"Código de Comercio Mexicano" },
    { text:"¿Las licencias de construcción son vigentes y verificables en el municipio?",
      opts:["Sí — número de licencia verificable","En trámite de expedición","No existen licencias formales"],
      w:[0,-10,-20], critical:[null,null,null], src:"Ley General de Asentamientos Humanos" },
    { text:"¿El promotor crea urgencia extrema de precio 'que vence hoy'?",
      opts:["No — precio estable, proceso de análisis respetado","Descuento con plazo razonable","Sí — presión constante y cronómetros artificiales"],
      w:[0,-5,-15], critical:[null,null,"Urgencia artificial diseñada para eliminar tu capacidad de análisis racional."], src:"PROFECO — Manual de señales de fraude 2025" },
    { text:"¿Puedes visitar la obra con tu propio ingeniero esta semana?",
      opts:["Sí — acceso y documentación libres","Con restricciones o por cita controlada","No permiten visita ni muestran avance real"],
      w:[0,-10,-25], critical:[null,null,"Negativa de acceso indica que el desarrollo no existe en el estado prometido."], src:"Criterio de due diligence operacional" },
    { text:"¿El contrato incluye penalidades específicas por incumplimiento del desarrollador?",
      opts:["Sí — penalidades con montos y plazos ejecutables","Cláusula vaga sin montos precisos","No hay cláusula de incumplimiento"],
      w:[0,-10,-20], critical:[null,null,null], src:"Criterio contractual estándar" },
    { text:"¿La empresa desarrolladora tiene RFC activo verificable en el SAT?",
      opts:["Sí — verificable en el portal del SAT","Sí, pero con inconsistencias en la verificación","No presentan RFC o aparece cancelado"],
      w:[0,-10,-25], critical:[null,null,"Empresa sin RFC activo no puede operar legalmente en México."], src:"Ley del SAT / SHCP" },
    { text:"¿Puedes contactar directamente a otros inversores sin intermediación del promotor?",
      opts:["Sí — contacto directo sin filtro","Solo a través del promotor","No permiten contacto independiente"],
      w:[0,-10,-20], critical:[null,null,null], src:"Criterio de validación social independiente" },
    { text:"¿El plazo de entrega está especificado con fecha exacta en el contrato?",
      opts:["Sí — fecha específica con penalidades vinculadas","Plazo aproximado sin consecuencias","Sin fecha de entrega en el instrumento"],
      w:[0,-10,-15], critical:[null,null,null], src:"Criterio contractual" },
    { text:"¿Los planos están firmados por arquitecto con cédula verificable en la SEP?",
      opts:["Sí — cédula verificable en la Dirección General de Profesiones","Sí, pero no fue posible verificar","No tienen planos con firma profesional"],
      w:[0,-5,-15], critical:[null,null,null], src:"Ley Reglamentaria del Art. 5° Constitucional" },
    { text:"¿Existe póliza de seguro o fianza de cumplimiento emitida por institución externa?",
      opts:["Sí — póliza o fianza verificable","En proceso de contratación","No existe garantía de cumplimiento externa"],
      w:[0,-5,-10], critical:[null,null,null], src:"Ley Federal de Instituciones de Fianzas" },
  ],
  fund: [
    { text:"¿El fondo tiene número de registro activo verificable ante la CNBV?",
      opts:["Sí — folio activo en el sitio oficial del regulador","En trámite (más de 90 días sin resolución)","No está regulado ante ningún organismo"],
      w:[0,-15,-40], critical:[null,"Fondos en trámite por más de 90 días indican complicaciones regulatorias serias.","INCUMPLIMIENTO LEGAL: Captar recursos sin autorización viola el Art. 10 de la Ley del Mercado de Valores."], src:"CNBV / Ley del Mercado de Valores" },
    { text:"¿El retorno mensual prometido supera el 5%?",
      opts:["No — entre 0.5% y 3% mensual con modelo documentado","Entre 3% y 5% mensual","Sí — más del 5% mensual garantizado"],
      w:[0,-25,-40], critical:[null,"Supera el umbral de alerta CNBV. Ningún mercado eficiente sustenta esto de forma consistente.","PATRÓN PONZI CONFIRMADO: El FBI IC3 2025 identifica este umbral como criterio #1 de fraude estructural."], src:"CNBV Circular 9/2024 / FBI IC3 Report 2025" },
    { text:"¿Los estados financieros están auditados por firma de primer nivel?",
      opts:["Sí — KPMG, Deloitte, EY o PwC","Firma de auditoría sin reconocimiento formal","No presentan estados financieros"],
      w:[0,-10,-30], critical:[null,null,"Sin auditoría verificable, es imposible determinar si el capital existe o ha sido utilizado."], src:"NIA 700 — Normas Internacionales de Auditoría" },
    { text:"¿Puedes retirar tu capital en 30-90 días sin penalización extrema?",
      opts:["Sí — proceso claro y sin penalidades desproporcionadas","Con restricciones o penalidades significativas","Fondos bloqueados de forma indefinida o discrecional"],
      w:[0,-15,-30], critical:[null,null,"SEÑAL CRÍTICA: La incapacidad de retiro es el indicador más confiable de insolvencia activa."], src:"Principios IOSCO de Gestión de Fondos" },
    { text:"¿El fondo paga comisiones por incorporar nuevos inversores?",
      opts:["No — modelo sin compensación por referidos","Referido ocasional con compensación acotada","Sí — esquema multinivel activo y promovido"],
      w:[0,-10,-40], critical:[null,null,"ESTRUCTURA PIRAMIDAL: Compensar la captación de inversores es el elemento central de un esquema Ponzi. Art. 388 Bis CPF."], src:"Art. 388 Bis Código Penal Federal" },
    { text:"¿La estrategia de inversión está documentada en un prospecto verificable?",
      opts:["Sí — prospecto detallado con benchmarks de referencia","Información parcial o ambigua","Estrategia calificada como 'propietaria' o confidencial"],
      w:[0,-10,-20], critical:[null,null,"Estrategia opaca impide evaluar el riesgo real. Es incompatible con la gestión fiduciaria legítima."], src:"Criterios SEC de divulgación" },
    { text:"¿Los rendimientos históricos varían con la volatilidad del mercado?",
      opts:["Sí — fluctúan de forma coherente con el contexto","Variación mínima y sospechosamente constante","No — siempre el mismo porcentaje independiente del mercado"],
      w:[0,-15,-30], critical:[null,"Retornos casi perfectos en mercados volátiles son estadísticamente imposibles en gestión legítima.","Retornos perfectamente constantes son la señal definitiva de Ponzi. Madoff operó así 17 años."], src:"Chainalysis / FBI IC3 2025" },
    { text:"¿El gestor tiene certificaciones verificables (CFA, CAIA o equivalente)?",
      opts:["Sí — verificable en la entidad certificadora","Credenciales mencionadas sin verificación posible","Sin certificaciones formales relevantes"],
      w:[0,-10,-15], critical:[null,null,null], src:"CFA Institute / CAIA Association" },
    { text:"¿Los activos están en custodia de institución independiente del gestor?",
      opts:["Sí — banco o broker regulado independiente","Custodia administrada por el propio fondo","No hay información sobre custodia de activos"],
      w:[0,-15,-25], critical:[null,null,"Gestor que también custodia es la estructura exacta del fraude de Madoff."], src:"SEC — Regla de custodia de asesores" },
    { text:"¿Tienes acceso en tiempo real a tus posiciones en plataforma independiente?",
      opts:["Sí — acceso directo sin intermediación","Solo reportes periódicos del propio gestor","Sin acceso a posiciones o saldo actual"],
      w:[0,-10,-20], critical:[null,null,null], src:"Principios de transparencia IOSCO" },
    { text:"¿La entidad opera desde jurisdicción sin tratado de información con México?",
      opts:["No — jurisdicción con tratado vigente","Parcialmente offshore","Sí — BVI, Islas Caimán u offshore opaco"],
      w:[0,-10,-20], critical:[null,null,"Estructura offshore sin tratado hace la ejecución judicial prácticamente inviable."], src:"OCDE / FATF 2025" },
    { text:"¿El promotor genera urgencia de cupo o ventana de inversión que 'cierra pronto'?",
      opts:["No — proceso de decisión sin presión temporal","Levemente — con justificación parcial","Sí — presión constante e injustificada"],
      w:[0,-5,-15], critical:[null,null,"Urgencia artificial es el mecanismo para impedir el análisis racional del inversor."], src:"PROFECO — Criterios de fraude 2025" },
    { text:"¿Existe un comité de inversiones con miembros identificables públicamente?",
      opts:["Sí — perfiles verificables en registros profesionales","Comité mencionado pero sin identificación","No existe comité de inversiones formal"],
      w:[0,-10,-15], critical:[null,null,null], src:"Criterio de gobernanza de fondos" },
    { text:"¿El contrato tiene cláusula de resolución de controversias con árbitro neutral?",
      opts:["Sí — arbitraje ante institución reconocida","Cláusula vaga sin institución específica","Solo vía judicial sin opción de arbitraje"],
      w:[0,-5,-10], critical:[null,null,null], src:"Criterio contractual de protección al inversor" },
    { text:"¿El prospecto incluye una sección explícita de factores de riesgo?",
      opts:["Sí — riesgos detallados con escenarios de pérdida","Menciona riesgos de forma genérica","Sin sección de riesgos en ningún documento"],
      w:[0,-10,-15], critical:[null,null,"Todo instrumento de inversión legítimo debe revelar sus riesgos explícitamente."], src:"NIF / GAAP — Revelación de riesgos" },
  ],
  crypto: [
    { text:"¿El proyecto tiene whitepaper auditado por firma de seguridad reconocida?",
      opts:["Sí — CertiK, Trail of Bits, Hacken o equivalente","Whitepaper publicado sin auditoría externa","No existe whitepaper formal"],
      w:[0,-15,-25], critical:[null,null,"Proyecto sin documentación técnica auditada carece de sustancia verificable."], src:"IOSCO / Estándar de auditoría DeFi" },
    { text:"¿El retorno mensual prometido supera el 5%?",
      opts:["No — modelo con retorno variable y documentado","Entre 5% y 10% mensual","Sí — más del 10% mensual con garantía"],
      w:[0,-25,-40], critical:[null,"Supera el umbral de alerta regulatorio. Exige modelo financiero detallado y verificable.","PATRÓN PONZI CONFIRMADO: El FBI IC3 2025 identifica este umbral como criterio #1 de fraude en criptoactivos."], src:"FBI IC3 Report 2025 / CNBV" },
    { text:"¿El token cotiza en exchange regulado con volumen verificable?",
      opts:["Sí — Binance, Coinbase o Kraken con historial","Exchange desconocido o sin regulación","No cotiza en ningún exchange"],
      w:[0,-15,-25], critical:[null,null,"Sin mercado secundario regulado, la liquidez es una trampa: puedes entrar pero no salir."], src:"FATF — Estándares de exchange 2025" },
    { text:"¿El equipo fundador es público con trayectoria profesional documentada?",
      opts:["Sí — LinkedIn verificable e historial profesional claro","Parcialmente público, sin verificación completa","Anónimo o bajo seudónimo"],
      w:[0,-15,-30], critical:[null,null,"El 94% de rug pulls fueron ejecutados por equipos anónimos (Chainalysis 2025)."], src:"Chainalysis Crypto Crime Report 2025" },
    { text:"¿La liquidez del protocolo está bloqueada en contrato verificable?",
      opts:["Sí — más de 12 meses en Unicrypt o Team Finance","Menos de 12 meses de bloqueo","No está bloqueada en ningún contrato"],
      w:[0,-10,-20], critical:[null,null,"Sin liquidez bloqueada, los fundadores pueden vaciar el protocolo en una sola transacción."], src:"DeFi Llama / Chainalysis 2025" },
    { text:"¿El smart contract es público y tiene auditoría formal?",
      opts:["Sí — auditoría pública y verificable","Código público sin auditoría de firma reconocida","No es público o no existe contrato formal"],
      w:[0,-10,-25], critical:[null,null,"Sin auditoría del código, puede contener mecanismos para vaciar fondos sin detección."], src:"CertiK / OpenZeppelin — Estándares 2025" },
    { text:"¿La distribución de tokens (tokenomics) está documentada y verificable en blockchain?",
      opts:["Sí — vesting y distribución verificable on-chain","Parcialmente documentada","Sin información de distribución de tokens"],
      w:[0,-10,-20], critical:[null,null,"Sin tokenomics transparentes, el equipo puede concentrar el 90% del supply y colapsar el precio."], src:"Criterio de transparencia DeFi" },
    { text:"¿El proyecto tiene caso de uso real con métricas on-chain verificables?",
      opts:["Sí — transacciones y usuarios verificables en blockchain","Caso de uso teórico sin adopción documentada","Solo narrativa sin producto funcional"],
      w:[0,-15,-25], critical:[null,null,null], src:"Criterio de adopción tecnológica" },
    { text:"¿Los promotores usan videos de celebridades o endorsements no verificados?",
      opts:["No — marketing transparente y verificable","No estoy seguro de la autenticidad","Sí — o no puedo verificar el origen"],
      w:[0,-15,-30], critical:[null,"Verifica el video en el canal oficial verificado. Si no está ahí, es fabricado.","DEEPFAKE CONFIRMADO: El 61% de fraudes crypto en LATAM 2025 usaron endorsements sintéticos."], src:"FBI IC3 2025 / Deepware Scanner" },
    { text:"¿Existe comunidad activa e independiente del equipo fundador?",
      opts:["Sí — foros con crítica libre y debate técnico","Comunidad controlada y moderada por el equipo","Sin comunidad verificable o foros eliminados"],
      w:[0,-10,-15], critical:[null,null,null], src:"Criterio de descentralización comunitaria" },
    { text:"¿El proyecto tiene inversores institucionales verificados públicamente?",
      opts:["Sí — VCs con anuncio público verificable","Inversores mencionados sin verificación posible","Sin inversores institucionales documentados"],
      w:[0,-10,-10], critical:[null,null,null], src:"Criterio de respaldo institucional" },
    { text:"¿El promotor presiona para que inviertas hoy bajo amenaza de perder el precio?",
      opts:["No — proceso de análisis respetado","Levemente — con argumentación parcial","Sí — urgencia constante e injustificada"],
      w:[0,-5,-15], critical:[null,null,"Presión artificial diseñada para eliminar tu capacidad de análisis."], src:"PROFECO / CONDUSEF 2025" },
    { text:"¿El protocolo tiene un programa de bug bounty activo?",
      opts:["Sí — programa activo con recompensas documentadas","Mencionado sin implementación verificable","No existe programa de seguridad"],
      w:[0,-5,-10], critical:[null,null,null], src:"Criterio de seguridad DeFi" },
    { text:"¿Las cuentas oficiales del proyecto tienen más de 12 meses de historial?",
      opts:["Sí — más de un año de historial verificable","Entre 6 y 12 meses","Menos de 6 meses o cuentas recién creadas"],
      w:[0,-5,-15], critical:[null,null,"Proyectos fraudulentos crean cuentas nuevas para cada operación."], src:"Criterio de madurez de proyecto" },
    { text:"¿El roadmap tiene hitos cumplidos con evidencia pública verificable?",
      opts:["Sí — hitos documentados con evidencia en blockchain o GitHub","Roadmap sin hitos cumplidos aún","Sin roadmap formal o con fechas inconsistentes"],
      w:[0,-10,-15], critical:[null,null,null], src:"Criterio de entrega de producto" },
  ],
};

function calcScore(type, answers) {
  const qs = QS[type];
  let score = 100;
  const flags = [], criticals = [];
  qs.forEach((q, i) => {
    const a = answers[i];
    if (a === undefined) return;
    const pts = q.w[a] || 0;
    if (pts < 0) {
      score += pts;
      flags.push({ q: q.text, ans: q.opts[a], pts, sev: pts <= -30 ? "danger" : pts <= -15 ? "warn" : "minor", src: q.src });
    }
    if (q.critical[a]) criticals.push({ msg: q.critical[a], sev: (q.w[a] || 0) <= -30 ? "danger" : "warn" });
  });
  return { score: Math.max(0, score), flags, criticals };
}

function riskOf(s) {
  if (s >= 80) return { label:"VERIFICADO",      color:T.safeLt,   tag:"safe",   short:"Los criterios de blindaje básico están cubiertos. Procede con revisión contractual." };
  if (s >= 60) return { label:"PRECAUCIÓN",      color:T.warnLt,   tag:"warn",   short:"Se detectaron señales de alerta. Exige documentación adicional antes de comprometer capital." };
  if (s >= 35) return { label:"RIESGO ELEVADO",  color:"#C07030",  tag:"warn",   short:"Múltiples indicadores de riesgo serio. Probabilidad alta de pérdida parcial o total." };
  return       { label:"FRAUDE PROBABLE",        color:T.dangerLt, tag:"danger", short:"El Auditor detecta patrones documentados de fraude. No transfieras capital." };
}

/* ══════════════════════════════════════════════════════
   UTILITY HOOKS
══════════════════════════════════════════════════════ */
function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

function R({ children, d = 0, style = {} }) {
  const [ref, vis] = useReveal();
  const dc = d > 0 ? `d${d}` : "";
  return (
    <div ref={ref} className={`reveal ${dc} ${vis ? "in" : ""}`} style={style}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════ */
function Gold({ children, style = {} }) {
  return <span style={{ color: T.gold, ...style }}>{children}</span>;
}

function Divider({ gold = false, style = {} }) {
  return <hr className={gold ? "dg" : "d"} style={{ margin: "0", ...style }} />;
}

function StatPill({ n, label, src }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div className="serif" style={{ fontSize: "clamp(30px,5vw,48px)", fontWeight: 700, color: T.goldLt, lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 10, color: T.ivoryMd, marginTop: 6, lineHeight: 1.5 }}>{label}</div>
      <div style={{ fontSize: 7, color: T.smoke, marginTop: 3, letterSpacing: .8 }}>{src}</div>
    </div>
  );
}

function Thermometer({ score: s }) {
  const { color } = riskOf(s);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ fontSize: 7, letterSpacing: 2, color: T.ivoryDim, textTransform: "uppercase" }}>índice</div>
      <div className="therm-outer" style={{ height: 140 }}>
        <div className="therm-fill" style={{ height: `${s}%`, background: `linear-gradient(180deg,${color},${color}66)` }} />
      </div>
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${color}15`, border: `1px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 500, color }}>
        {s}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════ */
function Nav({ onAudit }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: scrolled ? `${T.bg}EE` : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
      transition: "all .4s cubic-bezier(.16,1,.3,1)",
    }}>
      <div className="wrap" style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="nav-dot" />
          <span className="serif" style={{ color: T.gold, fontSize: 17, fontWeight: 700, letterSpacing: .3 }}>SafeGuard Pro</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn-ghost" style={{ fontSize: 8, padding: "10px 20px", minHeight: 38 }} onClick={() => go("vault")}>El Vault</button>
          <button className="btn-gold"  style={{ fontSize: 9, padding: "10px 24px", minHeight: 38, animation: "none", boxShadow: "none" }} onClick={() => go("pricing")}>ACTIVAR BLINDAJE</button>
        </div>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════ */
function Hero({ onAudit }) {
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="scan-wrap" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 80, position: "relative" }}>
      {/* Subtle radial glow */}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, borderRadius: "50%", background: `radial-gradient(circle, ${T.goldDim} 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1, paddingTop: 40, paddingBottom: 80 }}>
        {/* Eyebrow */}
        <div style={{ animation: "fadeIn 1s ease .1s both" }}>
          <span className="eyebrow" style={{ marginBottom: 28 }}>Private Investment Vault · 2026</span>
        </div>

        {/* Main headline */}
        <div style={{ animation: "fadeUp .9s cubic-bezier(.16,1,.3,1) .2s both", maxWidth: 780 }}>
          <h1 className="serif" style={{ fontSize: "clamp(34px,6.5vw,72px)", fontWeight: 700, color: T.ivory, lineHeight: 1.08, letterSpacing: "-1.5px", marginBottom: 16 }}>
            La certeza no es<br />una emoción.
          </h1>
          <h1 className="serif" style={{ fontSize: "clamp(28px,5.5vw,60px)", fontWeight: 400, fontStyle: "italic", color: T.gold, lineHeight: 1.1, letterSpacing: "-1px", marginBottom: 36 }}>
            Es un sistema.
          </h1>
        </div>

        {/* Subhead */}
        <div style={{ animation: "fadeUp .9s cubic-bezier(.16,1,.3,1) .36s both", maxWidth: 520 }}>
          <p style={{ fontSize: "clamp(13px,1.8vw,16px)", color: T.ivoryMd, lineHeight: 1.95, fontWeight: 300, marginBottom: 44 }}>
            Usa 20 años de estrategia legal para auditar tu próxima inversión en 5 minutos. Antes de la firma. No después.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ animation: "fadeUp .9s cubic-bezier(.16,1,.3,1) .48s both", display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 72 }}>
          <button className="btn-gold" style={{ fontSize: 11 }} onClick={() => go("auditor")}>
            INICIAR AUDITORÍA GRATUITA
          </button>
          <button className="btn-ghost" onClick={() => go("legado")}>
            LA CARTA DEL FUNDADOR
          </button>
        </div>

        {/* Stats */}
        <div style={{ animation: "fadeUp .9s cubic-bezier(.16,1,.3,1) .6s both" }}>
          <Divider style={{ marginBottom: 40 }} />
          <div style={{ display: "flex", gap: "clamp(24px,5vw,64px)", flexWrap: "wrap" }}>
            <StatPill n="15"  label="Criterios regulatorios por categoría" src="CNBV · SEC · IOSCO" />
            <StatPill n="312" label="Preventas bajo investigación activa"   src="CONDUSEF Q1-2026" />
            <StatPill n="94%" label="Rug pulls — equipos anónimos"          src="Chainalysis 2025" />
            <StatPill n="$97" label="USD · Acceso de por vida"               src="Sin renovación" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   AUDITOR ENGINE — full 15-question scorer
══════════════════════════════════════════════════════ */
const TYPE_META = {
  realestate: { label: "Preventa Inmobiliaria", icon: "⬛" },
  fund:        { label: "Fondo Privado / Club",  icon: "◆" },
  crypto:      { label: "Cripto / Trading",      icon: "◈" },
};

function AuditorEngine() {
  const [phase, setPhase] = useState("type");   // type | name | questions | result
  const [type,  setType]  = useState(null);
  const [name,  setName]  = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [curr,  setCurr]  = useState(0);
  const [answers, setAnswers] = useState({});
  const [result,  setResult]  = useState(null);
  const [alert,   setAlert]   = useState(null);

  const qs = type ? QS[type] : [];

  const selectType = t => { setType(t); setPhase("name"); };
  const startQ = () => { if (name.trim()) setPhase("questions"); };

  const selectAnswer = (ai) => {
    const newAns = { ...answers, [curr]: ai };
    setAnswers(newAns);
    const q = qs[curr];
    if (q.critical[ai]) setAlert({ msg: q.critical[ai], sev: (q.w[ai] || 0) <= -30 ? "danger" : "warn" });
    else setAlert(null);
  };

  const guardarAuditoria = async (finalResult) => {
    setSaving(true);
    setSaved(false);
    setSaveError(null);

    const respuestasDetalladas = qs.map((q, index) => ({
      pregunta: q.text,
      respuesta: q.opts[answers[index]] || null,
      fuente: q.src || null
    }));

    const nivel = riskOf(finalResult.score);

    const { error } = await supabase
      .from("auditorias")
      .insert([
        {
          nombre_cliente: clientName || "sin_nombre",
          email_cliente: clientEmail || "sin_email",
          tipo_inversion: TYPE_META[type]?.label || type,
          respuestas: respuestasDetalladas,
          score: finalResult.score,
          nivel_riesgo: nivel.label,
          red_flags: finalResult.flags
        }
      ]);

    if (error) {
      console.error("Error guardando auditoría:", error);
      setSaveError(error.message);
    } else {
      console.log("Auditoría guardada correctamente");
      setSaved(true);
    }

    setSaving(false);
  };

  const goNext = async () => {
    if (curr < qs.length - 1) {
      setCurr(c => c + 1);
      setAlert(null);
    } else {
      const finalResult = calcScore(type, answers);
      setResult(finalResult);
      setPhase("result");
      await guardarAuditoria(finalResult);
    }
  };
  const goPrev = () => { if (curr > 0) { setCurr(c => c - 1); setAlert(null); } };
  const reset  = () => {
    setPhase("type");
    setType(null);
    setName("");
    setClientName("");
    setClientEmail("");
    setCurr(0);
    setAnswers({});
    setResult(null);
    setAlert(null);
    setSaving(false);
    setSaved(false);
    setSaveError(null);
  };

  const canNext = answers[curr] !== undefined;
  const progress = qs.length ? ((curr + 1) / qs.length) * 100 : 0;

  const openReport = () => {
    if (!result || !type) return;
    const risk = riskOf(result.score);
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
    <title>Reporte de Blindaje — ${name || "Inversión"}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:Georgia,serif;background:#1A1A1B;color:#F5F5F0;padding:48px;max-width:700px;margin:0 auto;}
      .logo{font-size:20px;color:#B8860B;font-weight:700;letter-spacing:.5px;margin-bottom:4px;}
      .sub{font-size:8px;letter-spacing:3px;color:#444;text-transform:uppercase;}
      .score-box{background:#242425;border:1px solid #B8860B40;border-radius:3px;padding:32px;text-align:center;margin:32px 0;}
      .score-n{font-size:80px;font-weight:700;color:${risk.color};line-height:1;}
      .score-l{font-size:12px;letter-spacing:3px;color:${risk.color};margin-top:8px;}
      .verdict{font-size:11px;color:#888;margin-top:12px;line-height:1.8;}
      .section-title{font-size:7px;letter-spacing:3px;color:#B8860B;text-transform:uppercase;margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid #2A2A2C;}
      .flag{background:#1F1F20;border-left:3px solid ${T.dangerLt};padding:12px 16px;margin:8px 0;border-radius:2px;}
      .flag.warn{border-color:${T.warnLt};}
      .flag-pts{font-size:12px;font-weight:700;color:${T.dangerLt};float:right;}
      .flag-q{font-size:9px;color:#666;margin-bottom:4px;font-family:monospace;}
      .flag-a{font-size:11px;color:#F5F5F0;}
      .flag-s{font-size:7px;color:#444;margin-top:4px;font-family:monospace;}
      .footer{border-top:1px solid #2A2A2C;margin-top:40px;padding-top:20px;font-size:7px;color:#333;line-height:1.8;font-family:monospace;}
      table{width:100%;border-collapse:collapse;font-size:11px;}
      td{padding:6px 0;} td:first-child{color:#555;width:160px;}
      @media print{body{background:#fff;color:#111;} .score-box{background:#f8f8f8;}}
    </style></head><body>
    <div style="border-bottom:2px solid #B8860B;padding-bottom:20px;margin-bottom:28px;">
      <div class="logo">SafeGuard Pro</div>
      <div class="sub">Private Investment Vault 2026 · Reporte de Auditoría Patrimonial</div>
    </div>
    <div style="margin-bottom:24px;">
      <div class="section-title" style="margin-bottom:12px;">Datos del Protocolo</div>
      <table>
        <tr><td>Proyecto evaluado</td><td><strong>${name || "Sin nombre"}</strong></td></tr>
        <tr><td>Categoría</td><td>${TYPE_META[type]?.label}</td></tr>
        <tr><td>Fecha de análisis</td><td>${new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"long",year:"numeric"})}</td></tr>
        <tr><td>Protocolo</td><td>Auditor Scout v3.0 · ${qs.length} criterios evaluados</td></tr>
      </table>
    </div>
    <div class="score-box">
      <div class="score-n">${result.score}</div>
      <div style="font-size:10px;color:#555;margin-top:4px;">/100 PUNTOS DE BLINDAJE</div>
      <div class="score-l">${risk.label}</div>
      <div class="verdict">${risk.short}</div>
    </div>
    <div style="margin-bottom:24px;">
      <div class="section-title">Puntos de Quiebre Detectados (${result.flags.length})</div>
      ${result.flags.length===0 ? '<p style="font-size:11px;color:#2A7A44;padding:8px 0;">✓ Sin puntos de quiebre detectados en esta evaluación.</p>' :
        result.flags.map(f => `<div class="flag${f.sev==="warn"?" warn":""}">
          <span class="flag-pts">${f.pts} pts</span>
          <div class="flag-q">${f.q}</div>
          <div class="flag-a">${f.ans}</div>
          <div class="flag-s">${f.src||""}</div>
        </div>`).join("")}
    </div>
    <div class="footer">
      <div style="color:#B8860B50;font-size:8px;letter-spacing:2px;margin-bottom:6px;">SAFEGUARD PRO · PRIVATE INVESTMENT VAULT 2026</div>
      Este reporte tiene carácter informativo y educativo. No constituye asesoría legal, financiera ni fiscal. Los criterios se basan en estándares de CNBV, SEC, IOSCO, Chainalysis y FBI IC3 Report 2025. Consulte a un abogado certificado antes de tomar decisiones de inversión.
    </div>
    <script>window.onload=()=>window.print();</script>
    </body></html>`);
  };

  return (
    <section id="auditor" style={{ background: T.bg1, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div className="wrap" style={{ padding: "96px 28px" }}>
        <R>
          <span className="eyebrow" style={{ marginBottom: 14 }}>El Auditor Patrimonial</span>
          <div className="serif" style={{ fontSize: "clamp(24px,4vw,40px)", color: T.ivory, marginBottom: 12, lineHeight: 1.2 }}>
            15 criterios. Un veredicto que no miente.
          </div>
          <p style={{ color: T.ivoryDim, fontSize: 11, marginBottom: 52, maxWidth: 480 }}>
            Cada pregunta pondera el mismo criterio que un abogado especialista aplica antes de autorizar una inversión de capital privado.
          </p>
        </R>

        <div className="card card-active scan-wrap" style={{ maxWidth: 680, padding: 0 }}>
          {/* Top bar */}
          {phase === "questions" && (
            <div>
              <div style={{ height: 2, background: T.bg3 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div style={{ padding: "16px 28px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="eyebrow" style={{ margin: 0 }}>{name || TYPE_META[type]?.label} · {curr + 1} / {qs.length}</span>
                <span style={{ fontSize: 9, color: T.gold }}>{Math.round(progress)}%</span>
              </div>
            </div>
          )}

          <div style={{ padding: "36px 32px" }}>
            {/* TYPE SELECT */}
            {phase === "type" && (
              <div style={{ animation: "fadeUp .45s ease" }}>
                <span className="eyebrow" style={{ marginBottom: 18 }}>Protocolo — Paso 1 de 3</span>
                <div className="serif" style={{ fontSize: 20, color: T.ivory, marginBottom: 28 }}>¿Qué instrumento vas a auditar?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(TYPE_META).map(([id, meta]) => (
                    <button key={id} className="opt-btn" onClick={() => selectType(id)}>
                      <span style={{ color: T.gold, fontSize: 16 }}>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* NAME */}
            {phase === "name" && (
              <div style={{ animation: "fadeUp .45s ease" }}>
                <span className="eyebrow" style={{ marginBottom: 18 }}>Protocolo — Paso 2 de 3</span>
                <div className="serif" style={{ fontSize: 20, color: T.ivory, marginBottom: 8 }}>¿Cuál es el nombre del instrumento?</div>
                <p style={{ fontSize: 10, color: T.ivoryDim, marginBottom: 24 }}>Nombre del proyecto, fondo o token que vas a evaluar</p>
                <input type="text" placeholder={`Ej: ${type === "realestate" ? "Torres Platino Residencial" : type === "fund" ? "Alpha Capital Fund" : "ProInvest Token"}`}
                  value={name} onChange={e => setName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && name.trim() && startQ()}
                  style={{ marginBottom: 12, fontSize: "14px !important" }} autoFocus />

                <input
                  type="text"
                  placeholder="Nombre del cliente"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  style={{ marginBottom: 12, fontSize: "14px !important" }}
                />

                <input
                  type="text"
                  placeholder="Correo electrónico"
                  value={clientEmail}
                  onChange={e => setClientEmail(e.target.value)}
                  style={{ marginBottom: 20, fontSize: "14px !important" }}
                />

                <button className="btn-gold" onClick={startQ} disabled={!name.trim()} style={{ width: "100%" }}>
                  INICIAR EVALUACIÓN →
                </button>
              </div>
            )}

            {/* QUESTIONS */}
            {phase === "questions" && (
              <div style={{ animation: "fadeIn .3s ease" }}>
                <div className="card" style={{ padding: 20, marginBottom: 20, border: `1px solid ${T.borderMd}` }}>
                  <div className="serif" style={{ fontSize: 17, color: T.ivory, lineHeight: 1.55 }}>
                    {qs[curr].text}
                  </div>
                  {qs[curr].src && (
                    <div style={{ fontSize: 7, color: T.smoke, marginTop: 8, letterSpacing: .5 }}>Base: {qs[curr].src}</div>
                  )}
                </div>

                {alert && (
                  <div className={`alert-${alert.sev}`} style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{alert.sev === "danger" ? "⚠" : "◈"}</span>
                    <span style={{ fontSize: 10, color: alert.sev === "danger" ? T.dangerLt : T.warnLt, lineHeight: 1.7 }}>{alert.msg}</span>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {qs[curr].opts.map((opt, oi) => {
                    const isDanger = oi === 2 || (oi === 1 && (qs[curr].w[1] || 0) <= -20);
                    const isWarn   = oi === 1 && (qs[curr].w[1] || 0) < -5 && !isDanger;
                    const sel      = answers[curr] === oi;
                    let cls = "opt-btn";
                    if (isDanger) cls += " danger";
                    else if (isWarn) cls += " warn";
                    if (sel) cls += " selected";
                    return (
                      <button key={oi} className={cls} onClick={() => selectAnswer(oi)}>
                        <span style={{ width: 16, height: 16, border: `1.5px solid ${sel ? (isDanger ? T.dangerLt : T.gold) : T.smoke}`, borderRadius: "50%", flexShrink: 0, background: sel ? (isDanger ? T.dangerLt : T.gold) : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {sel && <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.bg }} />}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn-ghost" onClick={goPrev} disabled={curr === 0} style={{ flex: 1, fontSize: 8 }}>← ANTERIOR</button>
                  <button className="btn-gold"  onClick={goNext} disabled={!canNext} style={{ flex: 2, fontSize: 10 }}>
                    {curr === qs.length - 1 ? "VER VEREDICTO →" : "SIGUIENTE →"}
                  </button>
                </div>
              </div>
            )}

            {/* RESULT */}
            {phase === "result" && result && (
              <div style={{ animation: "fadeUp .5s ease" }}>
                {(() => {
                  const risk = riskOf(result.score);
                  return (
                    <>
                      <span className="eyebrow" style={{ marginBottom: 6 }}>Veredicto del Auditor Patrimonial</span>
                      <div className="serif" style={{ fontSize: 14, color: T.ivoryDim, marginBottom: 28 }}>{name}</div>

                      {/* Score */}
                      <div style={{ display: "flex", justifyContent: "center", gap: 40, alignItems: "center", padding: "28px 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, marginBottom: 24, flexWrap: "wrap" }}>
                        <Thermometer score={result.score} />
                        <div style={{ textAlign: "center" }}>
                          <div className="serif" style={{ fontSize: "clamp(52px,10vw,72px)", fontWeight: 700, color: risk.color, lineHeight: 1 }}>{result.score}</div>
                          <div style={{ fontSize: 8, color: T.ivoryDim, letterSpacing: 2, marginTop: 6 }}>/100 PUNTOS DE BLINDAJE</div>
                          <div style={{ marginTop: 14 }}>
                            <span className={`tag tag-${risk.tag}`} style={{ fontSize: 10, padding: "5px 16px" }}>{risk.label}</span>
                          </div>
                        </div>
                      </div>

                      <p style={{ fontSize: 11, color: T.ivoryMd, lineHeight: 1.85, marginBottom: 20, fontStyle: "italic" }}>{risk.short}</p>

                      {saving && (
                        <div className="alert-warn" style={{ marginBottom: 16 }}>
                          <span style={{ fontSize: 13 }}>◈</span>
                          <span style={{ fontSize: 10, color: T.warnLt, lineHeight: 1.7 }}>
                            Guardando auditoría en Supabase...
                          </span>
                        </div>
                      )}

                      {saved && (
                        <div className="alert-warn" style={{ marginBottom: 16 }}>
                          <span style={{ fontSize: 13 }}>✓</span>
                          <span style={{ fontSize: 10, color: T.safeLt, lineHeight: 1.7 }}>
                            Auditoría guardada correctamente.
                          </span>
                        </div>
                      )}

                      {saveError && (
                        <div className="alert-danger" style={{ marginBottom: 16 }}>
                          <span style={{ fontSize: 13 }}>⚠</span>
                          <span style={{ fontSize: 10, color: T.dangerLt, lineHeight: 1.7 }}>
                            No se pudo guardar la auditoría: {saveError}
                          </span>
                        </div>
                      )}

                      {/* Criticals */}
                      {result.criticals.length > 0 && (
                        <div style={{ marginBottom: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                          {result.criticals.map((c, i) => (
                            <div key={i} className={`alert-${c.sev}`}>
                              <span style={{ fontSize: 13, flexShrink: 0 }}>⚠</span>
                              <span style={{ fontSize: 10, color: c.sev === "danger" ? T.dangerLt : T.warnLt, lineHeight: 1.7 }}>{c.msg}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Flags */}
                      {result.flags.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                          <span className="eyebrow" style={{ marginBottom: 12 }}>Puntos de Quiebre Detectados ({result.flags.length})</span>
                          {result.flags.map((f, i) => (
                            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "14px 0", borderBottom: i < result.flags.length - 1 ? `1px solid ${T.border}` : "none", gap: 14, animation: `fadeUp .3s ease ${i*.06}s both` }}>
                              <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 5, flexWrap: "wrap" }}>
                                  <span className={`tag tag-${f.sev === "danger" ? "danger" : "warn"}`}>{f.sev === "danger" ? "● CRÍTICO" : "◈ ALERTA"}</span>
                                </div>
                                <div style={{ fontSize: 9, color: T.ivoryDim, marginBottom: 3 }}>{f.q}</div>
                                <div style={{ fontSize: 10, color: T.ivory }}>{f.ans}</div>
                                {f.src && <div style={{ fontSize: 7, color: T.smoke, marginTop: 3, letterSpacing: .5 }}>{f.src}</div>}
                              </div>
                              <div style={{ color: f.sev === "danger" ? T.dangerLt : T.warnLt, fontSize: 14, fontWeight: 500, flexShrink: 0 }}>{f.pts}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {result.flags.length === 0 && (
                        <div style={{ textAlign: "center", padding: "20px 0", marginBottom: 20 }}>
                          <div style={{ fontSize: 24, color: T.safeLt, marginBottom: 8 }}>✓</div>
                          <div style={{ fontSize: 10, letterSpacing: 2, color: T.safeLt }}>SIN PUNTOS DE QUIEBRE</div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <button className="btn-gold" onClick={openReport} style={{ width: "100%", fontSize: 10 }}>
                          DESCARGAR REPORTE DE BLINDAJE
                        </button>
                        <button className="btn-ghost" onClick={reset} style={{ width: "100%", fontSize: 8 }}>
                          NUEVA AUDITORÍA
                        </button>
                      </div>

                      {/* VIP nudge */}
                      {result.score < 70 && (
                        <div style={{ marginTop: 20, background: T.bg3, border: `1px solid ${T.goldBrd}`, borderRadius: 2, padding: 18 }}>
                          <span className="eyebrow" style={{ marginBottom: 6 }}>Protocolo de seguimiento</span>
                          <div className="serif" style={{ fontSize: 14, color: T.ivory, marginBottom: 6 }}>Auditoría Legal VIP</div>
                          <p style={{ fontSize: 9, color: T.ivoryDim, lineHeight: 1.8, marginBottom: 14 }}>Dictamen escrito por abogado especialista · 48 horas · Desde $500 USD</p>
                          <button className="btn-gold" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })} style={{ width: "100%", fontSize: 9, animation: "none" }}>
                            SOLICITAR AUDITORÍA VIP →
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FOUNDER LETTER
══════════════════════════════════════════════════════ */
function FounderLetter() {
  return (
    <section id="legado" style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="wrap-sm" style={{ padding: "104px 28px" }}>
        <R>
          <span className="eyebrow" style={{ marginBottom: 20 }}>Carta del Fundador</span>
        </R>
        <div className="g2" style={{ gap: 56, alignItems: "start" }}>
          <div>
            <R delay={1}>
              <h2 className="serif" style={{ fontSize: "clamp(22px,4vw,36px)", color: T.ivory, fontWeight: 400, lineHeight: 1.3, marginBottom: 28 }}>
                He visto patrimonios familiares desaparecer<br /><em style={{ color: T.gold }}>por una sola firma.</em>
              </h2>
              <div style={{ width: 36, height: 1, background: T.goldBrd, marginBottom: 28 }} />
            </R>
            <R delay={2}>
              <p style={{ fontSize: 12, color: T.ivoryMd, lineHeight: 2.05, marginBottom: 18 }}>
                No permitas que el entusiasmo nuble tu juicio. Esa es la única ventana que necesita un estafador: el momento en que tu emoción supera tu protocolo.
              </p>
              <p style={{ fontSize: 12, color: T.ivoryMd, lineHeight: 2.05, marginBottom: 18 }}>
                Expediente tras expediente, la historia es la misma. Una familia que construyó su patrimonio durante veinte años. Una oportunidad que se veía sólida. Una firma. Y después, el silencio del promotor.
              </p>
              <p style={{ fontSize: 12, color: T.ivoryMd, lineHeight: 2.05 }}>
                SafeGuard Pro es mi experiencia de vida a tu servicio. El sistema que mis clientes necesitaron antes de firmar, convertido en un protocolo que puedes ejecutar tú mismo.
              </p>
            </R>
          </div>
          <div>
            <R delay={2}>
              <div className="card" style={{ padding: 28, marginBottom: 20 }}>
                <span className="bq-mark">"</span>
                <p className="serif" style={{ fontSize: 15, color: T.ivory, lineHeight: 1.75, fontStyle: "italic", marginBottom: 20 }}>
                  SafeGuard Pro no es software. Es el blindaje que construí para mis clientes, automatizado para que ningún inversor serio entre a firmar sin él.
                </p>
                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                  <div style={{ fontSize: 9, color: T.gold, letterSpacing: 2 }}>EL ESTRATEGA</div>
                  <div style={{ fontSize: 9, color: T.smoke, marginTop: 3 }}>Fundador · SafeGuard Pro · Especialista en Derecho Financiero</div>
                </div>
              </div>
            </R>
            <R delay={3}>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Metodología", "Criterios CNBV, SEC, IOSCO y FBI IC3 2025"],
                  ["Cobertura", "Preventa inmobiliaria, fondos privados y criptoactivos"],
                  ["Protocolo", "15 criterios ponderados por categoría de inversión"],
                  ["Entregable", "Reporte de blindaje descargable con fuentes regulatorias"],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", gap: 16, fontSize: 10, paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                    <span style={{ color: T.smoke, flexShrink: 0, minWidth: 90 }}>{l}</span>
                    <span style={{ color: T.ivoryMd }}>{v}</span>
                  </div>
                ))}
              </div>
            </R>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   THE VAULT
══════════════════════════════════════════════════════ */
function Vault() {
  const [open, setOpen] = useState(null);

  const modules = [
    {
      id: "preventa", tag: "Módulo I", locked: false,
      title: "Lo que el desarrollador no quiere que preguntes",
      desc: "El interrogatorio exacto que revela si una preventa es un activo real o una estructura diseñada para colapsar.",
      items: [
        { q: "¿Cuál es el número de contrato del fideicomiso y en qué banco está constituido?", note: "Sin fideicomiso, tus recursos no tienen protección legal. Punto de quiebre absoluto.", sev: "danger" },
        { q: "¿Puedo ver el folio registral del terreno en el Registro Público hoy mismo?", note: "Sin registro, el emisor puede vender la misma unidad a múltiples compradores.", sev: "danger" },
        { q: "¿Cuáles son sus tres proyectos previos y puedo hablar directamente con compradores?", note: "Primer proyecto sin historial = 25 puntos de riesgo sobre 100.", sev: "warn" },
        { q: "¿El contrato incluye penalidades específicas si no entregas en la fecha exacta pactada?", note: "Sin penalidad ejecutable, el desarrollador no tiene incentivo legal para cumplir.", sev: "warn" },
        { q: "¿Puedo visitar el terreno esta semana con mi ingeniero de confianza?", note: "Negativa de acceso indica que el desarrollo no existe en el estado prometido.", sev: "danger" },
      ],
    },
    {
      id: "clausulas", tag: "Módulo II", locked: true,
      title: "Las 6 Cláusulas de Hierro",
      desc: "Redactadas en lenguaje legal ejecutable. Seis disposiciones contractuales que deben existir antes de que firmes cualquier instrumento de inversión.",
      preview: ["Fideicomiso de Garantía con condiciones de liberación certificadas", "Auditoría Independiente irrenunciable con acceso irrestricto", "Condiciones de Salida sin penalización discrecional", "Prohibición explícita de Esquema Piramidal (Art. 388 Bis CPF)", "Rendimiento condicionado y no garantizado — base legal", "Jurisdicción, foro y garantías reales ejecutables"],
    },
    {
      id: "confrontacion", tag: "Módulo III", locked: true,
      title: "El Arte de Decir 'No' en Derecho Estratégico",
      desc: "Scripts palabra por palabra, desde la posición del inversor profesional, que obligan al promotor a documentar su legitimidad o a revelar su naturaleza.",
      preview: ["Script de Due Diligence del Inversor Profesional", "Prueba de Liquidez en 48 horas", "Solicitud Formal de Reembolso con efectos legales", "Protocolo de Denuncia Escalonada: PROFECO → CNBV → FGR"],
    },
    {
      id: "salida", tag: "Módulo IV", locked: true,
      title: "Protocolo de Salida de Emergencia",
      desc: "Si ya invertiste y algo dejó de cuadrar. Ocho pasos en orden, con scripts y referencias regulatorias, para maximizar la recuperación.",
      preview: ["Documentación de emergencia: qué preservar en las primeras 24 horas", "Script de solicitud formal de reembolso con efectos legales", "Secuencia de denuncias: PROFECO → CNBV → UIF → FGR", "Acción civil paralela y medidas cautelares sobre activos"],
    },
  ];

  return (
    <section id="vault" style={{ background: T.bg1, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div className="wrap" style={{ padding: "104px 28px" }}>
        <R>
          <span className="eyebrow" style={{ marginBottom: 14 }}>The Vault</span>
          <div className="serif" style={{ fontSize: "clamp(24px,4vw,40px)", color: T.ivory, maxWidth: 560, lineHeight: 1.2, marginBottom: 14 }}>
            El conocimiento que distingue al inversor de la víctima.
          </div>
          <p style={{ color: T.ivoryDim, fontSize: 11, marginBottom: 56, maxWidth: 480, lineHeight: 1.9 }}>
            Cuatro módulos construidos desde adentro del proceso legal. No teoría. Protocolos ejecutables.
          </p>
        </R>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {modules.map((m, mi) => (
            <R key={m.id} d={mi % 3}>
              <div className={`card card-vault`} style={{ border: open === m.id ? `1px solid ${T.goldBrdMd}` : undefined }}>
                <div onClick={() => !m.locked && setOpen(open === m.id ? null : m.id)}
                  style={{ padding: "26px 28px", cursor: m.locked ? "default" : "pointer", display: "flex", alignItems: "flex-start", gap: 20, justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                      <span className="tag tag-gold">{m.tag}</span>
                      {m.locked && <span className="tag" style={{ background: T.bg3, color: T.smoke, border: `1px solid ${T.border}`, fontSize: 7 }}>🔒 ACCESO EXCLUSIVO</span>}
                    </div>
                    <div className="serif" style={{ fontSize: 18, color: T.ivory, marginBottom: 6 }}>{m.title}</div>
                    <div style={{ fontSize: 10, color: T.smoke, lineHeight: 1.7 }}>{m.desc}</div>
                  </div>
                  {!m.locked && (
                    <div style={{ color: T.gold, fontSize: 22, flexShrink: 0, marginTop: 4, lineHeight: 1 }}>{open === m.id ? "−" : "+"}</div>
                  )}
                </div>

                {!m.locked && open === m.id && (
                  <div style={{ borderTop: `1px solid ${T.border}`, padding: "4px 28px 24px", animation: "fadeUp .3s ease" }}>
                    {m.items?.map((item, ii) => (
                      <div key={ii} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: ii < m.items.length - 1 ? `1px solid ${T.border}` : "none", alignItems: "flex-start" }}>
                        <div style={{ width: 22, height: 22, borderRadius: "50%", background: item.sev === "danger" ? T.dangerDim : T.warnDim, border: `1px solid ${item.sev === "danger" ? T.danger + "50" : T.warn + "50"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: item.sev === "danger" ? T.dangerLt : T.warnLt, flexShrink: 0, marginTop: 1 }}>?</div>
                        <div>
                          <div style={{ fontSize: 12, color: T.ivory, marginBottom: 5 }}>{item.q}</div>
                          <div style={{ fontSize: 9, color: item.sev === "danger" ? T.dangerLt : T.warnLt, lineHeight: 1.6 }}>{item.note}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {m.locked && (
                  <div style={{ borderTop: `1px solid ${T.border}` }}>
                    <div className="locked-fade" style={{ padding: "8px 28px 0" }}>
                      {m.preview.map((p, pi) => (
                        <div key={pi} style={{ display: "flex", gap: 10, padding: "11px 0", borderBottom: `1px solid ${T.border}`, alignItems: "center", opacity: Math.max(0.15, 1 - pi * 0.18) }}>
                          <span style={{ color: T.goldBrd, fontSize: 10 }}>›</span>
                          <span style={{ fontSize: 11, color: T.ivoryMd }}>{p}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "20px 28px 24px", textAlign: "center" }}>
                      <button className="btn-gold" style={{ fontSize: 9, padding: "11px 28px", animation: "none", boxShadow: "none" }}
                        onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
                        DESBLOQUEAR CON SAFEGUARD PRO →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════ */
function Testimonials() {
  const data = [
    { q: "Recibí una preventa con renders impecables y un promotor carismático. El Auditor marcó cuatro puntos de quiebre. Investigué. La empresa no existía en el Registro Público. Tenía $480,000 pesos listos para transferir.", role: "Director de Operaciones", loc: "Guadalajara, MX", saved: "$480,000 MXN" },
    { q: "El fondo prometía 8% mensual con 'estrategia propietaria'. Ya había calculado mi retiro con esos números. El diagnóstico fue claro en treinta segundos: patrón Ponzi confirmado. El fondo colapsó cuatro meses después.", role: "Médico Especialista", loc: "Ciudad de México", saved: "$1,200,000 MXN" },
    { q: "La cláusula de retiro decía 'a discreción del administrador'. No lo había notado. SafeGuard Pro lo marcó en rojo. Nunca firmé. Seis meses después el club colapsó con 340 inversores adentro.", role: "Ingeniero Industrial", loc: "Monterrey, MX", saved: "$320,000 MXN" },
  ];
  return (
    <section style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="wrap" style={{ padding: "104px 28px" }}>
        <R>
          <span className="eyebrow" style={{ marginBottom: 14 }}>Blindaje Comprobado</span>
          <div className="serif" style={{ fontSize: "clamp(22px,4vw,38px)", color: T.ivory, maxWidth: 480, lineHeight: 1.25, marginBottom: 16 }}>
            No "gané más".<br /><em style={{ color: T.gold }}>Evité perder lo que tardé décadas en construir.</em>
          </div>
          <p style={{ color: T.ivoryDim, fontSize: 11, marginBottom: 56, maxWidth: 400 }}>
            El valor de SafeGuard Pro no se mide en retornos. Se mide en pérdidas que nunca ocurrieron.
          </p>
        </R>
        <div className="g3">
          {data.map((t, i) => (
            <R key={i} d={i % 3}>
              <div className="card card-vault" style={{ padding: 28, height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ flex: 1 }}>
                  <span className="bq-mark" style={{ fontSize: 56 }}>"</span>
                  <p className="serif" style={{ fontSize: 14, color: T.ivoryMd, lineHeight: 1.78, fontStyle: "italic", marginBottom: 22 }}>{t.q}</p>
                </div>
                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 16 }}>
                  <div style={{ fontSize: 10, color: T.ivory }}>{t.role}</div>
                  <div style={{ fontSize: 9, color: T.smoke, marginTop: 3 }}>{t.loc}</div>
                  <div style={{ marginTop: 12 }}>
                    <span className="tag tag-safe">PROTEGIDO: {t.saved}</span>
                  </div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   PRICING
══════════════════════════════════════════════════════ */
function Pricing() {
  const includes = [
    "Auditor Scout completo — 15 criterios por categoría",
    "Alertas de riesgo en tiempo real durante la evaluación",
    "Reporte de Blindaje descargable con fuentes regulatorias",
    "Módulo I — Lo que el desarrollador no quiere que preguntes",
    "Módulo II — Las 6 Cláusulas de Hierro (texto completo ejecutable)",
    "Módulo III — Manual de Confrontación con scripts legales",
    "Módulo IV — Protocolo de Salida de Emergencia (8 pasos)",
    "Base de alertas activas LATAM 2026",
    "Actualizaciones del protocolo incluidas",
  ];
  return (
    <section id="pricing" style={{ background: T.bg1, borderTop: `1px solid ${T.border}` }}>
      <div className="wrap-sm" style={{ padding: "104px 28px" }}>
        <R style={{ textAlign: "center", marginBottom: 52 }}>
          <span className="eyebrow" style={{ marginBottom: 16 }}>Acceso SafeGuard Pro</span>
          <div className="serif" style={{ fontSize: "clamp(24px,4vw,42px)", color: T.ivory, lineHeight: 1.2, marginBottom: 18 }}>
            El precio no es lo que pagas.<br />Es lo que evitas perder.
          </div>
          <p style={{ color: T.ivoryDim, fontSize: 12, maxWidth: 460, margin: "0 auto", lineHeight: 1.9 }}>
            Una consulta legal de emergencia post-fraude cuesta entre $15,000 y $80,000 pesos.<br />
            SafeGuard Pro cuesta $97 USD.
          </p>
        </R>

        <R delay={1}>
          <div className="card" style={{ border: `1px solid ${T.goldBrd}`, padding: "44px 40px", animation: "borderPulse 4s infinite" }}>
            <div className="g2" style={{ gap: 48, alignItems: "start" }}>
              <div>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ fontSize: 9, color: T.smoke, letterSpacing: 1, marginBottom: 10 }}>Inversión única · Acceso de por vida</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                    <span className="serif" style={{ fontSize: "clamp(56px,9vw,80px)", fontWeight: 700, color: T.goldLt, lineHeight: 1 }}>$97</span>
                    <span style={{ fontSize: 14, color: T.smoke }}>USD</span>
                  </div>
                  <div style={{ fontSize: 9, color: T.smoke, marginTop: 6 }}>Sin renovación · Sin suscripción</div>
                </div>
                <<button
                 cl.assName="btn-gold"
                 style={{ width: "100%", fontSize: 11, marginBottom: 14 }}
                 onClick={async () => {
                 const response = await fetch("/api/create-checkout-session", {
                  method: "POST",
                 });

                 const data = await response.json();

                 if (data.url) {
                 window.location.href = data.url;
                 } else {
                 alert("No se pudo iniciar el pago. Intenta de nuevo.");
                  }
                 }}
                  >
              
                  ACTIVAR MI BLINDAJE AHORA
                </button>
                <div style={{ fontSize: 8, color: T.smoke, textAlign: "center", lineHeight: 1.9, letterSpacing: .5 }}>
                  Pago seguro · Acceso inmediato<br />Garantía de Certeza Radical — 30 días
                </div>
              </div>
              <div>
                <span className="eyebrow" style={{ marginBottom: 16 }}>El Protocolo Incluye</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                  {includes.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, fontSize: 11, color: T.ivoryMd, alignItems: "flex-start", paddingBottom: 11, borderBottom: i < includes.length - 1 ? `1px solid ${T.border}` : "none" }}>
                      <span style={{ color: T.gold, flexShrink: 0, marginTop: 1, fontSize: 10 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </R>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   GUARANTEE
══════════════════════════════════════════════════════ */
function Guarantee() {
  return (
    <section id="guarantee" style={{ borderTop: `1px solid ${T.border}` }}>
      <div className="wrap-sm" style={{ padding: "104px 28px", textAlign: "center" }}>
        <R>
          <span className="eyebrow" style={{ marginBottom: 24 }}>La Garantía de Certeza Radical</span>
          <div style={{ width: 64, height: 64, border: `1px solid ${T.goldBrd}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 36px", background: T.goldDim }}>
            <span className="serif" style={{ fontSize: 26, color: T.gold }}>◈</span>
          </div>
          <div className="serif" style={{ fontSize: "clamp(20px,4vw,30px)", color: T.ivory, lineHeight: 1.4, marginBottom: 20 }}>
            "Si el Auditor no detecta al menos un riesgo que no habías identificado en tu inversión actual, te devuelvo tu dinero."
          </div>
          <div className="serif" style={{ fontSize: "clamp(16px,3vw,22px)", color: T.gold, fontStyle: "italic", marginBottom: 44, lineHeight: 1.4 }}>
            "Mi reputación como estratega legal vale más que tu suscripción."
          </div>
          <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
            {[["30 días", "Para aplicar el protocolo"],["Sin formularios", "Reembolso directo"],["Sin condiciones", "Tu criterio es el juez"]].map(([t, s]) => (
              <div key={t} style={{ textAlign: "center" }}>
                <div className="serif" style={{ fontSize: 20, color: T.gold, marginBottom: 5 }}>{t}</div>
                <div style={{ fontSize: 9, color: T.smoke, letterSpacing: .5 }}>{s}</div>
              </div>
            ))}
          </div>
          <button className="btn-gold" style={{ fontSize: 11 }}
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
            ACTIVAR MI BLINDAJE PATRIMONIAL
          </button>
        </R>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════════ */
function FAQ() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:"¿Este sistema reemplaza a un abogado?", a:"No. SafeGuard Pro es el filtro que determina si necesitas un abogado ahora o si puedes proceder. El 70% de las inversiones que pasan el Auditor no requieren consulta adicional. El 30% que no pasan te ahorran el costo de aprender después de firmar." },
    { q:"¿Funciona para inversiones fuera de México?", a:"El Auditor usa criterios de CNBV, SEC, IOSCO y Chainalysis, que cubren las principales jurisdicciones de LATAM. Las preguntas de estructura legal son universales: un fideicomiso mal constituido es una señal de riesgo en cualquier país." },
    { q:"¿Qué hago si ya invertí y detecto señales de alerta?", a:"El Módulo IV — Protocolo de Salida de Emergencia — está diseñado exactamente para ese momento. Ocho pasos, en orden, con scripts y referencias regulatorias. La velocidad importa: activa el protocolo antes de que el promotor detecte que reaccionaste." },
    { q:"¿Por qué $97 USD y no un servicio gratuito?", a:"Las herramientas gratuitas de análisis financiero no tienen costo para ti porque el producto eres tú. SafeGuard Pro no vende tu información ni te monetiza de ninguna otra forma. Lo que pagas es la metodología, no la plataforma." },
    { q:"¿Con qué frecuencia se actualiza la base de datos de alertas?", a:"El protocolo se actualiza trimestralmente con los informes de CONDUSEF, CNBV, Chainalysis y FBI IC3. Las actualizaciones están incluidas en el acceso de por vida sin costo adicional." },
  ];
  return (
    <section style={{ background: T.bg1, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}>
      <div className="wrap-sm" style={{ padding: "104px 28px" }}>
        <R>
          <span className="eyebrow" style={{ marginBottom: 14 }}>Preguntas sobre el Protocolo</span>
          <div className="serif" style={{ fontSize: "clamp(22px,4vw,36px)", color: T.ivory, marginBottom: 52, lineHeight: 1.25 }}>Las respuestas que necesitas<br />antes de decidir.</div>
        </R>
        {faqs.map((f, i) => (
          <R key={i} d={i % 3}>
            <div style={{ borderBottom: `1px solid ${T.border}` }}>
              <div onClick={() => setOpen(open === i ? null : i)} style={{ padding: "24px 0", cursor: "pointer", display: "flex", justifyContent: "space-between", gap: 20, alignItems: "center" }}>
                <div className="serif" style={{ fontSize: 16, color: T.ivory, lineHeight: 1.4 }}>{f.q}</div>
                <span style={{ color: T.gold, fontSize: 22, flexShrink: 0, lineHeight: 1 }}>{open === i ? "−" : "+"}</span>
              </div>
              {open === i && (
                <div style={{ paddingBottom: 24, animation: "fadeUp .3s ease" }}>
                  <p style={{ fontSize: 12, color: T.ivoryMd, lineHeight: 1.95 }}>{f.a}</p>
                </div>
              )}
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section style={{ borderTop: `1px solid ${T.border}`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 700, height: 400, background: `radial-gradient(ellipse at 50% 100%, ${T.goldDim}, transparent 70%)`, pointerEvents: "none" }} />
      <div className="wrap-sm" style={{ padding: "120px 28px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <R>
          <div className="serif" style={{ fontSize: "clamp(26px,5vw,50px)", color: T.ivory, lineHeight: 1.15, marginBottom: 20 }}>
            La próxima inversión que evalúes<br />merece este blindaje.
          </div>
          <p style={{ color: T.ivoryMd, fontSize: 13, maxWidth: 460, margin: "0 auto 44px", lineHeight: 2 }}>
            El due diligence no es una señal de desconfianza.<br />
            Es la firma de un inversor que sabe lo que hace.
          </p>
          <button className="btn-gold" style={{ fontSize: 12, padding: "18px 52px", marginBottom: 20 }}
            onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>
            ACTIVAR MI BLINDAJE PATRIMONIAL
          </button>
          <div style={{ fontSize: 9, color: T.smoke, letterSpacing: .8, marginTop: 16 }}>
            $97 USD · Acceso inmediato · Garantía de Certeza Radical — 30 días
          </div>
        </R>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer style={{ background: T.bg, borderTop: `1px solid ${T.border}`, padding: "36px 28px" }}>
      <div className="wrap" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
        <div>
          <span className="serif" style={{ color: T.gold, fontSize: 15, fontWeight: 700 }}>SafeGuard Pro</span>
          <div style={{ fontSize: 7, color: T.smoke, marginTop: 5, letterSpacing: 2 }}>PRIVATE INVESTMENT VAULT · 2026</div>
        </div>
        <div style={{ fontSize: 8, color: T.smoke, maxWidth: 500, lineHeight: 1.9, textAlign: "right" }}>
          Contenido de carácter educativo e informativo. No constituye asesoría legal, financiera ni fiscal. Los criterios se basan en estándares de CNBV, SEC, IOSCO, Chainalysis y FBI IC3 Report 2025. Consulte a un abogado certificado antes de tomar decisiones de inversión.
        </div>
      </div>
    </footer>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════ */
export default function SafeGuardPro() {
  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="grain">
        <Nav />
        <Hero />
        <AuditorEngine />
        <FounderLetter />
        <Vault />
        <Testimonials />
        <Pricing />
        <Guarantee />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </>
  );
}
