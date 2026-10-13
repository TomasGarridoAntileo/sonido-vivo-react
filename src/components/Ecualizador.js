/* Ecualizador decorativo de la portada.
   En la Parcial 1 main.js creaba los <li> con document.createElement;
   en React se describen con .map() y React los dibuja. */

import React from "react";

export const NIVELES = [30, 45, 62, 80, 92, 74, 58, 66, 85, 98, 88, 70,
                        52, 60, 78, 90, 72, 55, 40, 48, 64, 50, 36, 24];

export default function Ecualizador({ niveles = NIVELES }) {
  return (
    <ul className="ecualizador" aria-hidden="true">
      {niveles.map((nivel, i) => (
        <li key={i} style={{ "--nivel": `${nivel}%`, "--i": i }} />
      ))}
    </ul>
  );
}
