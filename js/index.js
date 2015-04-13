  
 	var addressLocal = "";
 	var fichero;
	var latitude = 0;
	var longitude = 0;
 	var address = "";
	var anchoPantalla = 0;
	var estado = "";
	var ciudad = "";
	var tipoFoto = 0;
	
	var numfotos = 0;
	var numMaxfotos = 3;
	
	var myScroll,
	pullDownEl, pullDownOffset,
	pullUpEl, pullUpOffset,
	generatedCount = 0;
	var buttonLocked = 0
	
	var fotoNumero = 0;
	
	///variable del google analytics
	
	var gaPlugin;
	
	///////////// ISCROLL /////////////////
	
	//recarga el scroll de la galeria

function pullUpAction () {

	$.ajax({
            	type: "POST",
            	url: "https://amorperron.com/app/mostrarGaleria",
            	dataType:'json',
            	data: {  
					id:$('#idUser').val(),
					numfotos:numfotos,
					numMaxfotos:numMaxfotos,
					tipoFoto:tipoFoto,
					ciudad:ciudad,
					estado:estado,
					a:"aaasbsahashdbswbasdbhasdb"
            	},
            	success: function(data){
					
					if(data != false){
						$('.divWrapperWhite').empty();
					}
					
					for(var i= 0; i < data.length;i++){
						
					if(data[i].image == 1){
						var imagePerro = 'https://amorperron.com/perros_perfil/perros_perfil' + data[i].id  + '.jpg';
					} else {
						var imagePerro = "images/silueta_perro.jpg"	
					}
						
					var lugar = "";
						
					if(data[i].municipio == null && data[i].estado == null){
						lugar = data[i].direccion;
					}else if(data[i].municipio == null && data[i].estado != null){
						lugar = data[i].direccion + ", " + data[i].estado;
					} else if(data[i].municipio != null && data[i].estado == null){
						lugar = data[i].direccion + ", " + data[i].municipio;
					} else {
						lugar = data[i].direccion + ", " + data[i].municipio + ", " + data[i].estado;
					}
					
					if(data[i].objetivo == 1){
						estatus = "Perdido";
					} else if(data[i].objetivo == 5){
						estatus = "Encontrado";
					}
					
						$('#divWrapperContent').append(
						
                        '<div id="divWrapperHeader" class="divWrapperHeader">' +
                    	'</div>' +
                    	'<div id="divWrapperImage" class="divWrapperImage">' +
                    		'<div id="divWrapperImageLeft" class="divWrapperImageLeft"></div>' +
                    		'<div id="imageDogs">' +
                        		'<img width="100%" height="100%" src="' + imagePerro + '" id="dog' + fotoNumero + '" onerror="imgError(this);"/>' +
                        	'</div>' +
                    	'</div>' +
                    	'<div id="divWrapperFooter" class="divWrapperFooter">' +
							'<div id="divWrapperFooterLeft" class="divWrapperFooterLeft"></div>' +
                            '<div id="divWrapperFooterContent"><br/>' +
							'<p class="labelImageNombre"> ' + data[i].nombre + ' </p>'+
							'<p class="labelImage"> ' + lugar + ' </p>'+
							'<p class="labelImage"> ' + estatus +' </p>' +
                            '</div>'+
						'</div>'
                        	
						);
						
						var dog = "dog" + fotoNumero
							
							widthImage = $('#' + dog).css('width');
							heightImage = $('#' + dog).css('height');
							
							var resWidth = widthImage.split("px");
							var resHeight = heightImage.split("px");
							
							var redirHeight = (screen.width/resWidth[0]) * resHeight[0];
							
							$('#' + dog).css('width',screen.width);
							$('#' + dog).css('height',redirHeight);
							
							fotoNumero++;
						
					}
					
					var largoPantalla = screen.height;
					largoPantalla = largoPantalla*.75;
					Header = largoPantalla * .05;
					//content = largoPantalla * .65;
					footer = largoPantalla * .50;
					$('.divWrapperHeader').css("height",Header + "px");
					//$('.divWrapperImage').css("height",content + "px");
					$('.divWrapperFooter').css("height",footer + "px");
					//$('.divWrapperImageLeft').css("height",content + "px");
					$('.divWrapperFooterLeft').css("height",footer + "px");
					
					numfotos = numfotos + 3;
					restructureScreen();
					myScroll.refresh();	
            	},
				error: function(data){
					alert("Error al cargar la galeria");
				}
        	});
}

//carga el scroll y la funcion arrastrar
function loaded() {
	pullUpEl = document.getElementById('pullUp');	
	pullUpOffset = pullUpEl.offsetHeight;
	
	myScroll = new iScroll('wrapper', {
		useTransition: true,
		topOffset: pullDownOffset,
		onRefresh: function () {
			if (pullUpEl.className.match('loading')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Arrastra hacia arriba...';
			}
		},
		onScrollMove: function () {
			 if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
				pullUpEl.className = 'flip';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Suelta para refrescar...';
				this.maxScrollY = this.maxScrollY;
			} else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
				pullUpEl.className = '';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Arrastra hacia arriba...';
				this.maxScrollY = pullUpOffset;
			}
		},
		onScrollEnd: function () {
			 if (pullUpEl.className.match('flip')) {
				pullUpEl.className = 'loading';
				pullUpEl.querySelector('.pullUpLabel').innerHTML = 'Cargando...';				
				pullUpAction();	// Execute custom function (ajax call?)
			}
		}
	});
	
	setTimeout(function () { document.getElementById('wrapper').style.left = '0'; }, 800);
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);


	
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		
		gaPlugin = window.plugins.gaPlugin;
		
		gaPlugin.init(successHandler, errorHandler, "UA-56166518-2", 10);
		
		pictureSource=navigator.camera.PictureSourceType; 
        destinationType=navigator.camera.DestinationType;
		document.addEventListener("backbutton", handleBackButton, true);
		//document.addEventListener("hidekeyboard", onKeyboardHide, false);
		
		/// google analityc
		
		
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
		
		var largoPantalla = screen.height;
		largoPantalla = largoPantalla*.70;
		$('.divWrapperContentWhite').css("height",largoPantalla + "px");
		
		anchoPantalla = screen.width + 100;

        $('#login').css("left","-" + anchoPantalla + "px");
		$('#loginSecion').css("left","-" + anchoPantalla + "px");
		$('#registration').css("left","-" + anchoPantalla + "px");
		$('#home').css("left","-" + anchoPantalla + "px");
		$('#EviarResultado').css("left","-" + anchoPantalla + "px");
		
		/*$('#EviarResultado').css('left','10%')
		$('.app').hide();*/
		
		geolocalizacion(2);
		restructureScreen();
		
    }
};

