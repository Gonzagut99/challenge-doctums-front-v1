const teamMembers = [
    {
      name: "Bonnie Green",
      role: "CEO & Web Developer",
      description: "Bonnie drives the technical strategy of the flowbite platform and brand.",
      image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png",
      linkedin: "https://linkedin.com/in/bonniegreen",
      github: "https://github.com/bonniegreen",
      field: "TI", // Puede ser 'TI' o 'Negocios'
    },
    {
      name: "Jese Leos",
      role: "CTO",
      description: "Jese drives the technical strategy of the flowbite platform and brand.",
      image: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
      linkedin: "https://linkedin.com/in/jeseleos",
      field: "Negocios", // Solo tendrá LinkedIn
    },
    // Agrega más miembros según sea necesario
  ];
  
  const Team = () => {
    return (
      <section className="bg-white dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
            <h2 className="mb-4 text-4xl tracking-tight font-serif font-extrabold text-gray-900 dark:text-white">
              Nuestro Equipo
            </h2>
            <p className="font-light text-gray-800 font-montserrat lg:mb-16 sm:text-xl">
              Como equipo hemos combinado nuestras habilidades técnicas y estratégicas para desarrollar ideas que puedan tener un impacto positivo.
            </p>
          </div>
          <div className="grid gap-8 mb-6 lg:mb-16 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700"
              >
                <a href="#">
                  <img
                    className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg"
                    src={member.image}
                    alt={`${member.name} Avatar`}
                  />
                </a>
                <div className="p-5">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <a href="#">{member.name}</a>
                  </h3>
                  <span className="text-gray-500">{member.role}</span>
                  <p className="mt-3 mb-4 font-light text-gray-500">{member.description}</p>
                  <ul className="flex space-x-4 sm:mt-0">
                    <li>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            d="M19 0h-14c-2.762 0-5 2.238-5 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.762-2.238-5-5-5zm-11.535 19h-2.93v-9h2.93v9zm-1.465-10.535c-.931 0-1.535-.604-1.535-1.465s.604-1.465 1.535-1.465c.931 0 1.535.604 1.535 1.465s-.604 1.465-1.535 1.465zm13 10.535h-2.931v-4.535c0-1.12-.931-2.033-2.069-2.033-1.12 0-1.931.785-1.931 2.033v4.535h-2.931v-9h2.931v1.382c.344-.523 1.379-1.382 2.482-1.382 1.726 0 3.518 1.242 3.518 4.285v4.715z"
                          />
                        </svg>
                      </a>
                    </li>
                    {member.field === "TI" && member.github && (
                      <li>
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              d="M12 .5c-6.627 0-12 5.373-12 12 0 5.304 3.438 9.8 8.205 11.385.6.112.82-.26.82-.577v-2.165c-3.338.727-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.757-1.333-1.757-1.091-.746.083-.731.083-.731 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.807 1.305 3.492.997.108-.774.419-1.306.762-1.606-2.665-.305-5.466-1.332-5.466-5.931 0-1.31.465-2.381 1.235-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.231.956-.266 1.982-.399 3.003-.404 1.021.005 2.047.138 3.003.404 2.292-1.553 3.3-1.231 3.3-1.231.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.625-5.475 5.921.429.372.812 1.102.812 2.221v3.293c0 .32.218.693.825.576 4.765-1.582 8.2-6.079 8.2-11.384 0-6.627-5.373-12-12-12z"
                            />
                          </svg>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default Team;
  