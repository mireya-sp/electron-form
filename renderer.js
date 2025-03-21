document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const selectorOrden = document.getElementById('orden');
    const contenedorResultados = document.getElementById('resultados');

    formulario.addEventListener('submit', async (event) => {
        event.preventDefault();
        realizarBusqueda();
    });

    selectorOrden.addEventListener('change', () => {
        realizarBusqueda();
    });

    // Event delegation para manejar clics en los enlaces
    contenedorResultados.addEventListener('click', (event) => {
        if (event.target.classList.contains('titulo_result')) {
            event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
            event.stopImmediatePropagation(); // Detener la propagación del evento
            const url = event.target.getAttribute('data-link');
            window.open(url, '_blank'); // Abrir enlace en una nueva pestaña
        }
    }, true); // Usar capture: true para asegurar que el evento se maneje correctamente

    async function realizarBusqueda() {
        const busqueda = document.getElementById('busqueda').value;

        if (busqueda) {
            try {
                contenedorResultados.innerHTML = '';

                document.getElementById('spinner').style.display = 'block';

                console.log("Iniciando el scraping con búsqueda:", busqueda);
                const resultados = await window.electron.invoke('hacer-scraping', busqueda);

                const filtro = selectorOrden.value;

                const resultadosOrdenados = ordenarResultados(resultados, filtro);

                mostrarResultados(resultadosOrdenados);
            } catch (error) {
                console.error('Error al obtener los resultados', error);
            } finally {
                document.getElementById('spinner').style.display = 'none';
            }
        } else {
            alert("Por favor, ingresa una búsqueda.");
        }
    }

    function ordenarResultados(resultados, filtro) {
        return resultados.sort((a, b) => {
            const precioA = parseFloat(a.precio.replace('€', '').trim()); 
            const precioB = parseFloat(b.precio.replace('€', '').trim()); 

            if (filtro === 'menor') {
                return precioA - precioB; 
            } else if (filtro === 'mayor') {
                return precioB - precioA; 
            } else {
                return 0; 
            }
        });
    }

    function mostrarResultados(resultados) {
        if (resultados.length === 0) {
            contenedorResultados.innerHTML = '<p>No se encontraron resultados.</p>';
        } else {
            resultados.forEach(result => {
                const div = document.createElement('div');
                div.classList.add('resultado');

                div.innerHTML = `
                    <div class="resultado-item">
                        <h3><a class='titulo_result' href="#" data-link="${result.link}">${result.titulo}</a></h3>
                        <img src="${result.foto}" alt="${result.titulo}" class="resultado-imagen">
                        <p><strong>Precio:</strong> ${result.precio}</p>
                    </div>
                `;

                contenedorResultados.appendChild(div);
            });
        }
    }
});