/*$('.app').hide();
$('#login').hide();
		$('#loginSecion').css("left","10%");*/
		//alert(screen.height);

///camara /////


	$(document).on('click','#iconPicture',function(){ capturePhoto(); });

	$(document).on('keydown','#txtDogName',function() {
		if(event.keyCode ==13 && conCambiarFoto == 1){
			cambiarFoto();	
    	}
	});

	var conCambiarFoto = 0;
	var fichero;

	function capturePhoto() {
	$('#home').css("left","-" + anchoPantalla + "px");
	$("#btnPublicar").attr('disabled',true);
	clearPhoto();
    navigator.camera.getPicture(onSuccess, onFail, { quality: 90,
        destinationType: navigator.camera.DestinationType.FILE_URI,
        correctOrientation: true,
        targetWidth: 1000,
        targetHeight: 1000
    });
	
	}
	
	function clearPhoto(){
		$('#placeDog').empty();
		$('#txtDogName').val("");
	}

	function onSuccess(imageData) {
		$('#cargandoGeolocalizacion').show();
		geolocalizacion(1);
		fichero = imageData;
		$('#home').removeClass("activePage");
		$('#EviarResultado').addClass("activePage");
		$('#EviarResultado').css("left","10%");
	}
	
	function onFail(message) {
		$('#home').addClass("activePage");
		$('#home').css("left","0%");
	}
	
	$('#btnPublicar').click(function(){ cambiarFoto()});
	
	function cambiarFoto(){
		
		if(buttonLocked == 0){
			buttonLocked = 1;	
			
			$('#cargandoEviarResultado').show();
			$('#btnPublicar').attr('disabled',true);
			$('#btnPublicar').removeClass('btnCampos');
			$('#btnPublicar').addClass('btnCamposHover');
		
		var f = new Date();
		fecha = (f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate());
					
		var est = estado.toString();
		var ciu = ciudad.toString();
							
		/*$.ajax({
            	type: "POST",
            	url: "https://amorperron.com/app/subirPerro",
            	dataType:'json',
            	data: {
					numfotos:0,
					numMaxfotos:1,
					propietario:$('#idUser').val(),
					nombrePerro:$('#txtDogName').val(),
					lat:latitude,
					long:longitude,
					direccion:address,
					fecha:fecha,
					estado:est,
					ciudad:ciu,
					a:"asaasasahsaasjhashashjashjsadhsadhjhsadjh"
            	},
            	success: function(data){
					console.log(data);
					alert("");
					$('#cargandoEviarResultado').hide();
					$('#btnPublicar').attr('disabled',false);
            	},
				error: function(){
					$('#cargandoEviarResultado').hide();
					$('#btnPublicar').attr('disabled',false);
				}
        	});*/
		
			var options = new FileUploadOptions();
         	params = new Object ;
            options.fileKey="file";
            options.fileName=fichero.substr(fichero.lastIndexOf('/')+1);
            options.mimeType="image/jpeg";
            params.propietario = $('#idUser').val();
            params.nombrePerro = $('#txtDogName').val();
			params.lat = latitude;
            params.long = longitude;
			params.direccion = address;
			params.fecha = fecha;
			params.estado = est;
			params.ciudad = ciu;

            options.params = params;
            options.chunkedMode = false;
          
            var ft = new FileTransfer();
            ft.upload(fichero,"https://amorperron.com/app/subirPerro",
               function(){
				   $('#labelAddress').empty();
				   $.ajax({
            			type: "POST",
            			url: "https://amorperron.com/app/mostrarGaleria",
						//url: "http://localhost:8080/amorperron2/mostrarGaleria.php",
            			dataType:'json',
            			data: {  
							id:$('#idUser').val(),
							numfotos:0,
							numMaxfotos:1,
							tipoFoto:tipoFoto,
							ciudad:ciudad,
							estado:estado,
							a:"aaasbsahashdbswbasdbhasdb",
							b:"hskjdksabdjksbjdjasd"
            			},
            			success: function(data){
							$('.divWrapperWhite').empty();
							
							if(tipoFoto == 1){
								tipoFoto = 0;
								$('#divWrapperContent').empty();
								$('#iconHome').hide();
								$('#iconLoupe').show();
							}
							
							for(var i= 0; i < data.length;i++){
								
							var lugar = "";
							
							if(data[i].image == 1){
								var imagePerro = 'https://amorperron.com/perros_perfil/perros_perfil' + data[i].id  + '.jpg';
							} else {
								var imagePerro = "images/silueta_perro.jpg"	
							}
						
							if(data[i].municipio == null && data[i].estado == null){
								lugar = data[i].direccion;
							}else if(data[i].municipio == null && data[i].estado != null){
								lugar = data[i].direccion + ", " + data[i].estado;
							} else if(data[i].municipio != null && data[i].estado == null){
								lugar = data[i].direccion + ", " + data[i].municipio;
							} else {
								lugar = data[i].direccion + ", " + data[i].municipio + ", " + data[i].estado;
							}
							
							estatus = "";
							
							if(data[i].objetivo == 1){
								estatus = "Perdido";
							} else if(data[i].objetivo == 5){
								estatus = "Encontrado";
							}
					
						$('#divWrapperContent').prepend(
						
                        '<div id="divWrapperHeader" class="divWrapperHeader">' +
                    	'</div>' +
                    	'<div id="divWrapperImage" class="divWrapperImage">' +
                    		'<div id="divWrapperImageLeft" class="divWrapperImageLeft"></div>' +
                    		'<div id="imageDogs">' +
                        		'<img width="100%" height="100%" src="' + imagePerro + '" id="dog' + fotoNumero + '" onerror="imgError(this);"/>' +
                        	'</div>' +
                    	'</div>' +
                    	'<div id="divWrapperFooter" class="divWrapperFooter">' +
							'<div id="divWrapperFooterLeft" class="divWrapperFooterLeft"></div>' +
                            '<div id="divWrapperFooterContent"><br/>' +
							'<p class="labelImageNombre"> ' + data[i].nombre + ' </p>'+
							'<p class="labelImage"> ' + lugar + ' </p>'+
							'<p class="labelImage"> ' + estatus +' </p>' +
                            '</div>'+
						'</div>'
                        	
						);
						
						var dog = "dog" + fotoNumero
							
							widthImage = $('#' + dog).css('width');
							heightImage = $('#' + dog).css('height');
							
							var resWidth = widthImage.split("px");
							var resHeight = heightImage.split("px");
							
							var redirHeight = (screen.width/resWidth[0]) * resHeight[0];
							
							$('#' + dog).css('width',screen.width);
							$('#' + dog).css('height',redirHeight);
							
							fotoNumero++;
						
					}
					
					var largoPantalla = screen.height;
					largoPantalla = largoPantalla*.70;
					Header = largoPantalla * .05;
					content = largoPantalla * .60;
					footer = largoPantalla * .37;
					$('.divWrapperHeader').css("height",Header + "px");
					//$('.divWrapperImage').css("height",content + "px");
					$('.divWrapperFooter').css("height",footer + "px");
					//$('.divWrapperImageLeft').css("height",content + "px");
					$('.divWrapperFooterLeft').css("height",footer + "px");
					
								numfotos = 1;
								conCambiarFoto = 0;
								myScroll.refresh();
								$('#EviarResultado').removeClass("activePage");
								$('#home').addClass("activePage");
								$('#EviarResultado').css("left","-" + anchoPantalla + "px");
								$('#home').css("left","0%");
								$('#cargandoEviarResultado').hide();
								$('#btnPublicar').attr('disabled',false);
								$('#btnPublicar').removeClass('btnCamposHover');
								$('#btnPublicar').addClass('btnCampos');
								buttonLocked =0;
								cordova.plugins.Keyboard.close();
								
            				},
							error: function(data){
								conCambiarFoto = 0;
								$('#EviarResultado').removeClass("activePage");
								$('#home').addClass("activePage");
								$('#EviarResultado').css("left","-" + anchoPantalla + "px");
								$('#home').css("left","0%");
								$('#cargandoEviarResultado').hide();
								$('#btnPublicar').attr('disabled',false);
								$('#btnPublicar').removeClass('btnCamposHover');
								$('#btnPublicar').addClass('btnCampos');
								buttonLocked =0;
							}
        				});   
               },
               function(err){
                   console.log('error al guardar la foto, intentelo mas tarde');
				   alert("error al subir imagen" + err.code);
				   conCambiarFoto = 0;
				   $('#EviarResultado').removeClass("activePage");
					$('#home').addClass("activePage");
					$('#EviarResultado').css("left","-" + anchoPantalla + "px");
					$('#home').css("left","0%");
					$('#cargandoEviarResultado').hide();
					$('.btnPublicar').attr('disabled',false);
					$('#btnPublicar').removeClass('btnCamposHover');
								$('#btnPublicar').addClass('btnCampos');
					buttonLocked =0;
               },
               options);
			   
		}
			 
	}

