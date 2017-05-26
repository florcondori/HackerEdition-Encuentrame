function initMap() {
	var laboratoriaLima = {lat: -12.1191427, lng: -77.0349046};

	var map = new google.maps.Map(document.getElementById('map'), {
	zoom: 20,
	center: laboratoriaLima
	});

	var markadorLaboratoria = new google.maps.Marker({
	position: laboratoriaLima,
	map: map
	});

	//buscame
	var latitud,longitud;
	var funcionExito = function(posicion){
	latitud = posicion.coords.latitude;
	longitud = posicion.coords.longitude;

	var miUbicacion = new google.maps.Marker({
	  position:{lat:latitud, lng:longitud},
	  map: map
	});

	map.setZoom(18);
	map.setCenter({lat:latitud, lng:longitud});
	}

	var funcionError = function(error){
	alert("tenemos un problema con encontrar tu ubicacion");
	}

	function buscar(){
	if(navigator.geolocation){
	  navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
	}
	}

	//traza la ruta
	var inputPartida = document.getElementById("punto-partida");
	var inputDestino = document.getElementById("punto-destino");

	new google.maps.places.Autocomplete(inputPartida);
	new google.maps.places.Autocomplete(inputDestino);

	var directionService = new google.maps.DirectionsService;
	var directionDisplay = new google.maps.DirectionsRenderer;

	var tarifa = document.getElementById("tarifa");

	var calculateAndDisplayRoute = function(directionService,directionDisplay){
		//devuelve un DirectionsRequest obj literal
		directionService.route(
			{	origin: inputPartida.value,
				destination: inputDestino.value,
				travelMode: 'DRIVING'
			}, function(response, status){
					if(status==="OK"){
						console.log(response);
						var km = response.routes[0].legs[0].distance.text;						
						km = Number(km.replace(" km", "").replace(",","."));
						var costo = km*1.75;
						console.log(km);
							if(costo<4){
								costo = 4;
							}else{
								costo= parseInt(costo);
							}

						tarifa.classList.remove("oculto");
						tarifa.innerHTML="S/."+costo;
						directionDisplay.setDirections(response);//se traza la ruta
					} else{
						window.alert("no encontramos una ruta");
					}
				}
		);
	}

	directionDisplay.setMap(map);

	var trazarRuta = function(){
		calculateAndDisplayRoute(directionService,directionDisplay);
	};

	document.getElementById("trazar-ruta").addEventListener("click", trazarRuta);
	document.getElementById("encontrar").addEventListener("click",buscar);
}