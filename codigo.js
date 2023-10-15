var fila = "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td class='eliminar'></td></tr>";
var productos = null;

function codigoCat(catstr) {
	var code = "null";
	switch (catstr) {
		case "electronicos": code = "c1"; break;
		case "joyeria": code = "c2"; break;
		case "caballeros": code = "c3"; break;
		case "damas": code = "c4"; break;
	}
	return code;
}
var orden = 0;


function listarProductos(productos) {
	var precio = document.getElementById("price");
	precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");

	var num = productos.length;
	var listado = document.getElementById("listado");
	var formagregar = document.getElementById("formagregar");
	var ids, titles, prices, descriptions, categories, fotos;
	var tbody = document.getElementById("tbody"), nfila = 0;
	tbody.innerHTML = "";
	var catcode;
	for (i = 0; i < num; i++) tbody.innerHTML += fila;
	var tr;
	ids = document.getElementsByClassName("id");
	titles = document.getElementsByClassName("title");
	descriptions = document.getElementsByClassName("description");
	categories = document.getElementsByClassName("category");
	fotos = document.getElementsByClassName("foto");
	prices = document.getElementsByClassName("price");
	ax = document.getElementsByClassName("eliminar");
	
	if (orden === 0) { orden = -1; precio.innerHTML = "Precio" }
	else
		if (orden == 1) { ordenarAsc(productos, "price"); precio.innerHTML = "Precio A"; precio.style.color = "#D8E9A8" }
		else
			if (orden == -1) { ordenarDesc(productos, "price"); precio.innerHTML = "Precio D"; precio.style.color = "#A7D0CD" }

	formagregar.style.display = "block";		
	listado.style.display = "block";
	for (nfila = 0; nfila < num; nfila++) {
		ids[nfila].innerHTML = productos[nfila].id;
		titles[nfila].innerHTML = productos[nfila].title;
		descriptions[nfila].innerHTML = productos[nfila].description;
		categories[nfila].innerHTML = productos[nfila].category;
		catcode = codigoCat(productos[nfila].category);
		tr = categories[nfila].parentElement;
		tr.setAttribute("class", catcode);
		prices[nfila].innerHTML = "$" + productos[nfila].price;
		fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
		fotos[nfila].firstChild.setAttribute("onclick", "window.open('" + productos[nfila].image + "');");
		ax[nfila].innerHTML= "<button>Eliminar</button>"
		ax[nfila].firstChild.setAttribute("onclick","eliminarProductos('"+productos[nfila].id+"');");
	}

}

function obtenerProductos() {
	fetch('https://retoolapi.dev/S4CiRT/productos')
	   .then(res => res.json())
	   .then(data => {
		   productos = data;
		   productos.forEach(
			   function(producto){
				   producto.price=parseFloat(producto.price)
			   });
			   listarProductos(data)});
}
	
function agregarProductos() {

	var imagenDir = document.getElementById("AgImg").value;
	var precioTXT = document.getElementById("AgPrecio").value;
	var tituloTXT = document.getElementById("AgTitulo").value;
	var categoriaTXT = document.getElementById("AgCategoria").value;
	var descripcionTXT = document.getElementById("AgDescripcion").value;

	precioExReg = /^[0-9]+(\.[0-9]{1,2})?$/;
	imgExReg = /^[a-z]+:[^:]+$/;

	if(imagenDir === "" || precioTXT === "" || tituloTXT === "" || categoriaTXT === "" || descripcionTXT === ""){
		alert("Favor llenar todos los campos para agregar un producto. Por tal motivo se regresará a la pantalla de inicial");
	}else if(!precioExReg.test(precioTXT)){
		alert("El precio ingresado no es válido. Por tal motivo se regresará a la pantalla de inicial");
		return false;
	}else if(!imgExReg.test(imagenDir)){
		alert("El URL proporcionada para la imagen del producto no es válida. Por tal motivo se regresará a la pantalla de inicial");
		return false;
	}else{
		var nuevoProducto = {
			image: imagenDir,
			price: precioTXT,
			title: tituloTXT,
			category: categoriaTXT,
			description: descripcionTXT
		}

		fetch('https://retoolapi.dev/S4CiRT/productos', {
			method: "POST", body: JSON.stringify(nuevoProducto), headers: { 'Accept': 'application/json', 'Content-type': 'application/json; charset=UTF-8', }
		}).then(response => response.json()).then(data => {productos = data; obtenerProductos()});
		alert("Se ha agregado el producto de manera correcta");
	}
}
		
var delet;
function eliminarProductos(delet) {
	fetch('https://retoolapi.dev/S4CiRT/productos/'+delet, { method: "DELETE" })
		.then(response => response.json())
		.then(data =>productos = data);
		obtenerProductos();
		alert("Se ha eliminado el producto N° "+delet+" de manera correcta"); 
}

function ordenarDesc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return -1;
		if (a[p_key] < b[p_key]) return 1;
		return 0;
	});
}

function ordenarAsc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return 1;
		if (a[p_key] < b[p_key]) return -1;
		return 0;
	});
}