//// geolocalizacion ////
	
		function geolocalizacion(tipo){
			if(tipo == 1){
				buttonLocked = 1;
				$('#btnPublicar').removeClass('btnCampos');
				$('#btnPublicar').addClass('btnCamposHover');
			}
			if (navigator.geolocation) {
				function exito(pos) {
					latitude = pos.coords.latitude;
					longitude = pos.coords.longitude;
						
                    //MuestraMapa(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
					var geocoder ;
                   geocoder = new google.maps.Geocoder();
                   var latlng = new google.maps.LatLng(latitude, longitude);
                   //alert("Else loop" + latlng);
                   geocoder.geocode({'latLng': latlng}, function(results, status)
                    {
                        //alert("Else loop1");
                        if (status == google.maps.GeocoderStatus.OK)
                         {
                                if (results[0])
                                {
									resultsTotal=results[0].address_components.length;
									resultsTotal = resultsTotal-2;
									if(results[0].address_components[resultsTotal].long_name == 'México'){
										resultsTotal = resultsTotal-1;
									}
									estado = results[0].address_components[resultsTotal].long_name;
									resultsTotal = resultsTotal-1;
									ciudad = results[0].address_components[resultsTotal].long_name;
									
									address = "";
									
									for(var i = 0;i<resultsTotal;i++){
										address = address + results[0].address_components[i].long_name;
									}
									
									if(tipo == 1){
									
									$('#cargandoGeolocalizacion').hide();
									$('#placeDog').html(address);
									$("#btnPublicar").attr('disabled',false);
									conCambiarFoto = 1;
									$('#home').removeClass("activePage");
									//
									$('#EviarResultado').addClass("activePage");
									$('#home').css("left","-" + anchoPantalla + "px");
									$('#EviarResultado').css("left","10%");
									
									$('#btnPublicar').removeClass('btnCamposHover');
									$('#btnPublicar').addClass('btnCampos');
									buttonLocked = 0;
									} else {
										var idUser = localStorage.getItem('idUser') || '';
										if(idUser == ''){
											$('.app').hide();
											$('#login').css("left","10%");
											$('#cargando').show();
										} else {
											loginAutomatico(idUser);
										}	
									}
									//
                                }
                                else 
                                {
									if(tipo == 1){
                          			alert("Direccion no encontrada");
						  			$('#EviarResultado').removeClass("activePage");
									$('#home').addClass("activePage");
									$('#EviarResultado').css("left","-" + anchoPantalla + "px");
									$('#home').css("left","0%");
									$('#cargandoGeolocalizacion').hide();
									$("#btnPublicar").attr('disabled',false);
									$('#btnPublicar').removeClass('btnCamposHover');
									$('#btnPublicar').addClass('btnCampos');
									}
									buttonLocked = 0;
									if(tipo == 2){
										var idUser = localStorage.getItem('idUser') || '';
										if(idUser == ''){
											$('.app').hide();
											$('#login').css("left","10%");
											$('#cargando').show();
										} else {
											loginAutomatico(idUser);
										}	
									}
									
                                }
                        }
                         else
                        {
                        //document.getElementById("location").innerHTML="Geocoder failed due to: " + status;
							if( tipo == 1){
                        	alert("Geolocalizacion fallida debido a : " + status);
							$('#EviarResultado').removeClass("activePage");
							$('#home').addClass("activePage");
							$('#EviarResultado').css("left","-" + anchoPantalla + "px");
							$('#home').css("left","0%");
							$('#cargandoGeolocalizacion').hide();
							$("#btnPublicar").attr('disabled',false);
							$('#btnPublicar').removeClass('btnCamposHover');
							$('#btnPublicar').addClass('btnCampos');
							buttonLocked = 0;
							if(tipo == 2){
								var idUser = localStorage.getItem('idUser') || '';
								if(idUser == ''){
									$('.app').hide();
									$('#login').css("left","10%");
									$('#cargando').show();
								} else {
									loginAutomatico(idUser);
								}	
							}
							}
                        }
                    });
									
                   	}
					function falla(error) {
						if(tipo == 1){
						alert('Error en servicio Geolocalizador');
						$('#EviarResultado').removeClass("activePage");
						$('#home').addClass("activePage");
						$('#EviarResultado').css("left","-" + anchoPantalla + "px");
						$('#home').css("left","0%");
						$('#cargandoGeolocalizacion').hide();
						$("#btnPublicar").attr('disabled',false);
						$('#btnPublicar').removeClass('btnCamposHover');
						$('#btnPublicar').addClass('btnCampos');
						}
						buttonLocked = 0;
						if(tipo == 2){
							var idUser = localStorage.getItem('idUser') || '';
							if(idUser == ''){
								$('.app').hide();
								$('#login').css("left","10%");
								$('#cargando').show();
							} else {
								loginAutomatico(idUser);
							}	
						}
					}
						
					//maximumAge- Guarda la posicion por 5 minutos 
					//enableHighAccuracy: Se tratan de obtener los mejores resultados posible del GPS
					//timeout: el tiempo maximo que se espera para obtener la posicion en este caso 5 segundos
					var options = {maximumAge: 500000, enableHighAccuracy:true, timeout: 10000};
					navigator.geolocation.getCurrentPosition(exito, falla, options );
						}//FIN IF
						else {
               		 }
				}

