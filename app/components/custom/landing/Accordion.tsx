import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "~/components/ui/accordion"

  const gameRules = [
    {
      id: 'rule-1',
      question: '¿Cómo iniciar el juego?',
      answer: 'Cada jugador lanza el dado para moverse en el tablero. El jugador con el mayor número inicia el turno.',
    },
    {
      id: 'rule-2',
      question: '¿Cómo se mueven los jugadores?',
      answer: 'Los jugadores se mueven en el tablero según el número obtenido en el dado, avanzando hacia la siguiente casilla.',
    },
    {
      id: 'rule-3',
      question: '¿Qué pasa al aterrizar en una casilla de evento?',
      answer: 'Cada vez que un jugador aterriza en una casilla de evento, debe resolver el evento de negocios que se presenta.',
    },
    {
      id: 'rule-4',
      question: '¿Cómo se administran los recursos?',
      answer: 'Los jugadores deben gestionar los recursos del departamento eficientemente para cumplir con los objetivos del proyecto.',
    },
    {
      id: 'rule-5',
      question: '¿Cómo se gana el juego?',
      answer: 'El juego termina al finalizar el día 360, y el jugador con la mayor cantidad de puntos gana.',
    },
  ];
  
  export function AccordionRules() {
    return (
      <Accordion type="single" collapsible className="w-full text-white font-montserrat ">
        {gameRules.map((rule) => (
          <AccordionItem key={rule.id} value={rule.id}>
            <AccordionTrigger className="text-lg">{rule.question}</AccordionTrigger>
            <AccordionContent>{rule.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }
  