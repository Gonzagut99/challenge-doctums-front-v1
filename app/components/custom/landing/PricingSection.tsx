import { ArrowIcon, CheckIcon } from "./Icons"


const tiers = [
  {
    name: 'Plan Starter',
    id: 'tier-hobby',
    href: '#',
    priceMonthly: '$29',
    features: [
      'Talleres de grupos pequeños de estudiantes',
      'Enfoque en habilidades estratégicas y toma de decisiones.', 
      'Hasta 3 salas de juego simultáneas', 
      'Guía básica para una experiencia estructurada.'],
    featured: false,
  },
  {
    name: 'Plan Professional',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '$99',
    disccount: '10%',
    features: [
      'Actividades grupales, como proyectos en clase y competencias en equipo',
      'Sesiones grupales de 4 horas guiadas por un facilitador certificado',
      'Hasta 10 salas de juego simultáneas',
      'Reporte de resultados grupales y retroalimentación en habilidades clave',
    ],
    featured: true,
  },
  {
    name: 'Plan Enterprise',
    id: 'plan-enterprise',
    href: '#',
    priceMonthly: '$29',
    features: [
      'Evaluación y certificación en habilidades empresariales y liderazgo.', 
      'Certificación en competencias estratégicas, con retroalimentación', 
      'Hasta 20 salas simultáneas, ideal para evaluar varios grupos a la vez.', 
      'Análisis de habilidades en liderazgo y toma de decisiones.'],
    featured: false,
  }
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
export default function Example() {
  return (
    <div className="relative isolate mx-auto mb-16 w-[85%] bg-white px-6 py-8 md:py-24 sm:py-16 lg:px-6">
      <div className="max-w-4xl md:max-w-6xl">
        <p className="mt-2 text-balance text-4xl md:text-5xl xl:text-6xl font-regular font-serif tracking-tight">
        Planes para <span className="text-celeste">Instituciones Educativas y Universidades</span>
        </p>
      </div>
      
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-3 group">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              'relative transition-transform duration-300 my-4 md:my-6 lg:my-2', // Para animar el translate
              // Hover dinámico
              tier.featured
                ? 'shadow-2xl shadow-celeste-soft  group-hover:translate-y-0'
                : 'shadow-none hover:shadow-2xl hover:shadow-celeste-soft',
              // Efecto translate universal
              'hover:translate-y-[-10px] hover:scale-105',
              tierIdx === 0
                ? 'lg:mr-4' // Márgen derecho para el primer contenedor
                : tierIdx === tiers.length - 1
                ? 'lg:ml-4' 
                : 'lg:w-[100%]',
              'rounded-2xl min-h-[350px] md:min-h-[550px] flex flex-col p-2 ring-1 ring-gray-900/10 sm:py-8 sm:px-6 lg:p-8',
            )}
          >
            <div className="flex-grow">
              <h3
                id={tier.id}
                className={classNames(
                  'mx-auto text-2xl font-montserrat text-black font-semibold text-center',
                )}
              >
                {tier.name}
              </h3>
              <hr className="m-4 border-t border-gray-300" />
              <ul
                role="list"
                className={classNames(
                  'mt-4 space-y-3 text-sm/6 sm:mt-8',
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center mx-4 sm:mx-0 font-montserrat gap-x-3">
                    <CheckIcon
                      className="w-5 h-5" // Tamaño uniforme para todos los íconos
                      aria-hidden="true"
                    />
                    <span className="text-sm w-full sm:text-base font-medium text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'border-celeste border text-black font-montserrat hover:bg-celeste hover:text-white'
                  : 'text-black font-montserrat border border-black ',
                'flex justify-center w-80 mx-auto mb-4 sm:mb-0 sm:w-full mt-auto block rounded-md px-3.5 py-2.5  text-center text-sm font-semibold',
              )}
            >
              Cotizar este Plan
               <ArrowIcon
              className={classNames(
                tier.featured ? 'stroke-celeste' : 'text-celeste stroke-1 stroke-black',
                'ml-3 my-auto'
              )}
              lateralColor="black"
              centralColor="celeste"
            />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
