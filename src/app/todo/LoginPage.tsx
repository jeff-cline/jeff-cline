"use client";
import { useState, useRef } from "react";

interface Props {
  onLogin: (user: { name: string; email: string; role: string; userId: string }) => void;
}

function BrainIcon() {
  return (
    <svg width="100%" height="auto" viewBox="0 0 400 320" style={{ margin: "0 auto 0", display: "block", maxWidth: 380 }}>
      <defs>
        <filter id="glow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="glowBig"><feGaussianBlur stdDeviation="5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="smoke"><feGaussianBlur stdDeviation="6"/></filter>
      </defs>

      {/* === BACKGROUND SPARKING DOTS & CONNECTIONS === */}
      <g opacity="0.25">
        {/* Neural network dots */}
        <circle cx="50" cy="40" r="2" fill="#FF8900"><animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.1s" repeatCount="indefinite"/></circle>
        <circle cx="350" cy="50" r="1.5" fill="#FF8900"><animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.7s" repeatCount="indefinite"/></circle>
        <circle cx="30" cy="150" r="1.5" fill="#FF8900"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.8s" repeatCount="indefinite"/></circle>
        <circle cx="370" cy="140" r="2" fill="#FF8900"><animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.3s" repeatCount="indefinite"/></circle>
        <circle cx="60" cy="250" r="1" fill="#FF8900"><animate attributeName="opacity" values="0.2;0.6;0.2" dur="3s" repeatCount="indefinite"/></circle>
        <circle cx="340" cy="260" r="1.5" fill="#FF8900"><animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite"/></circle>
        <circle cx="20" cy="90" r="1" fill="#FF8900"><animate attributeName="opacity" values="0.1;0.6;0.1" dur="3.2s" repeatCount="indefinite"/></circle>
        <circle cx="380" cy="200" r="1" fill="#FF8900"><animate attributeName="opacity" values="0.2;0.7;0.2" dur="2.6s" repeatCount="indefinite"/></circle>
        {/* Connecting lines that spark */}
        <line x1="50" y1="40" x2="120" y2="80" stroke="#FF8900" strokeWidth="0.5"><animate attributeName="opacity" values="0;0.5;0" dur="3s" repeatCount="indefinite"/></line>
        <line x1="350" y1="50" x2="290" y2="75" stroke="#FF8900" strokeWidth="0.5"><animate attributeName="opacity" values="0;0.5;0" dur="3.5s" repeatCount="indefinite"/></line>
        <line x1="30" y1="150" x2="90" y2="170" stroke="#FF8900" strokeWidth="0.5"><animate attributeName="opacity" values="0;0.4;0" dur="2.5s" repeatCount="indefinite"/></line>
        <line x1="370" y1="140" x2="310" y2="160" stroke="#FF8900" strokeWidth="0.5"><animate attributeName="opacity" values="0;0.4;0" dur="2.8s" repeatCount="indefinite"/></line>
        <line x1="50" y1="40" x2="30" y2="150" stroke="#FF8900" strokeWidth="0.3"><animate attributeName="opacity" values="0;0.3;0" dur="4s" repeatCount="indefinite"/></line>
        <line x1="350" y1="50" x2="370" y2="140" stroke="#FF8900" strokeWidth="0.3"><animate attributeName="opacity" values="0;0.3;0" dur="4.2s" repeatCount="indefinite"/></line>
      </g>

      {/* === SMOKE / STEAM rising from head === */}
      <g filter="url(#smoke)" opacity="0.15">
        <circle cx="170" cy="30" r="12" fill="#FF8900">
          <animate attributeName="cy" values="50;15;50" dur="6s" repeatCount="indefinite"/>
          <animate attributeName="r" values="8;18;8" dur="6s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0;0.2" dur="6s" repeatCount="indefinite"/>
        </circle>
        <circle cx="220" cy="25" r="10" fill="#FF8900">
          <animate attributeName="cy" values="45;10;45" dur="5s" repeatCount="indefinite"/>
          <animate attributeName="r" values="6;16;6" dur="5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.15;0;0.15" dur="5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="195" cy="20" r="14" fill="#FF8900">
          <animate attributeName="cy" values="40;5;40" dur="7s" repeatCount="indefinite"/>
          <animate attributeName="r" values="10;22;10" dur="7s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0;0.2" dur="7s" repeatCount="indefinite"/>
        </circle>
        <circle cx="150" cy="35" r="8" fill="#FF8900">
          <animate attributeName="cy" values="55;20;55" dur="5.5s" repeatCount="indefinite"/>
          <animate attributeName="r" values="5;14;5" dur="5.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.15;0;0.15" dur="5.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="245" cy="32" r="9" fill="#FF8900">
          <animate attributeName="cy" values="48;12;48" dur="6.5s" repeatCount="indefinite"/>
          <animate attributeName="r" values="6;15;6" dur="6.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.18;0;0.18" dur="6.5s" repeatCount="indefinite"/>
        </circle>
      </g>

      {/* === COGS - spinning gears above head === */}
      {/* Large left cog */}
      <g filter="url(#glow)">
        <g transform="translate(130, 55)">
          <animateTransform attributeName="transform" type="rotate" from="0 130 55" to="360 130 55" dur="12s" repeatCount="indefinite" additive="sum"/>
          <circle cx="0" cy="0" r="22" fill="none" stroke="#FF8900" strokeWidth="1.5" opacity="0.6"/>
          <circle cx="0" cy="0" r="14" fill="none" stroke="#FF8900" strokeWidth="1" opacity="0.4"/>
          <circle cx="0" cy="0" r="4" fill="#FF8900" opacity="0.5"/>
          {/* Gear teeth */}
          {[0,45,90,135,180,225,270,315].map(a => <line key={a} x1={Math.cos(a*Math.PI/180)*18} y1={Math.sin(a*Math.PI/180)*18} x2={Math.cos(a*Math.PI/180)*26} y2={Math.sin(a*Math.PI/180)*26} stroke="#FF8900" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>)}
        </g>
      </g>

      {/* Medium right cog - counter-rotating */}
      <g filter="url(#glow)">
        <g transform="translate(275, 48)">
          <animateTransform attributeName="transform" type="rotate" from="360 275 48" to="0 275 48" dur="9s" repeatCount="indefinite" additive="sum"/>
          <circle cx="0" cy="0" r="17" fill="none" stroke="#FF8900" strokeWidth="1.2" opacity="0.5"/>
          <circle cx="0" cy="0" r="10" fill="none" stroke="#FF8900" strokeWidth="0.8" opacity="0.35"/>
          <circle cx="0" cy="0" r="3" fill="#FF8900" opacity="0.4"/>
          {[0,60,120,180,240,300].map(a => <line key={a} x1={Math.cos(a*Math.PI/180)*14} y1={Math.sin(a*Math.PI/180)*14} x2={Math.cos(a*Math.PI/180)*21} y2={Math.sin(a*Math.PI/180)*21} stroke="#FF8900" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>)}
        </g>
      </g>

      {/* Small top center cog */}
      <g filter="url(#glow)">
        <g transform="translate(200, 35)">
          <animateTransform attributeName="transform" type="rotate" from="0 200 35" to="360 200 35" dur="7s" repeatCount="indefinite" additive="sum"/>
          <circle cx="0" cy="0" r="11" fill="none" stroke="#FF8900" strokeWidth="1" opacity="0.5"/>
          <circle cx="0" cy="0" r="6" fill="none" stroke="#FF8900" strokeWidth="0.6" opacity="0.3"/>
          <circle cx="0" cy="0" r="2" fill="#FF8900" opacity="0.4"/>
          {[0,72,144,216,288].map(a => <line key={a} x1={Math.cos(a*Math.PI/180)*9} y1={Math.sin(a*Math.PI/180)*9} x2={Math.cos(a*Math.PI/180)*14} y2={Math.sin(a*Math.PI/180)*14} stroke="#FF8900" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>)}
        </g>
      </g>

      {/* Tiny cog upper left */}
      <g opacity="0.4">
        <g transform="translate(100, 40)">
          <animateTransform attributeName="transform" type="rotate" from="360 100 40" to="0 100 40" dur="5s" repeatCount="indefinite" additive="sum"/>
          <circle cx="0" cy="0" r="7" fill="none" stroke="#FF8900" strokeWidth="0.8"/>
          <circle cx="0" cy="0" r="1.5" fill="#FF8900"/>
          {[0,90,180,270].map(a => <line key={a} x1={Math.cos(a*Math.PI/180)*5.5} y1={Math.sin(a*Math.PI/180)*5.5} x2={Math.cos(a*Math.PI/180)*9} y2={Math.sin(a*Math.PI/180)*9} stroke="#FF8900" strokeWidth="1.5" strokeLinecap="round"/>)}
        </g>
      </g>

      {/* === FLAME HAIR - wild flickering fire === */}
      <g filter="url(#glow)">
        {/* Main flame strands - animated like fire */}
        <path d="M135 130 Q130 100 140 80 Q148 65 155 55 Q152 70 158 60 Q162 50 168 42" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.8">
          <animate attributeName="d" values="M135 130 Q130 100 140 80 Q148 65 155 55 Q152 70 158 60 Q162 50 168 42;M135 130 Q128 98 138 78 Q146 62 152 50 Q150 68 156 56 Q160 46 165 38;M135 130 Q130 100 140 80 Q148 65 155 55 Q152 70 158 60 Q162 50 168 42" dur="1.5s" repeatCount="indefinite"/>
        </path>
        <path d="M155 125 Q150 95 158 72 Q164 55 170 40 Q168 58 174 45 Q178 35 182 28" fill="none" stroke="#FF8900" strokeWidth="1.8" opacity="0.7">
          <animate attributeName="d" values="M155 125 Q150 95 158 72 Q164 55 170 40 Q168 58 174 45 Q178 35 182 28;M155 125 Q148 92 155 68 Q162 52 167 36 Q166 55 171 41 Q176 30 179 24;M155 125 Q150 95 158 72 Q164 55 170 40 Q168 58 174 45 Q178 35 182 28" dur="1.8s" repeatCount="indefinite"/>
        </path>
        <path d="M180 120 Q176 88 182 65 Q188 48 195 32 Q192 52 198 38 Q202 25 205 18" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.9">
          <animate attributeName="d" values="M180 120 Q176 88 182 65 Q188 48 195 32 Q192 52 198 38 Q202 25 205 18;M180 120 Q174 85 180 60 Q186 44 192 28 Q190 48 196 34 Q200 22 202 14;M180 120 Q176 88 182 65 Q188 48 195 32 Q192 52 198 38 Q202 25 205 18" dur="1.3s" repeatCount="indefinite"/>
        </path>
        <path d="M200 118 Q198 82 202 58 Q206 40 200 22 Q204 45 208 30 Q210 20 206 12" fill="none" stroke="#FF8900" strokeWidth="2.2" opacity="0.9">
          <animate attributeName="d" values="M200 118 Q198 82 202 58 Q206 40 200 22 Q204 45 208 30 Q210 20 206 12;M200 118 Q196 80 200 55 Q204 36 198 18 Q202 42 206 26 Q208 16 204 8;M200 118 Q198 82 202 58 Q206 40 200 22 Q204 45 208 30 Q210 20 206 12" dur="1.6s" repeatCount="indefinite"/>
        </path>
        <path d="M220 120 Q224 88 218 65 Q212 48 205 32 Q208 52 202 38 Q198 25 195 18" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.9">
          <animate attributeName="d" values="M220 120 Q224 88 218 65 Q212 48 205 32 Q208 52 202 38 Q198 25 195 18;M220 120 Q226 85 220 60 Q214 44 208 28 Q210 48 204 34 Q200 22 198 14;M220 120 Q224 88 218 65 Q212 48 205 32 Q208 52 202 38 Q198 25 195 18" dur="1.4s" repeatCount="indefinite"/>
        </path>
        <path d="M245 125 Q250 95 242 72 Q236 55 230 40 Q232 58 226 45 Q222 35 218 28" fill="none" stroke="#FF8900" strokeWidth="1.8" opacity="0.7">
          <animate attributeName="d" values="M245 125 Q250 95 242 72 Q236 55 230 40 Q232 58 226 45 Q222 35 218 28;M245 125 Q252 92 245 68 Q238 52 233 36 Q234 55 229 41 Q224 30 221 24;M245 125 Q250 95 242 72 Q236 55 230 40 Q232 58 226 45 Q222 35 218 28" dur="1.7s" repeatCount="indefinite"/>
        </path>
        <path d="M265 130 Q270 100 260 80 Q252 65 245 55 Q248 70 242 60 Q238 50 232 42" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.8">
          <animate attributeName="d" values="M265 130 Q270 100 260 80 Q252 65 245 55 Q248 70 242 60 Q238 50 232 42;M265 130 Q272 98 262 78 Q254 62 248 50 Q250 68 244 56 Q240 46 235 38;M265 130 Q270 100 260 80 Q252 65 245 55 Q248 70 242 60 Q238 50 232 42" dur="1.5s" repeatCount="indefinite"/>
        </path>
        {/* Inner glow flames */}
        <path d="M170 115 Q168 90 175 70 Q180 55 185 42" fill="none" stroke="#FFAA33" strokeWidth="1" opacity="0.5">
          <animate attributeName="d" values="M170 115 Q168 90 175 70 Q180 55 185 42;M170 115 Q166 87 173 66 Q178 52 182 38;M170 115 Q168 90 175 70 Q180 55 185 42" dur="1.2s" repeatCount="indefinite"/>
        </path>
        <path d="M230 115 Q232 90 225 70 Q220 55 215 42" fill="none" stroke="#FFAA33" strokeWidth="1" opacity="0.5">
          <animate attributeName="d" values="M230 115 Q232 90 225 70 Q220 55 215 42;M230 115 Q234 87 227 66 Q222 52 218 38;M230 115 Q232 90 225 70 Q220 55 215 42" dur="1.3s" repeatCount="indefinite"/>
        </path>
      </g>

      {/* === BRAIN COGS inside head between hair and glasses === */}
      <g filter="url(#glow)" opacity="0.5">
        {/* Left brain cog */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 165 108" to="360 165 108" dur="8s" repeatCount="indefinite"/>
          <circle cx="165" cy="108" r="12" fill="none" stroke="#FF8900" strokeWidth="1"/>
          <circle cx="165" cy="108" r="3" fill="#FF8900" opacity="0.6"/>
          {[0,60,120,180,240,300].map(a => <line key={a} x1={165+Math.cos(a*Math.PI/180)*10} y1={108+Math.sin(a*Math.PI/180)*10} x2={165+Math.cos(a*Math.PI/180)*15} y2={108+Math.sin(a*Math.PI/180)*15} stroke="#FF8900" strokeWidth="2.5" strokeLinecap="round"/>)}
        </g>
        {/* Right brain cog - counter */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="360 235 108" to="0 235 108" dur="8s" repeatCount="indefinite"/>
          <circle cx="235" cy="108" r="12" fill="none" stroke="#FF8900" strokeWidth="1"/>
          <circle cx="235" cy="108" r="3" fill="#FF8900" opacity="0.6"/>
          {[0,60,120,180,240,300].map(a => <line key={a} x1={235+Math.cos(a*Math.PI/180)*10} y1={108+Math.sin(a*Math.PI/180)*10} x2={235+Math.cos(a*Math.PI/180)*15} y2={108+Math.sin(a*Math.PI/180)*15} stroke="#FF8900" strokeWidth="2.5" strokeLinecap="round"/>)}
        </g>
        {/* Small center cog */}
        <g>
          <animateTransform attributeName="transform" type="rotate" from="0 200 105" to="360 200 105" dur="5s" repeatCount="indefinite"/>
          <circle cx="200" cy="105" r="7" fill="none" stroke="#FF8900" strokeWidth="0.8"/>
          <circle cx="200" cy="105" r="2" fill="#FF8900" opacity="0.5"/>
          {[0,90,180,270].map(a => <line key={a} x1={200+Math.cos(a*Math.PI/180)*5.5} y1={105+Math.sin(a*Math.PI/180)*5.5} x2={200+Math.cos(a*Math.PI/180)*9} y2={105+Math.sin(a*Math.PI/180)*9} stroke="#FF8900" strokeWidth="1.5" strokeLinecap="round"/>)}
        </g>
      </g>

      {/* Forehead line */}
      <path d="M135 132 Q155 124 200 122 Q245 124 265 132" fill="none" stroke="#FF8900" strokeWidth="1.2" opacity="0.5"/>

      {/* === GLASSES - browline/clubmaster style === */}
      <g filter="url(#glow)">
        {/* Left lens - thick top browline, thin wire bottom */}
        <path d="M130 148 L130 145 Q130 140 135 140 L188 140 Q192 140 192 145 L192 148" fill="none" stroke="#FF8900" strokeWidth="3" opacity="0.9"/>
        <path d="M130 148 Q128 170 135 180 Q142 188 161 188 Q180 188 187 180 Q192 170 192 148" fill="none" stroke="#FF8900" strokeWidth="1.2" opacity="0.7"/>
        {/* Right lens - thick top browline, thin wire bottom */}
        <path d="M208 148 L208 145 Q208 140 213 140 L265 140 Q270 140 270 145 L270 148" fill="none" stroke="#FF8900" strokeWidth="3" opacity="0.9"/>
        <path d="M208 148 Q206 170 213 180 Q220 188 239 188 Q258 188 265 180 Q270 170 270 148" fill="none" stroke="#FF8900" strokeWidth="1.2" opacity="0.7"/>
        {/* Bridge - small nose pads */}
        <path d="M192 152 Q200 148 208 152" fill="none" stroke="#FF8900" strokeWidth="1.5" opacity="0.7"/>
        {/* Nose pads */}
        <circle cx="194" cy="155" r="2" fill="none" stroke="#FF8900" strokeWidth="0.8" opacity="0.5"/>
        <circle cx="206" cy="155" r="2" fill="none" stroke="#FF8900" strokeWidth="0.8" opacity="0.5"/>
        {/* Temple arms - with pattern detail at tips */}
        <path d="M130 145 L105 142 L88 144" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.7"/>
        <path d="M270 145 L295 142 L312 144" fill="none" stroke="#FF8900" strokeWidth="2" opacity="0.7"/>
        {/* Decorative temple pattern (like the orange pattern on the actual glasses) */}
        <rect x="85" y="141" width="12" height="6" rx="1" fill="none" stroke="#FF8900" strokeWidth="0.8" opacity="0.4"/>
        <rect x="303" y="141" width="12" height="6" rx="1" fill="none" stroke="#FF8900" strokeWidth="0.8" opacity="0.4"/>
      </g>

      {/* === EYES - bright blue contrasting against orange === */}
      <g filter="url(#glowBig)">
        {/* Left eye */}
        <circle cx="161" cy="164" r="18" fill="#0a0a0a"/>
        <circle cx="161" cy="164" r="13" fill="#1a6bb5" opacity="0.9">
          <animate attributeName="r" values="13;12;13" dur="4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="161" cy="164" r="9" fill="#2E9BF0">
          <animate attributeName="r" values="9;8;9" dur="4s" repeatCount="indefinite"/>
        </circle>
        <circle cx="161" cy="164" r="5" fill="#111"/>
        <circle cx="156" cy="159" r="3" fill="#7BC8FF" opacity="0.6"/>
        <circle cx="164" cy="168" r="1.5" fill="#5AB0F0" opacity="0.3"/>

        {/* Right eye */}
        <circle cx="239" cy="164" r="18" fill="#0a0a0a"/>
        <circle cx="239" cy="164" r="13" fill="#1a6bb5" opacity="0.9">
          <animate attributeName="r" values="13;12;13" dur="4s" repeatCount="indefinite" begin="0.3s"/>
        </circle>
        <circle cx="239" cy="164" r="9" fill="#2E9BF0">
          <animate attributeName="r" values="9;8;9" dur="4s" repeatCount="indefinite" begin="0.3s"/>
        </circle>
        <circle cx="239" cy="164" r="5" fill="#111"/>
        <circle cx="234" cy="159" r="3" fill="#7BC8FF" opacity="0.6"/>
        <circle cx="242" cy="168" r="1.5" fill="#5AB0F0" opacity="0.3"/>
      </g>

      {/* Nose hint */}
      <path d="M197 196 Q200 204 203 196" fill="none" stroke="#FF8900" strokeWidth="0.8" opacity="0.25"/>

      {/* === EMBER 4s in SVG - larger, burn out as they rise === */}
      <g filter="url(#glow)">
        <text x="110" y="70" fill="#FF8900" fontSize="16" fontWeight="700" fontFamily="monospace" opacity="0">
          4
          <animate attributeName="y" values="85;-10" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.9;0" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="x" values="110;102" dur="3s" repeatCount="indefinite"/>
        </text>
        <text x="280" y="65" fill="#FF8900" fontSize="14" fontWeight="700" fontFamily="monospace" opacity="0" transform="rotate(20, 280, 65)">
          4
          <animate attributeName="y" values="80;-15" dur="3.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0" dur="3.5s" repeatCount="indefinite"/>
          <animate attributeName="x" values="280;290" dur="3.5s" repeatCount="indefinite"/>
        </text>
        <text x="155" y="50" fill="#FFAA33" fontSize="12" fontWeight="700" fontFamily="monospace" opacity="0" transform="rotate(-15, 155, 50)">
          4
          <animate attributeName="y" values="65;-20" dur="2.8s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0" dur="2.8s" repeatCount="indefinite"/>
        </text>
        <text x="200" y="40" fill="#FF8900" fontSize="18" fontWeight="700" fontFamily="monospace" opacity="0">
          4
          <animate attributeName="y" values="55;-25" dur="4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0" dur="4s" repeatCount="indefinite"/>
        </text>
        <text x="240" y="48" fill="#FFAA33" fontSize="10" fontWeight="700" fontFamily="monospace" opacity="0" transform="rotate(-25, 240, 48)">
          4
          <animate attributeName="y" values="62;-10" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0" dur="2.5s" repeatCount="indefinite"/>
          <animate attributeName="x" values="240;248" dur="2.5s" repeatCount="indefinite"/>
        </text>
        <text x="170" y="35" fill="#FF8900" fontSize="11" fontWeight="700" fontFamily="monospace" opacity="0" transform="rotate(30, 170, 35)">
          4
          <animate attributeName="y" values="50;-15" dur="3.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.7;0" dur="3.4s" repeatCount="indefinite"/>
          <animate attributeName="x" values="170;162" dur="3.4s" repeatCount="indefinite"/>
        </text>
      </g>

      {/* === CIRCUIT TRACES on face === */}
      <g opacity="0.2">
        <path d="M138 135 L133 148 L138 158" fill="none" stroke="#FF8900" strokeWidth="0.6" strokeDasharray="2 2"/>
        <path d="M262 135 L267 148 L262 158" fill="none" stroke="#FF8900" strokeWidth="0.6" strokeDasharray="2 2"/>
        <path d="M155 130 L160 122 L175 120" fill="none" stroke="#FF8900" strokeWidth="0.5" strokeDasharray="2 3"/>
        <path d="M245 130 L240 122 L225 120" fill="none" stroke="#FF8900" strokeWidth="0.5" strokeDasharray="2 3"/>
      </g>

      {/* === SCANNING LINE === */}
      <line x1="90" y1="0" x2="310" y2="0" stroke="#FF8900" strokeWidth="0.6" opacity="0.1">
        <animate attributeName="y1" values="60;200;60" dur="6s" repeatCount="indefinite"/>
        <animate attributeName="y2" values="60;200;60" dur="6s" repeatCount="indefinite"/>
      </line>
    </svg>
  );
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Add to Home Screen state
  const [showA2HS, setShowA2HS] = useState(false);

  // Quick Add state
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [qaImage, setQaImage] = useState<File | null>(null);
  const [qaPreview, setQaPreview] = useState("");
  const [qaName, setQaName] = useState("");
  const [qaBusiness, setQaBusiness] = useState("");
  const [qaEmail, setQaEmail] = useState("");
  const [qaPhone, setQaPhone] = useState("");
  const [qaAddress, setQaAddress] = useState("");
  const [qaWebsite, setQaWebsite] = useState("");
  const [qaNotes, setQaNotes] = useState("");
  const [qaAssign, setQaAssign] = useState("Jeff");
  const [qaSubmitting, setQaSubmitting] = useState(false);
  const [qaSuccess, setQaSuccess] = useState(false);
  const [qaScanning, setQaScanning] = useState(false);
  const [qaMode, setQaMode] = useState<"person"|"card"|null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLInputElement>(null);

  const handlePersonPhoto = (file: File | null) => {
    if (!file) return;
    setQaImage(file);
    setQaMode("person");
    const reader = new FileReader();
    reader.onload = () => setQaPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const [qaScanDone, setQaScanDone] = useState(false);

  const handleCardPhoto = (file: File | null) => {
    if (!file) return;
    setQaImage(file);
    setQaMode("card");
    setQaScanDone(false);
    const reader = new FileReader();
    reader.onload = () => setQaPreview(reader.result as string);
    reader.readAsDataURL(file);
    // Auto-scan immediately
    scanCard(file);
  };

  const scanCard = async (file?: File | null) => {
    const f = file || qaImage;
    if (!f) return;
    setQaScanning(true);
    setQaScanDone(false);
    try {
      const fd = new FormData();
      fd.append("image", f);
      const res = await fetch("/api/todo/ocr", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        if (data.fields) {
          if (data.fields.name) setQaName(data.fields.name);
          if (data.fields.business) setQaBusiness(data.fields.business);
          if (data.fields.email) setQaEmail(data.fields.email);
          if (data.fields.phone) setQaPhone(data.fields.phone);
          if (data.fields.address) setQaAddress(data.fields.address);
          if (data.fields.website) setQaWebsite(data.fields.website);
          if (data.fields.misc) setQaNotes(prev => prev ? prev + "\n" + data.fields.misc : data.fields.misc);
        }
        setQaScanDone(true);
      }
    } catch (err) { console.error("[scanCard] error:", err); }
    setQaScanning(false);
  };

  const resetQuickAdd = () => {
    setQaImage(null); setQaPreview(""); setQaName(""); setQaBusiness("");
    setQaEmail(""); setQaPhone(""); setQaAddress(""); setQaWebsite(""); setQaNotes("");
    setQaAssign("Jeff"); setQaSuccess(false); setQaMode(null); setQaScanDone(false);
  };

  const submitQuickAdd = async () => {
    if (!qaName && !qaPhone && !qaEmail) return;
    setQaSubmitting(true);
    try {
      const fd = new FormData();
      if (qaImage) fd.append("image", qaImage);
      fd.append("name", qaName);
      fd.append("business", qaBusiness);
      fd.append("email", qaEmail);
      fd.append("phone", qaPhone);
      fd.append("address", qaAddress);
      fd.append("website", qaWebsite);
      fd.append("notes", qaNotes);
      fd.append("assignTo", qaAssign);
      const res = await fetch("/api/todo/quick-add-public", { method: "POST", body: fd });
      if (res.ok) {
        setQaSuccess(true);
      }
    } catch { /* ignore */ }
    setQaSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/todo/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      if (!res.ok) {
        setError("Invalid credentials");
        setLoading(false);
        return;
      }
      const sRes = await fetch("/api/todo/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "session" }),
      });
      const { user } = await sRes.json();
      onLogin(user);
    } catch {
      setError("Login failed");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
        @keyframes ember-rise {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.7; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-110vh) rotate(45deg) scale(0.1); opacity: 0; }
        }
        @keyframes ember-drift-left {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0.6; }
          100% { transform: translateY(-105vh) translateX(-60px) rotate(-30deg) scale(0.15); opacity: 0; }
        }
        @keyframes ember-drift-right {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0.6; }
          100% { transform: translateY(-100vh) translateX(50px) rotate(35deg) scale(0.1); opacity: 0; }
        }
        .ember-layer {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden;
        }
        .ember-4 {
          position: absolute; bottom: -40px; color: #FF8900; font-family: monospace;
          font-weight: 700; user-select: none; pointer-events: none;
        }
        .login-wrapper {
          display: flex; justify-content: center; align-items: center;
          min-height: 100vh; background: #111; padding: 20px; position: relative; z-index: 1;
        }
        .login-box {
          background: #1a1a1a; border-radius: 12px; padding: 40px 32px;
          width: 100%; max-width: 380px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .login-input {
          width: 100%; padding: 12px 14px; background: #222; border: 1px solid #333;
          border-radius: 6px; color: #f0f0f0; font-size: 16px; margin-bottom: 12px;
          box-sizing: border-box; -webkit-appearance: none;
        }
        .login-btn {
          width: 100%; padding: 12px; background: #FF8900; color: #000; border: none;
          border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer;
        }
        .login-btn:disabled { opacity: 0.6; }
        .qa-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 12px; margin-top: 16px; background: transparent;
          border: 1px dashed #FF8900; border-radius: 6px; color: #FF8900;
          font-size: 14px; font-weight: 600; cursor: pointer; letter-spacing: 1px;
        }
        .qa-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex;
          justify-content: center; align-items: flex-start; z-index: 1000;
          padding: 16px; overflow-y: auto; -webkit-overflow-scrolling: touch;
        }
        .qa-modal {
          background: #1a1a1a; border-radius: 12px; padding: 20px; width: 100%;
          max-width: 420px; margin: auto 0; border: 1px solid #333;
        }
        .qa-img-btns { display: flex; gap: 10px; margin-bottom: 16px; }
        .qa-img-btn {
          flex: 1; padding: 14px 8px; background: #222; border: 1px solid #333;
          border-radius: 8px; color: #f0f0f0; font-size: 13px; font-weight: 600;
          cursor: pointer; text-align: center; min-height: 44px;
        }
        .qa-preview {
          width: 100%; max-height: 220px; object-fit: contain; border-radius: 8px;
          margin-bottom: 0; background: #111;
        }
        .qa-input {
          width: 100%; padding: 10px 12px; background: #222; border: 1px solid #333;
          border-radius: 6px; color: #f0f0f0; font-size: 16px; margin-bottom: 10px;
          box-sizing: border-box; -webkit-appearance: none;
        }
        .qa-submit {
          width: 100%; padding: 12px; background: #FF8900; color: #000; border: none;
          border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer;
        }
        .qa-submit:disabled { opacity: 0.6; }
        .qa-success { text-align: center; color: #10B981; font-size: 18px; font-weight: 600; padding: 40px 0; }
        @media (max-width: 430px) {
          .login-wrapper { padding: 16px; align-items: flex-start; padding-top: 15vh; }
          .login-box { padding: 28px 18px; border-radius: 10px; }
          .qa-overlay { padding: 8px; }
          .qa-modal { padding: 16px; }
        }
      `}</style>
      {/* Full-page ember 4s background */}
      <div className="ember-layer">
        {Array.from({ length: 30 }).map((_, i) => {
          const size = 14 + Math.random() * 36;
          const left = Math.random() * 100;
          const dur = 6 + Math.random() * 10;
          const delay = Math.random() * 12;
          const anim = ['ember-rise', 'ember-drift-left', 'ember-drift-right'][i % 3];
          const op = 0.15 + Math.random() * 0.35;
          return (
            <span key={i} className="ember-4" style={{
              left: `${left}%`, fontSize: `${size}px`, opacity: op,
              animation: `${anim} ${dur}s ${delay}s linear infinite`,
            }}>4</span>
          );
        })}
      </div>

      <div className="login-wrapper">
        <div className="login-box">
          <BrainIcon />
          <h1 style={{ textAlign: "center", fontSize: 28, fontWeight: 700, color: "#FF8900", margin: "16px 0 4px", letterSpacing: 4 }}>THE VAULT</h1>
          <p style={{ textAlign: "center", color: "#666", fontSize: 13, margin: "0 0 24px" }}>CRM & Task Management</p>
          <form onSubmit={handleSubmit}>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && <p style={{ color: "#DC2626", fontSize: 13, marginBottom: 12 }}>{error}</p>}
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Authenticating..." : "ENTER THE VAULT"}
            </button>
          </form>
          <a href="/todo/add" className="qa-btn" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            QUICK ADD
          </a>
          <a href="/todo/add/bulk" className="qa-btn" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF8900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="9" x2="12" y2="9"/><line x1="6" y1="13" x2="18" y2="13"/></svg>
            BULK ADD
          </a>
          {/* Add to Home Screen */}
          <button onClick={() => setShowA2HS(true)} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            width: "100%", padding: "10px", marginTop: 12, background: "transparent",
            border: "1px solid #333", borderRadius: 6, color: "#888",
            fontSize: 12, cursor: "pointer",
          }}>
            <img src="/vault-icon-192.png" alt="" style={{ width: 28, height: 28, borderRadius: 6 }} />
            Add to Home Screen
          </button>
        </div>
      </div>

      {/* Add to Home Screen Instructions */}
      {showA2HS && (
        <div className="qa-overlay" onClick={() => setShowA2HS(false)}>
          <div className="qa-modal" onClick={e => e.stopPropagation()} style={{ textAlign: "center", padding: "28px 24px" }}>
            <div style={{ marginBottom: 20 }}>
              <img src="/vault-icon-192.png" alt="Vault Icon" style={{ width: 80, height: 80, borderRadius: 18, margin: "0 auto 16px", display: "block", border: "2px solid #333" }} />
              <h3 style={{ color: "#FF8900", fontSize: 20, margin: "0 0 6px", letterSpacing: 2 }}>ADD TO HOME SCREEN</h3>
              <p style={{ color: "#888", fontSize: 13, margin: 0 }}>Get instant access from your iPhone</p>
            </div>
            <div style={{ textAlign: "left", fontSize: 14, lineHeight: 1.6, color: "#ccc" }}>
              <div style={{ marginBottom: 14, display: "flex", gap: 10 }}>
                <span style={{ color: "#FF8900", fontWeight: 700, fontSize: 18, minWidth: 20 }}>1.</span>
                <div>Tap the <span style={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle" }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4A9EF5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: "middle" }}><path d="M4 12v6a2 2 0 002 2h12a2 2 0 002-2v-6"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></span> <strong>Share</strong> button at the bottom of Safari<br/><span style={{ color: "#777", fontSize: 12 }}>The square with an arrow pointing up -- in the Safari toolbar</span></div>
              </div>
              <div style={{ marginBottom: 14, display: "flex", gap: 10 }}>
                <span style={{ color: "#FF8900", fontWeight: 700, fontSize: 18, minWidth: 20 }}>2.</span>
                <div>Scroll down past the icon row <span style={{ color: "#777", fontSize: 12 }}>(Copy, Add to Bookmarks, etc.)</span> and look for the <strong style={{ color: "#fff" }}>&quot;Add to Home Screen&quot;</strong> option with the <strong style={{ color: "#fff" }}>+</strong> icon<br/><span style={{ color: "#777", fontSize: 12 }}>You may need to swipe up on the share sheet to see it</span></div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ color: "#FF8900", fontWeight: 700, fontSize: 18, minWidth: 20 }}>3.</span>
                <div>Tap <strong style={{ color: "#fff" }}>&quot;Add&quot;</strong> in the top-right corner of the next screen<br/><span style={{ color: "#777", fontSize: 12 }}>The Vault will appear as an app icon on your home screen</span></div>
              </div>
            </div>
            <button onClick={() => setShowA2HS(false)} style={{ marginTop: 24, padding: "12px 40px", background: "#FF8900", color: "#000", border: "none", borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>GOT IT</button>
          </div>
        </div>
      )}

      {/* Quick Add Modal */}
      {showQuickAdd && (
        <div className="qa-overlay" onClick={() => { setShowQuickAdd(false); resetQuickAdd(); }}>
          <div className="qa-modal" onClick={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()}>
            {qaSuccess ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ color: "#10B981", fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Lead Added</div>
                <p style={{ color: "#aaa", fontSize: 14, marginBottom: 20 }}>Log in to view your lead and all the details.</p>
                <button onClick={() => { setShowQuickAdd(false); resetQuickAdd(); }} style={{ padding: "12px 32px", background: "#FF8900", color: "#000", border: "none", borderRadius: 6, fontSize: 16, fontWeight: 600, cursor: "pointer" }}>LOG IN NOW</button>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ margin: 0, color: "#FF8900", fontSize: 18 }}>Quick Add Lead</h3>
                  <button onClick={() => { setShowQuickAdd(false); resetQuickAdd(); }} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 20 }}>x</button>
                </div>

                {qaPreview ? (
                  <div style={{ position: "relative", marginBottom: 12 }}>
                    <img src={qaPreview} className="qa-preview" alt="preview" />
                    <button onClick={() => { setQaImage(null); setQaPreview(""); setQaMode(null); setQaScanDone(false); }} style={{ position: "absolute", top: 4, right: 4, background: "#000a", border: "none", color: "#fff", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14, zIndex: 5 }}>x</button>
                    {/* Scanning overlay on the image */}
                    {qaScanning && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                        <img src="/favicon-192x192.png" alt="Processing" style={{ width: 64, height: 64, animation: "pulse 1.5s ease-in-out infinite" }} />
                        <span style={{ color: "#FF8900", fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>SCANNING CARD...</span>
                      </div>
                    )}
                    {/* Retry button if scan finished but no data extracted */}
                    {!qaScanning && qaMode === "card" && qaScanDone && !qaName && !qaPhone && !qaEmail && (
                      <button onClick={() => scanCard()} style={{
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        margin: "10px auto 0", padding: "12px 28px", borderRadius: 28,
                        background: "#FF8900", border: "none", cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(255,137,0,0.4)", color: "#000",
                        fontSize: 15, fontWeight: 700, letterSpacing: 1
                      }}>RETRY SCAN</button>
                    )}
                  </div>
                ) : (
                  <div className="qa-img-btns">
                    <button className="qa-img-btn" onClick={() => cameraRef.current?.click()}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8900" strokeWidth="2" style={{ display: "block", margin: "0 auto 6px" }}><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>
                      Take Photo
                    </button>
                    <button className="qa-img-btn" onClick={() => cardRef.current?.click()}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF8900" strokeWidth="2" style={{ display: "block", margin: "0 auto 6px" }}><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="9" x2="12" y2="9"/><line x1="6" y1="13" x2="18" y2="13"/><line x1="6" y1="17" x2="14" y2="17"/></svg>
                      Business Card
                    </button>
                  </div>
                )}

                <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handlePersonPhoto(e.target.files?.[0] || null)} />
                <input ref={cardRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handleCardPhoto(e.target.files?.[0] || null)} />

                <input className="qa-input" placeholder="Name *" value={qaName} onChange={e => setQaName(e.target.value)} />
                <input className="qa-input" placeholder="Business" value={qaBusiness} onChange={e => setQaBusiness(e.target.value)} />
                <input className="qa-input" type="email" placeholder="Email" value={qaEmail} onChange={e => setQaEmail(e.target.value)} />
                <input className="qa-input" type="tel" placeholder="Phone" value={qaPhone} onChange={e => setQaPhone(e.target.value)} />
                <input className="qa-input" placeholder="Address" value={qaAddress} onChange={e => setQaAddress(e.target.value)} />
                <input className="qa-input" placeholder="Website" type="url" value={qaWebsite} onChange={e => setQaWebsite(e.target.value)} />
                <textarea className="qa-input" placeholder="Notes" value={qaNotes} onChange={e => setQaNotes(e.target.value)} style={{ minHeight: 60, resize: "vertical" as const }} />
                <select className="qa-input" value={qaAssign} onChange={e => setQaAssign(e.target.value)} style={{ marginBottom: 16 }}>
                  <option value="Jeff">Assign to: Jeff</option>
                  <option value="Krystal">Assign to: Krystal</option>
                </select>

                <button className="qa-submit" onClick={submitQuickAdd} disabled={qaSubmitting || (!qaName && !qaPhone && !qaEmail)}>
                  {qaSubmitting ? "Adding..." : "ADD LEAD"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
