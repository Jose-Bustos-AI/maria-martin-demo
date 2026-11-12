/* Datos de Maria Martin · Estética Avanzada (Murcia).
   Fuentes (15/10/2026): Booksy (ficha 77755, 181 reseñas, 5,0), Google Maps (40 opiniones, 5,0) e Instagram.
   Precios = precio normal de Booksy. No hay descuento general (sí la "Promo aniversario", con su propio precio). */
window.SALON = {
  nombre: "Maria Martin · Estética Avanzada",
  reservar: "https://booksy.com/es-es/77755_maria-martin_cuidado-de-la-piel_81317_murcia",
  oferta: null,

  /* ---------- RECOMENDADOR: piel, cuerpo y cabello (láser y cejas tienen su propio módulo) ---------- */
  recomendador: {
    nota: "Recomendación orientativa: María lo ajusta contigo en cabina. Precios de Booksy.",
    preguntas: [
      { id: "objetivo", tag: "Objetivo", titulo: "¿Qué te gustaría mejorar?", opciones: [
        ["manchas", "Manchas y tono", "Sol, marcas, piel irregular"], ["acne", "Acné", "Granitos, grasa, marcas"],
        ["firmeza", "Firmeza y arrugas", "Óvalo, cuello, contorno de ojos"], ["luz", "Hidratación y luz", "Piel apagada, tirante"],
        ["cuerpo", "Cuerpo", "Grasa, celulitis, retención"], ["cabello", "Cabello", "Caída, cuero cabelludo"]] },
      { id: "detalle", tag: "Detalle", clave: true, segun: "objetivo", porRespuesta: {
        manchas: { titulo: "¿Cómo es tu caso?", opciones: [["ipl", "Manchas de sol y tono irregular", "Rojeces, poros, primeras arrugas"], ["peeling", "Manchas más marcadas", "Quiero un peeling despigmentante"], ["despig", "Quiero renovar y unificar", "Con microagujas (Dermapen)"]] },
        acne: { titulo: "¿En qué punto estás?", opciones: [["acneipl", "Tengo granitos activos", "Brotes, inflamación"], ["acnepeel", "Piel grasa y poros", "Mixta-grasa con tendencia acneica"], ["marcas", "Me quedan marcas", "Cicatrices o textura"]] },
        firmeza: { titulo: "¿Qué zona te preocupa más?", opciones: [["rf", "El óvalo y la firmeza", "Flacidez, surco nasogeniano"], ["rfcuello", "Cara, cuello y escote", "Quiero tratarlo todo"], ["ojeras", "Ojeras y contorno de ojos", "Pigmentación, bolsas"], ["barras", "Código de barras", "Arrugas del labio superior"]] },
        luz: { titulo: "¿Cómo está tu piel?", opciones: [["hidra", "Apagada y tirante", "Necesita hidratación profunda"], ["limpieza", "Necesita una buena limpieza", "Poros, impurezas"], ["flash", "Tengo un evento", "Quiero un extra de brillo"], ["labios", "Labios secos", "Agrietados, arruguitas"]] },
        cuerpo: { titulo: "¿Qué quieres trabajar?", opciones: [["grasa", "Grasa localizada", "Abdomen, glúteo, brazos"], ["celulitis", "Celulitis", "Piel de naranja"], ["retencion", "Retención de líquidos", "Piernas cansadas, hinchazón"], ["abdomen", "Flacidez abdominal", "Tras embarazo o pérdida de peso"]] },
        cabello: { titulo: "¿Qué notas?", opciones: [["caida", "Se me cae el pelo", "Caída y poca densidad"], ["biotina", "Pelo débil y fino", "Quiero estimular el crecimiento"], ["cuero", "Cuero cabelludo con problemas", "Grasa, caspa, descamación"]] } } },
      { id: "ritmo", tag: "Constancia", titulo: "¿Cada cuánto podrías venir?", opciones: [["suelta", "Una sesión para probar", ""], ["quincena", "Cada 15 días", ""], ["semana", "Cada semana", "Quiero resultados cuanto antes"]] }
    ],
    resultados: {
      ipl: { nombre: "Fotorejuvenecimiento", extra: "con IPL", desc: "Luz pulsada intensa que aporta luminosidad, difumina las primeras arrugas y ayuda con manchas, rosácea y acné, unificando tono y textura.", meta: ["50 €", "45 min", "Bono 5 sesiones · 200 €"], alternativa: "Peeling químico glow (80 €), despigmentante." },
      peeling: { nombre: "Peeling químico", extra: "glow", desc: "Peeling despigmentante: elimina de forma controlada las capas superficiales y con ellas manchas, granitos, cicatrices o arrugas finas.", meta: ["80 €", "1 h", "Bono 3 sesiones · 250 €"], alternativa: "Fotorejuvenecimiento con IPL (50 €)." },
      despig: { nombre: "Despigmentación facial", extra: "Dermapen", desc: "Dermapen promueve la formación natural de colágeno y elastina para renovar la piel y mejorar sus imperfecciones.", meta: ["70 €", "1 h 15 min"], alternativa: "Dermapen con exosomas (90 €)." },
      acneipl: { nombre: "Tratamiento anti-acné", extra: "con IPL", desc: "La luz pulsada ataca la bacteria del acné y reduce poco a poco la producción de grasa, sesión a sesión.", meta: ["40 €", "1 h", "Con presoterapia · 50 €"], alternativa: "Peeling químico acné (50 €)." },
      acnepeel: { nombre: "Peeling químico", extra: "acné", desc: "Azalyc Peel Solution: solución renovadora a pH 4 para pieles mixtas y grasas con tendencia acneica.", meta: ["50 €", "1 h"], alternativa: "Tratamiento anti-acné con IPL (40 €)." },
      marcas: { nombre: "Microneedling", extra: "Dermapen", desc: "Tratamiento mínimamente invasivo que mejora la calidad de la piel, su textura y las marcas.", meta: ["80 €", "1 h 15 min", "Bono 3 sesiones · 200 €"], alternativa: "HialuronPen (80 €)." },
      rf: { nombre: "Radiofrecuencia", extra: "Dual Pro facial", desc: "Efecto en dos fases: firmeza inmediata al contraer el colágeno y, en las semanas siguientes, colágeno nuevo (máximo efecto a partir de los tres meses).", meta: ["50 € sesión", "6 sesiones · 250 €", "10 sesiones · 350 €"], alternativa: "Facial + cuello + escote (60 €)." },
      rfcuello: { nombre: "Radiofrecuencia", extra: "cara, cuello y escote", desc: "La radiofrecuencia Dual Pro sobre cara, cuello y escote: firmeza, redefinición del contorno y piel con aspecto rejuvenecido.", meta: ["60 € sesión", "6 sesiones · 280 €", "10 sesiones · 380 €"], alternativa: "Radiofrecuencia facial (50 €)." },
      ojeras: { nombre: "Ojeras pigmentadas", extra: "Dermapen", desc: "Tratamiento de contorno con Dermapen: aminora la pigmentación, hidrata, drena y atenúa bolsas y ojeras.", meta: ["50 €", "1 h", "Bono 3 sesiones · 120 €"], alternativa: "Radiofrecuencia contorno de ojos (30 €)." },
      barras: { nombre: "Radiofrecuencia", extra: "código de barras", desc: "Radiofrecuencia para la flacidez y las arrugas del contorno inferior y el código de barras.", meta: ["30 € sesión", "6 sesiones · 150 €", "10 sesiones · 200 €"], alternativa: "Hidralips (60 €)." },
      hidra: { nombre: "Hidratación facial", extra: "con microagujas", desc: "Limpieza total y Dermapen con ácido hialurónico: hidrata, unifica el tono y tensa la piel.", meta: ["70 €", "1 h 15 min", "Con presoterapia · 80 €"], alternativa: "Tratamiento luminosidad vitamina C (60 €)." },
      limpieza: { nombre: "Hidrafacial", extra: "limpieza + vitaminas", desc: "Hidrodermoabrasión con agua y oxígeno: limpia, exfolia e hidrata suavemente. Apto para todo tipo de piel.", meta: ["60 €", "1 h", "Con presoterapia · 70 €"], alternativa: "Promo aniversario: Hidrafacial + Dermapen (89 €)." },
      flash: { nombre: "Efecto flash", extra: "vitaminas + LED", desc: "¿Tienes un acontecimiento? Un extra de brillo con vitaminas y fototerapia LED.", meta: ["45 €", "45 min"], alternativa: "Protocolo Glow Novia (65 €)." },
      labios: { nombre: "Hidralips", extra: "ácido hialurónico", desc: "Regenera, repara y revitaliza los labios agrietados o secos. No aporta volumen. Consta de 2 sesiones.", meta: ["60 €", "30 min"], alternativa: "Radiofrecuencia código de barras (30 €)." },
      grasa: { nombre: "Grasa localizada", extra: "", desc: "Para esas zonas que siempre cuesta quitar: debajo del glúteo, abdomen o brazos.", meta: ["50 €", "50 min", "Bono 5 sesiones · 200 €"], alternativa: "Radiofrecuencia corporal 1 zona (45 €)." },
      celulitis: { nombre: "Anticelulítico pro", extra: "", desc: "Radiofrecuencia capacitiva y resistiva con masaje drenante remodelador, en 1 zona. Recomendable un mínimo de 6 sesiones.", meta: ["50 €", "1 h", "Bono 6 sesiones · 300 €"], alternativa: "Bootytreatment (40 €)." },
      retencion: { nombre: "Masaje drenante", extra: "+ presoterapia", desc: "Media hora de masaje drenante con crema anticelulítica y media hora de presoterapia.", meta: ["40 €", "1 h", "Bono 5 sesiones · 160 €"], alternativa: "Presoterapia y termoterapia (15 €)." },
      abdomen: { nombre: "Radiofrecuencia", extra: "flacidez abdominal", desc: "Radiofrecuencia Dual Pro para la flacidez abdominal y la retención de líquidos, combinada con presoterapia.", meta: ["50 €", "1 h"], alternativa: "Grasa localizada (50 €)." },
      caida: { nombre: "Tratamiento anticaída", extra: "y refuerzo capilar", desc: "Combinación pensada para frenar la caída y fomentar el crecimiento de pelo nuevo.", meta: ["50 €", "40 min", "Bono 5 sesiones · 200 €"], alternativa: "Micropunción con biotina (30 €)." },
      biotina: { nombre: "Micropunción", extra: "con biotina", desc: "Microcanales en el cuero cabelludo que promueven el nacimiento de nuevos cabellos.", meta: ["30 €", "35 min", "Bono 5 sesiones · 100 €"], alternativa: "Radiofrecuencia capilar (30 €)." },
      cuero: { nombre: "Radiofrecuencia", extra: "capilar", desc: "Regenera el cuero cabelludo y ayuda con caspa, grasa, dermatitis, descamación y caída.", meta: ["30 € sesión", "10 sesiones · 200 €", "15 sesiones · 280 €"], alternativa: "Tratamiento anticaída (50 €)." }
    },
    consejos: [
      { grupo: "ritmo", si: { ritmo: "semana" }, texto: "Si vienes cada semana, mira los bonos: salen bastante más baratos que las sesiones sueltas." },
      { grupo: "ritmo", si: { ritmo: "quincena" }, texto: "Cada 15 días es un buen ritmo: pregunta a María por el bono de este tratamiento." },
      { grupo: "ritmo", si: { ritmo: "suelta" }, texto: "Prueba una sesión y María te dirá cuántas necesitas para tu caso." }
    ],
    maxConsejos: 1
  },

  /* ---------- ELIGE TU MIRADA ---------- */
  mirada: {
    zonas: [["cejas", "Cejas"], ["pestanas", "Pestañas"], ["ambas", "Cejas + pestañas"]],
    opciones: [
      { id: "visagismo", zona: "cejas", titulo: "Cejas definidas y naturales", sub: "Diseño a medida de tu rostro", dibujo: { ceja: "natural" }, foto: "assets/img/cejas-visagismo.jpg",
        servicios: [{ nombre: "Depilación y visagismo de cejas", precio: "10 €", duracion: "10 min" }], nota: "Damos forma a tus cejas en sintonía con tu rostro, solo con pinza." },
      { id: "laminado", zona: "cejas", titulo: "Cejas peinadas y con volumen", sub: "Laminado de cejas", dibujo: { ceja: "laminado" }, foto: "assets/img/cejas-laminado.jpg",
        servicios: [{ nombre: "Laminado de cejas", precio: "40 €", duracion: "30 min" }], nota: "Se inspira en el lifting de pestañas: diseña el arco y deja la ceja peinada." },
      { id: "henna", zona: "cejas", titulo: "Cejas rellenas y con color", sub: "Henna + laminado", dibujo: { ceja: "henna" }, foto: "assets/img/cejas-henna.jpg",
        servicios: [{ nombre: "Diseño de cejas con henna y laminado", precio: "35 €", duracion: "1 h" }, { nombre: "Visagismo, depilación y henna", precio: "25 €", duracion: "40 min" }], nota: "Ideal para cejas despeinadas y despobladas: la henna es un tinte natural." },
      { id: "shading", zona: "cejas", titulo: "Cejas perfectas cada día", sub: "Micropigmentación técnica shading", dibujo: { ceja: "shading" }, foto: "assets/img/cejas-shading.jpg",
        servicios: [{ nombre: "Micropigmentación de cejas (shading)", precio: "350 €", duracion: "2 h" }], nota: "Maquillaje semipermanente que define y rellena la ceja." },
      { id: "lifting", zona: "pestanas", titulo: "Pestañas con curva", sub: "Lifting de pestañas", dibujo: { ceja: "natural", pestanas: "lifting" }, foto: "assets/img/pestanas-lifting.jpg",
        servicios: [{ nombre: "Lifting de pestañas", precio: "40 €", duracion: "50 min" }, { nombre: "Lifting de pestañas + presoterapia", precio: "50 €", duracion: "1 h" }], nota: "Una mirada espectacular sin renunciar a la naturalidad." },
      { id: "combo", zona: "ambas", titulo: "Mirada perfecta", sub: "Laminado de cejas + lifting de pestañas", dibujo: { ceja: "laminado", pestanas: "lifting" }, foto: "assets/img/mirada-combo.jpg",
        servicios: [{ nombre: "Combo mirada perfecta", precio: "60 €", duracion: "50 min" }], nota: "Laminado de cejas con o sin henna + lifting de pestañas con tinte." }
    ]
  },

  /* ---------- LÁSER: zonas sueltas y packs reales de Booksy ---------- */
  laser: {
    zonas: [
      { id: "rostro", nombre: "Facial completo", mujer: 20, hombre: 20 },
      { id: "bigote", nombre: "Labio superior (bigote)", mujer: 8, hombre: 8, forma: [] },
      { id: "bigoteMenton", nombre: "Bigote + mentón", mujer: 12, hombre: 12, forma: [] },
      { id: "axilas", nombre: "Axilas", mujer: 15, hombre: 15 },
      { id: "brazos", nombre: "Brazos completos + manos", mujer: 20, hombre: 20 },
      { id: "pecho", nombre: "Pecho + abdomen", mujer: 25, hombre: 25, forma: ["pecho", "abdomen"] },
      { id: "ingles", nombre: "Ingles normales", mujer: 20, hombre: 20 },
      { id: "brasilenas", nombre: "Ingles brasileñas + interglúteo", mujer: 30, hombre: 30, forma: [] },
      { id: "mediasPiernas", nombre: "Medias piernas", mujer: 20, hombre: 20 },
      { id: "piernas", nombre: "Piernas completas + pies", mujer: 40, hombre: 40, forma: ["piernas", "mediasPiernas"] },
      { id: "espalda", nombre: "Espalda completa", mujer: 30, hombre: 30, forma: [] },
      { id: "espaldaAlta", nombre: "Espalda alta y cuello", mujer: 15, hombre: 15, forma: [] },
      { id: "hombros", nombre: "Hombros", mujer: 15, hombre: 15, forma: [] },
      { id: "lumbar", nombre: "Lumbar", mujer: 15, hombre: 15, forma: [] },
      { id: "nuca", nombre: "Nuca", mujer: 15, hombre: 15, forma: [] },
      { id: "gluteo", nombre: "Glúteo", mujer: 25, hombre: 25, forma: [] },
      { id: "manos", nombre: "Manos", mujer: 8, hombre: 8, forma: [] },
      { id: "pies", nombre: "Pies", mujer: 8, hombre: 8, forma: [] }
    ],
    cuerpoCompleto: { mujer: 90, hombre: 110 },
    excluyentes: [["piernas", "mediasPiernas"], ["bigote", "bigoteMenton"]],
    packs: [
      { nombre: "Ingles (bikini) + axilas", precio: 30, incluye: ["ingles", "axilas"] },
      { nombre: "Piernas completas + pies + axilas", precio: 50, incluye: ["piernas", "axilas"] },
      { nombre: "Medias piernas + ingles + axilas", precio: 50, incluye: ["mediasPiernas", "ingles", "axilas"] },
      { nombre: "Ingles (bikini) + piernas completas + axilas", precio: 60, incluye: ["ingles", "piernas", "axilas"] }
    ],
    nota: "Precio por sesión en Booksy. El número de sesiones depende de cada piel y vello."
  },

  /* ---------- CARTA ---------- */
  carta: [
    { titulo: "Promo 3º aniversario", img: "assets/img/promo.jpg", desc: "Promociones especiales por su tercer aniversario.", servicios: [
      ["Glow & Luz: limpieza facial + radiofrecuencia + presoterapia", "70 €", "1 h · Hydrafacial, IPL facial, radiofrecuencia y presoterapia"], ["Hidrafacial + Dermapen", "89 €", "1 h"]] },
    { titulo: "Cejas y pestañas", img: "assets/img/cejas-laminado.jpg", desc: "Lo que más destacan sus clientas en las reseñas.", servicios: [
      ["Depilación y visagismo de cejas", "10 €", "10 min"], ["Visagismo, depilación y henna", "25 €", "40 min"], ["Diseño de cejas con henna y laminado", "35 €", "1 h"],
      ["Laminado de cejas", "40 €", "30 min"], ["Lifting de pestañas", "40 €", "50 min"], ["Combo mirada perfecta", "60 €", "50 min · laminado + lifting"], ["Micropigmentación de cejas (shading)", "350 €", "2 h"]] },
    { titulo: "Facial", img: "assets/img/aparatos.jpg", desc: "Hidrafacial, Dermapen, IPL y peelings.", servicios: [
      ["Hidrafacial: limpieza facial + vitaminas", "60 €", "1 h"], ["Hidratación facial con microagujas", "70 €", "1 h 15 min"], ["Despigmentación facial (Dermapen)", "70 €", "1 h 15 min"],
      ["Microneedling con Dermapen", "80 €", "1 h 15 min · bono 3 sesiones 200 €"], ["Dermapen con exosomas", "90 €", "1 h 15 min"], ["HialuronPen", "80 €", "1 h 15 min"],
      ["Fotorejuvenecimiento con IPL", "50 €", "45 min · bono 5 sesiones 200 €"], ["Tratamiento anti-acné con IPL", "40 €", "1 h"], ["Peeling químico glow", "80 €", "1 h · bono 3 sesiones 250 €"],
      ["Peeling químico acné", "50 €", "1 h"], ["Ojeras pigmentadas", "50 €", "1 h · bono 3 sesiones 120 €"], ["Tratamiento luminosidad vitamina C", "60 €", "1 h"],
      ["Efecto flash: vitaminas + LED", "45 €", "45 min"], ["Protocolo Glow Novia", "65 €", "1 h"], ["Hidralips", "60 €", "30 min · 2 sesiones"]] },
    { titulo: "Radiofrecuencia Dual Pro", img: "assets/img/cabina.jpg", desc: "Firmeza en dos fases: inmediata y con colágeno nuevo en las semanas siguientes.", servicios: [
      ["Facial", "50 €", "1 h · 6 sesiones 250 € · 10 sesiones 350 €"], ["Facial + cuello + escote", "60 €", "1 h · 6 sesiones 280 € · 10 sesiones 380 €"],
      ["Contorno de ojos", "30 €", "30 min · 6 sesiones 160 € · 10 sesiones 250 €"], ["Contorno inferior y código de barras", "30 €", "30 min · 6 sesiones 150 € · 10 sesiones 200 €"],
      ["Cicatriz de cesárea", "30 €", "30 min · 6 sesiones 150 € · 10 sesiones 200 €"], ["Corporal 1 zona", "45 €", "45 min · con presoterapia 50 € · con masaje 55 €"]] },
    { titulo: "Corporal", img: "assets/img/still-2.jpg", desc: "Remodelación, drenaje y bienestar.", servicios: [
      ["Grasa localizada", "50 €", "50 min · bono 5 sesiones 200 €"], ["Anticelulítico pro", "50 €", "1 h · bono 6 sesiones 300 €"], ["Masaje drenante + presoterapia", "40 €", "1 h · bono 5 sesiones 160 €"],
      ["Masaje drenante y reductor + loción anticelulítica", "50 €", "50 min · bono 5 sesiones 200 €"], ["Presoterapia y termoterapia", "15 €", "40 min · bono 10 sesiones 140 €"], ["Bootytreatment", "40 €", "1 h 15 min"],
      ["Peeling corporal + masaje + hidratación", "70 €", "1 h 20 min"], ["Masaje relajante", "50 €", "55 min"], ["Fibroblast Plasmapen", "100 €", "2 h 30 min"], ["Plasma Pen verrugas (1 zona)", "30 €", "30 min"], ["Fotorejuvenecimiento de manos", "30 €", "30 min"]] },
    { titulo: "Capilar", img: "assets/img/capilar.jpg", desc: "Para la caída y el cuero cabelludo.", servicios: [
      ["Radiofrecuencia capilar", "30 €", "30 min · 10 sesiones 200 € · 15 sesiones 280 €"], ["Micropunción cuero cabelludo con biotina", "30 €", "35 min · bono 5 sesiones 100 €"], ["Tratamiento anticaída y refuerzo capilar", "50 €", "40 min · bono 5 sesiones 200 €"]] },
    { titulo: "Uñas", img: "assets/img/unas.jpg", desc: "Manicura, semipermanente y gel.", servicios: [
      ["Manicura", "12 €", "20 min"], ["Esmaltado semipermanente manos", "21 €", "35 min · con diseño 26 €"], ["Semipermanente + base refuerzo", "25 €", "1 h"],
      ["Uñas de gel", "35 €", "1 h 20 min · con diseño 40 €"], ["Relleno uñas de gel", "30 €", "1 h 10 min · con diseño 36 €"]] }
  ],

  /* ---------- RESEÑAS (literales; nombre abreviado) ---------- */
  resenas: {
    google: [{ centro: "Maria Martin", placeId: "ChIJsRKwyZmBYw0RUnKs2m2lSJc" }],
    lista: [
      { fuente: "google", nombre: "Tatiana V.", servicio: "Tratamientos faciales", texto: "María es un amor, definitivamente mi piel siempre queda más hermosa cuando ella me hace los procedimientos, es la mejor, la recomiendo 100%" },
      { fuente: "booksy", nombre: "Marga", servicio: "Depilación y visagismo de cejas", texto: "Muy profesional! Hace el diseño de cejas con regla y medidor para adecuarla a tu cara. Me ha gustado mucho" },
      { fuente: "booksy", nombre: "Belén", servicio: "Láser · piernas, pies e ingles", texto: "María es súper agradable y simpática, además el láser que tiene es súper efectivo!! Con ella merece muchísimo la pena 🫶🏻" },
      { fuente: "booksy", nombre: "Sara", servicio: "Laminado de cejas", texto: "Espectacular el servicio. María es súper agradable, me he realizado por primera vez el laminado de cejas, iba asustada y he salido encantada." },
      { fuente: "booksy", nombre: "Sara C.", servicio: "Presoterapia y termoterapia", texto: "Maria es sensacional. El salón que tiene es un oasis de paz. Impecable en el tratamiento. Sin duda se ha convertido en una de mis imprescindibles." },
      { fuente: "google", nombre: "Jose C.", servicio: "Tratamiento capilar", texto: "Llevo un par de meses haciendo un tratamiento capilar con radio frecuencia y dermapen, dando un resultado mejor del esperado y un trato excelente por parte de María, lo recomiendo." },
      { fuente: "booksy", nombre: "Marina", servicio: "Henna, laminado y lifting de pestañas", texto: "Lo recomiendo 100%. Me he hecho un laminado de cejas con henna y un lifting de pestañas. No puedo estar mas contenta. Además, María es un encanto!!" },
      { fuente: "booksy", nombre: "Lola", servicio: "Limpieza facial", texto: "El ambiente muy agradable y relajante, y la cara con la primera sesion y me la noto mucho mejor. Sin duda volvere a hacerme mas" },
      { fuente: "booksy", nombre: "barbara", servicio: "Láser", texto: "María es un encanto. He probado otros centros de estética y no tiene comparación." },
      { fuente: "booksy", nombre: "Rafael", servicio: "Masaje drenante y reductor", texto: "Muy buena con los masajes,e salido muy relajado del centro me cerraba el pantalon mejor que en mi casa,la chica muy agradable y cercana!" },
      { fuente: "booksy", nombre: "Nuria", servicio: "Hidralips", texto: "Experiencia genial! Volvería a ir una y mil veces. Super satisfecha con el resultado y con muchas ganas de volver!" },
      { fuente: "booksy", nombre: "Laura", servicio: "Peeling químico", texto: "Me realice un peeling quimico, maravilloso, muy recomendable!!" },
      { fuente: "booksy", nombre: "Paloma", servicio: "Semipermanente", texto: "Es una crack. Súper profesional. Hace todos los trabajos maravillosamente (cejas, pestañas, uñas…) súper contenta con ella! 100% recomendable!" },
      { fuente: "google", nombre: "Julio L.", servicio: "Manicura", texto: "Gracias a María, puedo mantener una limpieza e higiene de mis manos y uñas para poder dar el mejor servicio como masajista profesional que soy. […]" },
      { fuente: "booksy", nombre: "Ana", servicio: "Lifting de pestañas", texto: "Súper profesional, gracias por recuperar mis pestañas!!" }
    ],
    nota: "Reseñas reales de Booksy y Google, con el nombre abreviado. […] indica que se ha recortado."
  }
};
