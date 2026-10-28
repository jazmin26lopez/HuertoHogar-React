
// Artículos del blog de HuertoHogar (contenido de la evaluación 1 pasado a datos)
export const BLOGS = [
  {
    id: '1',
    titulo: 'Caso Curioso #1: Frutas de temporada',
    resumen:
      'Descubre por qué comer frutas y verduras de temporada no solo es más económico, sino también mejor para tu salud y el medio ambiente.',
    imagen: '/imagenes/frutosFrescos.jpg',
    imagenDetalle: '/imagenes/blog1.jpg',
    tituloArticulo: 'Los beneficios de comer frutas y verduras de temporada',
    introduccion:
      'Elegir frutas y verduras de temporada no es solo una tendencia: es una decisión que impacta directamente tu salud, tu bolsillo y el medio ambiente.',
    secciones: [
      {
        titulo: 'Mejor sabor y más nutrientes',
        texto:
          'Cuando una fruta o verdura se cosecha en su punto óptimo de madurez, dentro de su temporada natural, concentra más vitaminas, minerales y antioxidantes. Además, su sabor es notablemente superior al de productos cultivados fuera de época, que suelen madurar de forma artificial durante el transporte.'
      },
      {
        titulo: 'Un precio más justo',
        texto:
          'La oferta y la demanda también aplican en el campo. Cuando un producto está en su temporada, hay mayor disponibilidad, lo que se traduce en precios más accesibles para las familias chilenas.'
      },
      {
        titulo: 'Menor huella de carbono',
        texto:
          'Los productos fuera de temporada muchas veces deben importarse desde otros países o cultivarse en invernaderos con alto consumo energético. Comprar de temporada, especialmente de productores locales como los que trabajan con HuertoHogar, reduce significativamente las emisiones asociadas al transporte y almacenamiento.'
      },
      {
        titulo: '¿Cómo saber qué está en temporada?',
        texto:
          'En HuertoHogar seleccionamos cuidadosamente nuestros productos según la época del año, trabajando directamente con agricultores de Santiago, Puerto Montt, Villarrica, Nacimiento, Viña del Mar, Valparaíso y Concepción, para asegurar siempre la mejor frescura posible.'
      }
    ]
  },
  {
    id: '2',
    titulo: 'Caso Curioso #2: Agricultura sostenible',
    resumen:
      'Conoce cómo los pequeños agricultores chilenos están adoptando prácticas sostenibles para cuidar la tierra y producir alimentos más saludables.',
    imagen: '/imagenes/productores-locales.jpg',
    imagenDetalle: '/imagenes/repartidores.png',
    tituloArticulo: 'Del campo a tu mesa: conoce el viaje de nuestros productos',
    introduccion:
      'Cada producto que llega a tu hogar tiene una historia detrás. En HuertoHogar queremos acercarte a los productores locales y mostrarte el recorrido que realizan nuestros alimentos, desde el campo hasta tu mesa.',
    secciones: [
      {
        titulo: 'Todo comienza en el campo',
        texto:
          'Nuestro recorrido comienza junto a pequeños productores locales que trabajan diariamente para cultivar frutas, verduras y otros productos frescos. Su dedicación y conocimiento permiten obtener alimentos de calidad, respetando los ciclos naturales de la tierra.'
      },
      {
        titulo: 'Seleccionamos cada producto',
        texto:
          'Una vez cosechados, los productos son cuidadosamente seleccionados. Revisamos su calidad y frescura para que solamente los mejores productos formen parte de tu pedido.'
      },
      {
        titulo: 'Preparamos tu pedido',
        texto:
          'Después de la selección, comenzamos a preparar cada pedido. Organizamos los productos de manera cuidadosa para mantener su frescura y protegerlos durante el traslado.'
      },
      {
        titulo: 'Finalmente, llega a tu hogar',
        texto:
          'El último paso es la entrega. Nuestros productos realizan su último recorrido desde el centro de preparación hasta tu hogar, buscando que recibas alimentos frescos y en las mejores condiciones.'
      },
      {
        titulo: 'Más que productos, llevamos una historia',
        texto:
          'Cuando compras en HuertoHogar no solamente recibes frutas, verduras o productos naturales. También estás apoyando a productores locales y formando parte de una conexión más cercana entre el campo y las familias chilenas.'
      }
    ]
  }
]

export function obtenerBlogPorId(id) {
  return BLOGS.find((blog) => blog.id === String(id)) ?? null
}
