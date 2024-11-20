import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import { AccordionRules } from './Accordion'


export default function Example() {
  return (
    <div className="relative mx-auto isolate overflow-hidden bg-black px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      <div className="absolute inset-0 -z-10 overflow-hidden">
       
      </div>
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-sm/7 font-montserrat text-celeste">Guía Rápida</p>
              <h1 className="mt-2  text-4xl font-serif text-celeste tracking-tight  sm:text-5xl">
                Reglas del Juego
              </h1>
              <p className="mt-6 text-xl/8 font-montserrat text-gray-200">
              Estas son las reglas que guían a los jugadores a lo largo de su experiencia en el simulador estratégico:
              </p>
            </div>
          </div>
        </div>
        <div className="mx-auto -ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            alt=""
            src="./assets/landing/img/character-game.png"
            className="w-[48rem] max-w-none rounded-xl bg-gray-900 shadow-xl ring-1 ring-gray-400/10 sm:w-[48rem]"
          />
        </div>
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base/7 font-montserrat text-gray-200 lg:max-w-lg">
              <p>
              Bienvenido a "Challenge." En este juego, asumes el rol de Líder de Proyecto en una empresa en un entorno de cambio continuo. Como líder, debes tomar decisiones estratégicas para utilizar eficazmente los recursos de tu área y avanzar en el proyecto, enfrentándote a diversas situaciones que simulan retos y oportunidades reales. Cada decisión impactará en el éxito del proyecto y en tu reputación al final del año. El objetivo final es superar los desafíos empresariales, aprovechando las fortalezas de tu equipo y recursos para alcanzar el éxito.
              </p>
              <ul role="list" className="mt-8 space-y-8 text-gray-600">
                <li className="flex gap-x-3">
                  <CloudArrowUpIcon aria-hidden="true" className="mt-1 size-5 flex-none text-celeste" />
                  <span className='text-gray-200'>
                    <strong className="font-semibold text-white">Objetivo.</strong> Enfrentar con éxito los eventos que se presenten a lo largo del año, haciendo uso de las "eficiencias" de tu área de Gestión del Cambio (GC), que representan habilidades clave.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <LockClosedIcon aria-hidden="true" className="mt-1 size-5 flex-none text-celeste" />
                  <span className='text-gray-200'>
                    <strong className="font-semibold text-white">Las eficiencias</strong>Se desarrollan adquiriendo productos, contratando recursos, y ejecutando subproyectos, cada uno de los cuales tiene un costo.
                  </span>
                </li>
                <li className="flex gap-x-3">
                  <ServerIcon aria-hidden="true" className="mt-1 size-5 flex-none text-celeste" />
                  <span className='text-gray-200'>
                    <strong className="font-semibold text-white"> Líder de Proyecto</strong> Tendrás que gestionar el presupuesto mensual asignado al inicio del año, decidiendo cómo invertir en el fortalecimiento de tu área y prepararla para enfrentar los eventos de cada mes. 
                  </span>
                </li>
              </ul>
              <p className="mt-8">
              Cada eficiencia tiene un nivel de fortaleza de 1 a 36, lo cual determina los niveles de eventos que pueden superarse automáticamente. Ejemplo: con 6 puntos, puedes superar eventos de nivel 1 sin lanzar dados; con 36 puntos, eventos de nivel 6.
              </p>
              <h2 className="mt-16 text-2xl font-bold tracking-tight text-white"></h2>
              
            </div>
            <AccordionRules/>
          </div>
          
          
        </div>
        
      </div>
      
    </div>
  )
}