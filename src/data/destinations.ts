export interface Destination {
  label: string;
  href: string;
}

export interface Region {
  label: string;
  href: string;
  subItems?: Destination[];
}

export const destinations: Region[] = [
  {
    label: "INICIO",
    href: "/",
  },
  {
    label: "COLOMBIA",
    href: "/Colombia",
    subItems: [
      { label: "Amazonas", href: "/Planes/amazonas" },
      { label: "Capurganá", href: "/Planes/capurgana" },
      { label: "Eje Cafetero", href: "/Planes/eje-cafetero" },
      { label: "Cartagena", href: "/Planes/cartagena" },
      { label: "San Andrés", href: "/Planes/san-andres" },
      { label: "Santa Marta", href: "/Planes/santa-marta" },
      { label: "Bogotá", href: "/Planes/bogota" },
      { label: "Medellín", href: "/Planes/medellin" },
      { label: "Casanare", href: "/Planes/casanare" },
      { label: "Villavicencio", href: "/Planes/villavicencio" },
      { label: "Llanos Orientales", href: "/Planes/llanos" },
      { label: "Boyacá", href: "/Planes/boyaca" },
      { label: "Guajira", href: "/Planes/guajira" },
      { label: "Nariño", href: "/Planes/narino" },
      { label: "Tolú", href: "/Planes/tolu" },
      { label: "Santander", href: "/Planes/santander" },
      { label: "Chocó", href: "/Planes/choco" },
      { label: "Valle Del Cauca", href: "/Planes/valle" },
      { label: "Planes Terrestres Colombia", href: "/Planes/terrestres-colombia" },
    ],
  },
  {
    label: "OFERTAS",
    href: "/Ofertas",
    subItems: [
      { label: "Quinceañeras", href: "/Planes/quinceaneras" },
      { label: "Fin De Año", href: "/Planes/fin-de-ano" },
      { label: "Cruceros", href: "/Planes/cruceros" },
    ],
  },
  {
    label: "C.AMERICA",
    href: "/Centro-America",
    subItems: [
      { label: "Cancún", href: "/Planes/cancun" },
      { label: "México y Cancún", href: "/Planes/mexico-cancun" },
      { label: "México DF", href: "/Planes/mexico-df" },
      { label: "Costa Rica", href: "/Planes/costa-rica" },
      { label: "Acapulco", href: "/Planes/acapulco" },
      { label: "Puerto Vallarta", href: "/Planes/puerto-vallarta" },
      { label: "Panamá", href: "/Planes/panama" },
    ]
  },
  {
    label: "CARIBE",
    href: "/Caribe",
    subItems: [
      { label: "Cuba", href: "/Planes/cuba" },
      { label: "Isla Margarita", href: "/Planes/isla-margarita" },
      { label: "Punta Cana", href: "/Planes/punta-cana" },
      { label: "Bahamas", href: "/Planes/bahamas" },
      { label: "Jamaica", href: "/Planes/jamaica" },
      { label: "Aruba", href: "/Planes/aruba" },
      { label: "Curazao", href: "/Planes/curazao" },
    ],
  },
  {
    label: "SURAMÉRICA",
    href: "/Suramerica",
    subItems: [
      { label: "Argentina", href: "/Planes/argentina" },
      { label: "Brasil", href: "/Planes/brasil" },
      { label: "Perú", href: "/Planes/peru" },
      { label: "Ecuador", href: "/Planes/ecuador" },
      { label: "Chile", href: "/Planes/chile" },
    ],
  },
  {
    label: "NORTEAMERICA",
    href: "/Norteamerica",
    subItems: [
      { label: "Canadá", href: "/Planes/canada" },
      { label: "Estados Unidos", href: "/Planes/usa" },
    ],
  },
  {
    label: "EUROPA",
    href: "/Planes/europa",
  },
  {
    label: "ASIA",
    href: "/Planes/asia",
    subItems: [
      { label: "Corea del Sur", href: "/Planes/corea-del-sur" },
      { label: "Singapur ", href: "/Planes/singapur" },
      { label: "Combinado Asia ", href: "/Planes/combinado-asia" },
    ],
  },
  {
    label: "AFRICA",
    href: "/Planes/africa",
    subItems: [
      { label: "Sudáfrica", href: "/Planes/sudafrica" },
      { label: "Marruecos ", href: "/Planes/marruecos" },
    ],
  },
  {
    label: "OCEANÍA",
    href: "/Planes/oceania",
    subItems: [
      { label: "Australia", href: "/Planes/australia" },
      { label: "Nueva Zelanda", href: "/Planes/nueva-zelanda" },
    ],
  },
  {
    label: "EDUCACIÓN",
    href: "/Educacion",
    subItems: [
      { label: "Idiomas en el Exterior", href: "/Educacion/Idiomas" },
      { label: "Pregrados y Postgrados", href: "/Educacion/Pregrados-Postgrados" },
      { label: "Au Pair", href: "/Educacion/Au-Pair" },
      { label: "Campamentos de Verano", href: "/Educacion/Campamentos" },
    ],
  },
  {
    label: "VISADOS",
    href: "/Visados",
    subItems: [
      { label: "Estados Unidos", href: "/Visados/Estados-Unidos" },
      { label: "Canadá", href: "/Visados/Canada" },
      { label: "Australia", href: "/Visados/Australia" },
      { label: "Reino Unido", href: "/Visados/Reino-Unido" },
      { label: "China", href: "/Visados/China" },
    ],
  },
  {
    label: "CONOCIENDO COLOMBIA",
    href: "/Conociendo-Colombia",
    subItems: [
      { label: "Desde Bogotá", href: "/Planes/circuitos-bogota" },
      { label: "Desde Cartagena", href: "/Planes/circuitos-cartagena" },
      { label: "Desde Medellín", href: "/Planes/circuitos-medellin" },
      { label: "Desde Cali", href: "/Planes/circuitos-cali" },
    ],
  },
  {
    label: "CONTACTO",
    href: "/Contacto",
  },
];
