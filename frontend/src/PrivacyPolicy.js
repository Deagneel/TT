import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivacyPolicy = () => {
  return (
    <div className="container my-5">
      <h1 className="mb-4 text-center">Políticas de Privacidad para el Registro y Edición de un Inmueble</h1>
      <ol className="list-group list-group-numbered">
        <li className="list-group-item">
          <h2>Recopilación de Datos Personales y del Inmueble</h2>
          <p>Se requerirá información detallada del inmueble, como la dirección, coordenadas de Google Maps, número de habitaciones, características y términos de la renta. Esta información es necesaria para facilitar la comunicación efectiva entre arrendadores y arrendatarios, y para asegurar una descripción precisa del inmueble.</p>
        </li>
        <li className="list-group-item">
          <h2>Uso de Datos Personales</h2>
          <p>Los datos personales serán utilizados exclusivamente para los fines del servicio de arrendamiento, como la verificación de identidad y la facilitación de la comunicación entre usuarios. No se compartirán datos de contacto personales entre usuarios hasta que ambas partes expresen interés en concretar un acuerdo.</p>
        </li>
        <li className="list-group-item">
          <h2>Protección y Seguridad de la Información</h2>
          <p>Se implementarán medidas de seguridad adecuadas para proteger los datos personales y de los inmuebles contra el acceso no autorizado, la alteración, la divulgación o la destrucción. Los arrendadores deben mantener la información del inmueble actualizada y precisa, y notificar al sistema de cualquier cambio relevante.</p>
        </li>
        <li className="list-group-item">
          <h2>Cumplimiento de Regulaciones Locales</h2>
          <p>Los usuarios deben cumplir con todas las leyes y regulaciones locales aplicables en la Ciudad de México respecto al arrendamiento y la publicación de inmuebles. Esto incluye, pero no se limita a obtener los permisos y licencias necesarios.</p>
        </li>
        <li className="list-group-item">
          <h2>Transparencia y Honestidad</h2>
          <p>Se espera que los arrendadores proporcionen información veraz y completa sobre sus inmuebles. Las políticas prohíben expresamente la publicación de información falsa, engañosa o discriminatoria.</p>
        </li>
        <li className="list-group-item">
          <h2>Derecho a la Eliminación de Datos</h2>
          <p>Los usuarios tienen derecho a solicitar la eliminación de su cuenta y la información asociada. En el caso de los arrendadores, la eliminación de la cuenta conllevará la baja de todos los inmuebles listados.</p>
        </li>
        <li className="list-group-item">
          <h2>Modificación de Información del Inmueble</h2>
          <p>Los arrendadores pueden editar la información de sus inmuebles en cualquier momento para reflejar cambios o actualizaciones. Cualquier modificación significativa será sujeta a revisión para asegurar su cumplimiento con las políticas establecidas.</p>
        </li>
        <li className="list-group-item">
          <h2>Reportes y Consecuencias</h2>
          <p>En caso de reportes acumulados o infracciones a las políticas, se tomarán acciones que pueden incluir la pausa de publicación de inmuebles o la baja del usuario del sistema. Estas políticas están diseñadas para proteger tanto a los arrendadores como a los arrendatarios, asegurando un entorno seguro y confiable para el arrendamiento de inmuebles.</p>
        </li>
      </ol>
    </div>
  );
}

export default PrivacyPolicy;