////////////// agregar usuario ////////////////

$('#btnAddUser').click(function(){ addUser()});

$(document).on('keydown','#txtUser, #txtEmail, #txtPassword, #txtPassword2',function() {
		if(event.keyCode ==13){
			addUser();	
    	}
});

	function RegistrarUsuario(){
		clearRegistro();
		$('#login').removeClass("activePage");
		$('#loginSecion').removeClass("activePage");
		$('#registration').addClass("activePage");
		$('#login').css("left","-" + anchoPantalla + "px");
		$('#registration').css("left","10%");
	}

	function addUser(){
		
		if(buttonLocked == 0){
			buttonLocked = 1;
			
		result = validationAddUser();			
					
		if(result){		
		
		$("#cargandoRegistration").show();
		$("#btnAddUser").attr('disabled',true);
		$('#btnAddUser').removeClass('btnCampos');
		$('#btnAddUser').addClass('btnCamposHover');
		
		var f = new Date();
		fecha = (f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate());
		
		$.ajax({
            	type: "POST",
            	url: "https://amorperron.com/app/comprobarCorreo",
				//url: "http://localhost:8080/amorperron/agregarUsuario.php",
            	dataType:'json',
            	data: {
					email: $('#txtEmail').val()
            	},
            	success: function(data){
					if(data.length == 0){
						
						$.ajax({
            				type: "POST",
            					url: "https://amorperron.com/app/RegistrarUsuarioApp",
            					dataType:'json',
            					data: { 
									usuario: $('#txtUser').val(), 
									email: $('#txtEmail').val(), 
									password: $('#txtPassword').val(),
									birthday: "",
									fecha: fecha
            					},
            					success: function(data){
									alert("usuario: " + $('#txtUser').val() + " registrado");
									$('#registration').removeClass("activePage");
									$('#loginSecion').addClass("activePage");
									$('#registration').css("left","-" + anchoPantalla + "px");
									$('#loginSecion').css("left","10%");
									clearRegistro();
									$("#cargandoRegistration").hide();
									$("#btnAddUser").attr('disabled',false);
									$('#btnAddUser').removeClass('btnCamposHover');
									$('#btnAddUser').addClass('btnCampos');
									buttonLocked = 0;
									cordova.plugins.Keyboard.close();
            					}, error: function(data){
									alert("Error al registrar usuario intentelo mas tarde");
									$("#cargandoRegistration").hide();
									$("#btnAddUser").attr('disabled',false);
									$('#btnAddUser').removeClass('btnCamposHover');
									$('#btnAddUser').addClass('btnCampos');
									buttonLocked = 0;
								}
        					});			
						} else {
							alert("Correo existente. Porfavor escriba otro");
							$("#cargandoRegistration").hide();
							$("#btnAddUser").attr('disabled',false);
							$('#btnAddUser').removeClass('btnCamposHover');
							$('#btnAddUser').addClass('btnCampos');
							buttonLocked = 0;
						}
					
            	}, error: function(){
					alert("Error al registrar usuario intentelo mas tarde");
					$("#cargandoRegistration").hide();
					$("#btnAddUser").attr('disabled',false);
					$('#btnAddUser').removeClass('btnCamposHover');
					$('#btnAddUser').addClass('btnCampos');
					buttonLocked = 0;
				}
        	});
		}
		}
	};
	
	function clearRegistro(){
		$('#txtUser').val("");
		$('#txtEmail').val("");
		$('#txtPassword').val("");
		$('#txtPassword2').val("");
	}
	
	function validationAddUser(){
		var result = true;
		
		if($('#txtPassword2').val().trim().length == 0){
			alert("campo vacio. vuelva a escribir la contraseña");
			$('#txtPassword2').focus();
			result = false;
		}
		
		if($('#txtPassword2').val().trim() != $('#txtPassword').val().trim()){
			alert("contraseña distintas");
			$('#txtPassword2').focus();
			result = false;
		}
		
		if($('#txtPassword').val().trim().length == 0){
			alert("campo vacio. ingrese una contraseña");
			$('#txtPassword').focus();
			result = false;
		}
		
		expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		var email = $('#txtEmail').val().trim();
    	if ( !expr.test(email) ){
			alert("Error: La dirección de correo " + email + " es incorrecta.");
			$('#txtEmail').focus();
			result = false;
		}
		
		if($('#txtEmail').val().trim().length == 0){
			alert("campo vacio. ingrese un email");
			$('#txtEmail').focus();
			result = false;
		}
		
		if($('#txtUser').val().trim().length == 0){
			alert("campo vacio. ingrese un nombre de usuario");
			$('#txtUser').focus();
			result = false;
		}
		
		buttonLocked = 0;
		
		return result;
	}


///// login //////
$(document).on('click','#btnLoginNormal',function(){ loginIn(); });
$('#btnLongIn').click(function(){ loginNormal();});
$(document).on('keydown','#txtEmailLogin, #txtPasswordLogin',function() {
		if(event.keyCode ==13){
			loginNormal();	
    	}
});


	function loginIn(){
		//alert(screen.height);
		$('#login').removeClass("activePage");
		$('#loginSecion').addClass("activePage");
		$('#login').css("left","-" + anchoPantalla + "px");
		$('#loginSecion').css("left","10%");
	}
	
	function loginAutomatico(idUser){
		$('#idUser').val(idUser);
		mostrarImagen();
	}

	function loginNormal(){
		
		if($('#txtPasswordLogin').val().trim().length > 0){
		
		$('#divWrapperContent').empty();
		
		if(buttonLocked == 0){
			buttonLocked = 1;
		
		$('#cargandologinSecion').show();
		$('#btnLongIn').attr('disabled',true);
		$('#btnLongIn').removeClass('btnCampo');
		$('#btnLongIn').addClass('btnCamposHover');
		
		$.ajax({
            	type: "POST",
            	url: "https://amorperron.com/app/loginApp",
				//url: "http://localhost:8080/amorperron/buscarUsuarios.php",
            	dataType:'json',
            	data: {  
					email: $('#txtEmailLogin').val(), 
					password: $('#txtPasswordLogin').val()
            	},
            	success: function(data){
					if(data.length == 0){
						alert("usuario y/o password incorrecto");	
						$('#cargandologinSecion').hide();
						$('#btnLongIn').attr('disabled',false);
						$('#btnLongIn').removeClass('btnCamposHover');
						$('#btnLongIn').addClass('btnCampos');
						buttonLocked = 0;
					} else {
						$('#idUser').val(data[0].id);
						
						if($("#recuerdame").is(':checked')) { 
							localStorage.setItem("idUser", data[0].id);
							/*localStorage.setItem("username", $('#txtEmailLogin').val());
							localStorage.setItem("password", $('#txtPasswordLogin').val());*/
						}
						mostrarImagen();
						$('#btnLongIn').removeClass('btnCamposHover');
						$('#btnLongIn').addClass('btnCampos');
						buttonLocked = 0;
						cordova.plugins.Keyboard.close();
					}
            	},
				error: function(data){
					alert("Error al conectarse vuelva a intentarlo");
					$('#cargandologinSecion').hide();
					$('#btnLongIn').attr('disabled',false);
					$('#btnLongIn').removeClass('btnCamposHover');
					$('#btnLongIn').addClass('btnCampos');
					buttonLocked = 0;
				}
        	});
		}
		} else {
			alert("campo vacio. ingrese una contraseña")
			$('#txtPasswordLogin').focus();	
		}
	}
	
	/// boton atras /////
	
	function handleBackButton(){
		if($('.activePage').attr("id") == 'login' || $('.activePage').attr("id") == 'home'){
			navigator.app.exitApp();
		}  else if($('.activePage').attr("id") == 'registration'){
			$('#registration').removeClass("activePage");
			$('#login').addClass("activePage");
			$('#registration').css("left","-" + anchoPantalla + "px");
			$('#loginSecion').css("left","-" + anchoPantalla + "px");
			$('#login').css("left","10%");
		} else if($('.activePage').attr("id") == 'EviarResultado'){
			$('#EviarResultado').removeClass("activePage");
			$('#home').addClass("activePage");
			$('#EviarResultado').css("left","-" + anchoPantalla + "px");
			$('#home').css("left","0%");
		} else if($('.activePage').attr("id") == 'loginSecion'){
			$('#loginSecion').removeClass("activePage");
			$('#login').addClass("activePage");
			$('#loginSecion').css("left","-" + anchoPantalla + "px");
			$('#login').css("left","10%");
			$('#txtEmailLogin').val("");
			$('#txtPasswordLogin').val("");
		} else {
			navigator.app.backHistory();
		}
	}
	
	//flechas atra
	
	$(document).on('click','#btnLoginAgo',function(){ LoginAgo(); });
	$(document).on('click','#btnAddUserAgo',function(){ AddUserAgo(); });
	
	function LoginAgo(){
		$('#loginSecion').removeClass("activePage");
		$('#login').addClass("activePage");
		$('#loginSecion').css("left","-" + anchoPantalla + "px");
		$('#login').css("left","10%");
		$('#txtEmailLogin').val("");
		$('#txtPasswordLogin').val("");
	}
	
	function AddUserAgo(){
		$('#registration').removeClass("activePage");
		$('#login').addClass("activePage");
		$('#registration').css("left","-" + anchoPantalla + "px");
		$('#loginSecion').css("left","-" + anchoPantalla + "px");
		$('#login').css("left","10%");
	}
	
	//// boton cerrar sesion /////
	
	$(document).on('click','#iconExitSection',function(){ CerrarSesion(); });
	
	function CerrarSesion(){
		localStorage.clear();
		
		facebookConnectPlugin.logout( 
        function (response) { },
        function (response) { });
		
		$('#home').removeClass("activePage");
		$('#login').addClass("activePage");
		$('#home').css("left","-" + anchoPantalla + "px");
		$('#login').css("left","10%");
		$('#divWrapperContent').empty();
		$('#divWrapperWhite').empty();
		$('#txtEmailLogin').val('');
		$('#txtPasswordLogin').val('');
		numfotos = 0;
		myScroll.refresh();	
	}
	
	function mostrarImagen(){
		
		$('#divWrapperContent').empty();
		$('.divWrapperWhite').empty();
		
		$('.divWrapperWhite').append(
			'<div id="divWrapperHeader" class="divWrapperHeader">' +
			'</div>' +
			'<div id="divWrapperImage" class="divWrapperImage">' +
			'<div id="divWrapperImageLeft" class="divWrapperImageLeft"></div>' +
			'<div id="imageDogs">' +
			'<div id="" style="text-align:center;">' +
			'<img src="img/ajax-loader.gif" height="10%" width="15%"/ >' +
			'<p class="labelImage">Cargando fotos de los perros...</p>'+
			'</div>' +
			'</div>' +
			'</div>' +
			'<div id="divWrapperFooter" class="divWrapperFooter">' +
			'<div id="divWrapperFooterLeft" class="divWrapperFooterLeft"></div>' +
			'<div id="divWrapperFooterContent"><br/>' +
			'</div>'+
			'</div>'
		);
		
			var largoPantalla = screen.height;
			largoPantalla = largoPantalla*.75;
			Header = largoPantalla * .40;
			content = largoPantalla * .30;
			footer = largoPantalla * .1;
			$('.divWrapperHeader').css("height",Header + "px");
			$('.divWrapperImage').css("height",content + "px");
			$('.divWrapperFooter').css("height",footer + "px");
					
			tipoFoto = 3;
		
		$.ajax({
            	type: "POST",
            	url: "https://amorperron.com/app/mostrarGaleria",
				//url: "http://localhost:8080/amorperron2/mostrarGaleria.php",
            	dataType:'json',
            	data: {  
					id:$('#idUser').val(),
					numfotos:0,
					numMaxfotos:1,
					tipoFoto:0
            	},
            	success: function(data){
					$('.divWrapperWhite').empty();
					
					$('#divWrapperContent').empty();
					
					if(data.length == 0){
						
						var ai = "https://amorperron.com/perros_perfil/perros_perfil17596.jpg?"
						
						$('.divWrapperWhite').append(
                        		'<div id="divWrapperHeader" class="divWrapperHeader">' +
								'<div id="divWrapperImageLeft" class="divWrapperImageLeft"></div>' +
								'<div id="divWrapperImageCenter" class="divWrapperImageCenter">' +
								'<div id="tableParent" class="divWrapperHeaderCenter"></div>' +
								'<div id="tableChild"' +
								'<p class="labelImage">Colabora tomándole foto a perros de la calle para ayudar a que sus dueños los recuperen</p>' + 
								'</div>'+
								'</div>'+
                    			'</div>' +
                    			'<div id="divWrapperImage" class="divWrapperImage">' +
                    			'<div id="imageDogs">' +
                        		'<img src="images/fondoDefault.jpg" id="dog" width="100%" height="auto"/>' +
                        		'</div>' +
                    			'</div>' +
                    			'<div id="divWrapperFooter" class="divWrapperFooter">' +
									'<div id="divWrapperFooterLeft" class="divWrapperFooterLeft"></div>' +
                            	'<div id="divWrapperFooterContent">' +
                            	'</div>'+
							'</div>'
							);
							
							var largoPantalla = screen.height;
							largoPantalla = largoPantalla*.75;
							Header = largoPantalla * .20;
							content = largoPantalla * .80;
							footer = largoPantalla * .05;
							
							if(screen.width <= 800){
								var headerCenter = Header/10
							}else {
								var headerCenter = Header/5
							}
							
							$('.divWrapperHeader').css("height",Header + "px");
							$('.divWrapperHeaderCenter').css("height",headerCenter + "px");
							$('.divWrapperImage').css("height",content + "px");
							$('.divWrapperFooter').css("height",footer + "px");
							$('.divWrapperImageLeft').css("height",Header + "px");
							$('.divWrapperImageRight').css("height",Header + "px");
							$('.divWrapperImageCenter').css("height",Header + "px");
							//$('.divWrapperFooterLeft').css("height",footer + "px");
							
						
					} else {
						for(var i= 0; i < 1;i++){
							
							if(data[i].image == 1){
								var imagePerro = 'https://amorperron.com/perros_perfil/perros_perfil' + data[i].id  + '.jpg';
							} else {
								var imagePerro = "images/silueta_perro.jpg"	
							}
							
							var lugar = "";
						
							if(data[i].municipio == null && data[i].estado == null){
								lugar = data[i].direccion;
							}else if(data[i].municipio == null && data[i].estado != null){
								lugar = data[i].direccion + ", " + data[i].estado;
							} else if(data[i].municipio != null && data[i].estado == null){
								lugar = data[i].direccion + ", " + data[i].municipio;
							} else {
								lugar = data[i].direccion + ", " + data[i].municipio + ", " + data[i].estado;
							}
					
							$('#divWrapperContent').append(
                        		'<div id="divWrapperHeader" class="divWrapperHeader">' +
                    			'</div>' +
                    			'<div id="divWrapperImage" class="divWrapperImage">' +
                    			'<div id="divWrapperImageLeft" class="divWrapperImageLeft"></div>' +
                    			'<div id="imageDogs">' +
                        		'<img width="100%" height="100%" src="' + imagePerro + '" id="dog' + fotoNumero + '" onerror="imgError(this);"/>' +
                        		'</div>' +
                    			'</div>' +
                    			'<div id="divWrapperFooter" class="divWrapperFooter">' +
									'<div id="divWrapperFooterLeft" class="divWrapperFooterLeft"></div>' +
                            	'<div id="divWrapperFooterContent"><br/>' +
								'<p class="labelImageNombre"> ' + data[i].nombre + ' </p>'+
								'<p class="labelImage"> ' + lugar +' </p>'+
                            	'</div>'+
							'</div>'
							);
						
							var dog = "dog" + fotoNumero
							
							widthImage = $('#' + dog).css('width');
							heightImage = $('#' + dog).css('height');
							
							var resWidth = widthImage.split("px");
							var resHeight = heightImage.split("px");
							
							var redirHeight = (screen.width/resWidth[0]) * resHeight[0];
							
							$('#' + dog).css('width',screen.width);
							$('#' + dog).css('height',redirHeight);
							
							fotoNumero++;
							
						}
						
						var largoPantalla = screen.height;
						largoPantalla = largoPantalla*.75;
						Header = largoPantalla * .05;
					//content = largoPantalla * .60;
						footer = largoPantalla * .37;
						$('.divWrapperHeader').css("height",Header + "px");
					//$('.divWrapperImage').css("height",content + "px");
						$('.divWrapperFooter').css("height",footer + "px");
					//$('.divWrapperImageLeft').css("height",content + "px");
						$('.divWrapperFooterLeft').css("height",footer + "px");
						
					}
					
					numfotos = 1;
					
					myScroll.refresh();	
					
					$('#cargandologinSecion').hide();
					$('#btnLongIn').attr('disabled',false);
					$('#loginSecion').removeClass("activePage");
					$('#home').addClass("activePage");
					$('#loginSecion').css("left","-" + anchoPantalla + "px");
					$('#login').css("left","-" + anchoPantalla + "px");
					$('#home').css("left","0%");
					tipoFoto = 0;
					$('#iconLoupe').show();
					$('#iconHome').hide();
					$('.app').hide();
					$('#cargando').show();
					
					restructureScreen();
					
            	},
				error: function(data){
					alert("Error al cargar la galeria");
					tipoFoto = 0;
					$('#cargandologinSecion').hide();
					$('#btnLongIn').attr('disabled',false);
					$('#loginSecion').removeClass("activePage");
					$('#home').addClass("activePage");
					$('#loginSecion').css("left","-" + anchoPantalla + "px");
					$('#login').css("left","-" + anchoPantalla + "px");
					$('#home').css("left","0%");
					$('.app').hide();
					$('#cargando').show();
				}
        	});
			
	}
	
	
	//// facebook api //////
	
	function insertarUsuariosFace(){
		
		$('#divWrapperContent').empty();
		
		facebookConnectPlugin.api( "me/?fields=id,email,name",[],
		function (response) {
			
				if(response.email == undefined){
					
					$('#home').removeClass("activePage");
					$('#login').addClass("activePage");
					$('#home').css("left","-" + anchoPantalla + "px");
					$('#login').css("left","10%");
					
				} else {
			
				$.ajax({
            	type: "POST",
            	url: "https://amorperron.com/app/comprobarCorreo",
				//url: "http://localhost:8080/amorperron/agregarUsuario.php",
            	dataType:'json',
            	data: {
					email: response.email
            	},
            	success: function(data){
					if(data.length == 0){
						//alert("correo inexistente")
						//registramos al usuario
						addUserFacebook(response);
						} else {
							localStorage.setItem("idUser", data[0].id);
							$('#idUser').val(data[0].id)
							mostrarImagen();
						}
					
            	}, error: function(){
					alert("Error al registrar usuario intentelo mas tarde");
					$("#cargandoRegistration").hide();
					$("#btnAddUser").attr('disabled',false);
				}
        	});
				}
			
			},
        function (response) { alert(response) });
	}
	
	function addUserFacebook(datos){
		
		var f = new Date();
		fecha = (f.getFullYear() + "-" + (f.getMonth() +1) + "-" + f.getDate());
		
		$.ajax({
            type: "POST",
            url: "https://amorperron.com/app/RegistrarUsuarioApp",
            dataType:'json',
            data: { 
			usuario: datos.name, 
			email: datos.email, 
			password: $('#txtPassword').val(),
			birthday: "",
			fecha: fecha
            },
            success: function(data){
				$('#idUser').val(data)
				localStorage.setItem("idUser", data);
				$('#login').removeClass("activePage");
				$('#home').addClass("activePage");
				$('#login').css("left","-" + anchoPantalla + "px");
				$('#home').css("left","10%");
				clearRegistro();
				mostrarImagen();
            	}, error: function(data){
				alert("Error al registrar usuario intentelo mas tarde");
				$('#home').removeClass("activePage");
				$('#login').addClass("activePage");
				$('#home').css("left","-" + anchoPantalla + "px");
				$('#login').css("left","10%");
			}
        });		
	}
	
	/////// funcion para mostrar todos los perros encontrados
	
	$(document).on('click','#iconLoupe',function(){ showAllDog(); });
	
	$(document).on('click','#iconHome',function(){ showMyDogs(); });
	
	function showAllDog(){
		
		fotoNumero = 0;
		
		//revokePermissions();
		
		$('#divWrapperContent').empty();
		$('.divWrapperWhite').empty();
		
		$('.divWrapperWhite').append(
			'<div id="divWrapperHeader" class="divWrapperHeader">' +
			'</div>' +
			'<div id="divWrapperImage" class="divWrapperImage">' +
			'<div id="divWrapperImageLeft" class="divWrapperImageLeft"></div>' +
			'<div id="imageDogs">' +
			'<div id="" style="text-align:center;">' +
			'<img src="img/ajax-loader.gif" height="10%" width="15%"/ >' +
			'<p class="labelImage">Cargando fotos de los perros...</p>'+
			'</div>' +
			'</div>' +
			'</div>' +
			'<div id="divWrapperFooter" class="divWrapperFooter">' +
			'<div id="divWrapperFooterLeft" class="divWrapperFooterLeft"></div>' +
			'<div id="divWrapperFooterContent"><br/>' +
			'</div>'+
			'</div>'
		);
		
			var largoPantalla = screen.height;
			largoPantalla = largoPantalla*.75;
			Header = largoPantalla * .40;
			content = largoPantalla * .30;
			footer = largoPantalla * .1;
			$('.divWrapperHeader').css("height",Header + "px");
			$('.divWrapperImage').css("height",content + "px");
			$('.divWrapperFooter').css("height",footer + "px");
					
			tipoFoto = 3;
		
		$.ajax({
            	type: "POST",
            	url: "https://amorperron.com/app/mostrarGaleria",
            	dataType:'json',
            	data: {  
					id:$('#idUser').val(),
					numfotos:0,
					numMaxfotos:numMaxfotos,
					tipoFoto:1,
					ciudad:ciudad,
					estado:estado,
					a:"aaasbsahashdbswbasdbhasdb"
            	},
            	success: function(data){
					
					$('#divWrapperContent').empty();
					$('.divWrapperWhite').empty();
					
					if(data.length == 0){
						
						$('.divWrapperWhite').append(
                        		'<div id="divWrapperHeader" class="divWrapperHeader">' +
								'<div id="divWrapperImageLeft" class="divWrapperImageLeft"></div>' +
								'<div id="divWrapperImageCenter" class="divWrapperImageCenter">' +
								'<div id="divWrapperHeaderCenter" class="divWrapperHeaderCenter"></div>' +
								'<p class="labelImage">Colabora tomándole foto a perros de la calle para ayudar a que sus dueños los recuperen</p>' + 
								'</div>'+
                    			'</div>' +
                    			'<div id="divWrapperImage" class="divWrapperImage">' +
                    			'<div id="imageDogs">' +
                        		'<img src="images/fondoDefault.jpg" id="dog" width="100%" height="auto"/>' +
                        		'</div>' +
                    			'</div>' +
                    			'<div id="divWrapperFooter" class="divWrapperFooter">' +
									'<div id="divWrapperFooterLeft" class="divWrapperFooterLeft"></div>' +
                            	'<div id="divWrapperFooterContent">' +
                            	'</div>'+
							'</div>'
							);
							
							
							var largoPantalla = screen.height;
							largoPantalla = largoPantalla*.75;
							Header = largoPantalla * .20;
							var headerCenter = Header/10
							content = largoPantalla * .80;
							footer = largoPantalla * .05;
							
							$('.divWrapperHeader').css("height",Header + "px");
							$('.divWrapperHeaderCenter').css("height",headerCenter + "px");
							$('.divWrapperImage').css("height",content + "px");
							$('.divWrapperFooter').css("height",footer + "px");
							$('.divWrapperImageLeft').css("height",Header + "px");
							$('.divWrapperImageRight').css("height",Header + "px");
							$('.divWrapperImageCenter').css("height",Header + "px");
							//$('.divWrapperFooterLeft').css("height",footer + "px");
						
					} else {
						for(var i= 0; i < data.length;i++){
							
							if(data[i].image == 1){
								var imagePerro = 'https://amorperron.com/perros_perfil/perros_perfil' + data[i].id  + '.jpg';
							} else {
								var imagePerro = "images/silueta_perro.jpg"	
							}
							
							var lugar = "";
							var estatus = "";
						
							if(data[i].municipio == null && data[i].estado == null){
								lugar = data[i].direccion;
							}else if(data[i].municipio == null && data[i].estado != null){
								lugar = data[i].direccion + ", " + data[i].estado;
							} else if(data[i].municipio != null && data[i].estado == null){
								lugar = data[i].direccion + ", " + data[i].municipio;
							} else {
								lugar = data[i].direccion + ", " + data[i].municipio + ", " + data[i].estado;
							}
							
							if(data[i].objetivo == 1){
								estatus = "Perdido";
							} else if(data[i].objetivo == 5){
								estatus = "Encontrado";
							}
					
							$('#divWrapperContent').append(
                        		'<div id="divWrapperHeader" class="divWrapperHeader">' +
                    			'</div>' +
                    			'<div id="divWrapperImage" class="divWrapperImage">' +
                    			'<div id="divWrapperImageLeft" class="divWrapperImageLeft"></div>' +
                    			'<div id="imageDogs">' +
                        		'<img width="100%" height="100%" src="' + imagePerro + '" id="dog' + fotoNumero + '" onerror="imgError(this);"/>' +
                        		'</div>' +
                    			'</div>' +
                    			'<div id="divWrapperFooter" class="divWrapperFooter">' +
									'<div id="divWrapperFooterLeft" class="divWrapperFooterLeft"></div>' +
                            	'<div id="divWrapperFooterContent"><br/>' +
								'<div id="imageDogs">' +
								'<p class="labelImageNombre"> ' + data[i].nombre + ' </p>'+
								'<p class="labelImage"> ' + lugar +' </p>'+
								'<p class="labelImage"> ' + estatus +' </p>' +
								'</div>' +
                            	'</div>'+
							'</div>'
							);
							
							var dog = "dog" + fotoNumero
							
							widthImage = $('#' + dog).css('width');
							heightImage = $('#' + dog).css('height');
							
							var resWidth = widthImage.split("px");
							var resHeight = heightImage.split("px");
							
							var redirHeight = (screen.width/resWidth[0]) * resHeight[0];
							
							$('#' + dog).css('width',screen.width);
							$('#' + dog).css('height',redirHeight);
							fotoNumero++;
						}
						
						var largoPantalla = screen.height;
						largoPantalla = largoPantalla*.75;
						Header = largoPantalla * .05;
						//content = largoPantalla * .65;
						footer = largoPantalla * .50;
						$('.divWrapperHeader').css("height",Header + "px");
						//$('.divWrapperImage').css("height",content + "px");
						$('.divWrapperFooter').css("height",footer + "px");
						//$('.divWrapperImageLeft').css("height",content + "px");
						$('.divWrapperFooterLeft').css("height",footer + "px");
						
					}
					
					numfotos = 3;
					
					myScroll.refresh();	
					
					tipoFoto = 1;
					
					$('#iconHome').show();
					$('#iconLoupe').hide();
            	},
				error: function(data){
					alert("Error al cargar la galeria");
					$('#cargandologinSecion').hide();
					$('#btnLongIn').attr('disabled',false);
					$('#loginSecion').removeClass("activePage");
					$('#home').addClass("activePage");
					$('#loginSecion').css("left","-" + anchoPantalla + "px");
					$('#login').css("left","-" + anchoPantalla + "px");
					$('#home').css("left","0%");
				}
        	});
	}
	
	function showMyDogs(){
		fotoNumero = 0;
		mostrarImagen();	
	}
	
	///// recompocicion de las pantallas //////
	
	function restructureScreen(){
		/*$('#home').css({"position":"absolute","height":"100%","width":"100%"});
		$('#login').css({"position":"absolute","height":"100%","width":"100%"});
		$('#loginSecion').css({"position":"absolute","height":"100%","width":"100%"});	
		$('#registration').css({"position":"absolute","height":"100%","width":"100%"});
		$('#EviarResultado').css({"position":"absolute","height":"100%","width":"100%"});
		
		$('#divFooterHome').css({"position":"absolute","bottom":"1px","width":"100%","height":"10%"});	*/
	}
	
	///funciones de google analityc
	
	function successHandler(){
		alert("hola")
		
	}
	
	function errorHandler(){
		alert("adios")
	}