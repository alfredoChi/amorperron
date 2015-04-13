<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

class appv extends CI_Controller {
	
	public function appv(){
        parent::__construct();
		$this->load->model('app_model');
    }
	
	public function loginApp(){
	    $password = md5($_POST['password']);
            $data = $this->app_modelv->loginApp($_POST['email'],$password);
            echo json_encode($data);
	}
	
	public function comprobarCorreo(){
            $data = $this->app_model->comprobarCorreo($_POST['email']);
            echo json_encode($data);
	}
	
	public function mostrarGaleria(){
		if($_POST['tipoFoto'] == 0){
			$data = $this->app_model->mostrarGaleria($_POST['id'],$_POST['numfotos'],$_POST['numMaxfotos']);
			
			
			foreach ($data as $item):
			
				if (file_exists("perros_perfil/perros_perfil" . $item->id . ".jpg" )){ 
					$item->image = 1;
				}else{ 
					$item->image = 0;
				} 	
       			endforeach;
			
		} else if($_POST['tipoFoto'] == 1){
		
			$idEstado = 0;
			$idCiudad = 0;
			$tipo= "pais";
			$idLocalizacion = 0;
	
			$resultEstado = $this->app_model->idEstado($_POST['estado']);
		
			if(count($resultEstado) > 0){
				$idEstado= $resultEstado[0]->idestados;
				$tipo = "estado";
				$idLocalizacion  = $idEstado;
				$resultMunicipio = $this->app_model->idMunicipio($idEstado);
				
				foreach($resultMunicipio as $item){
					if($item->municipio== $_POST['ciudad']){
						$idCiudad  = $item->idmunicipios;
						$idLocalizacion  = $idCiudad;
						$tipo = "ciudad";
					}
				}
			}
		
			$data = $this->app_model->mostrarGaleriaPerros($_POST['numfotos'],$_POST['numMaxfotos'],$tipo,$idLocalizacion );
			
			foreach ($data as $item):
			
				if (file_exists("perros_perfil/perros_perfil" . $item->id . ".jpg" )){ 
					$item->image = 1;
				}else{ 
					$item->image = 0;
				} 	
       			endforeach;
			
		} else {
			$data = "";
		}
        	echo json_encode($data);
	}
	
	public function RegistrarUsuarioApp(){
	
		$data = $this->app_model->comprobarCorreo($_POST['email']);
		
		if(count($data) == 0){
		
		
			$password = md5($_POST['password']);
		
			/*if($_POST['birthday'] != ""){
				//$originalDate = $_POST['birthday'];
				//$newDate = date("d-m-Y", strtotime($originalDate));
			
				$invert = explode("/",$_POST['birthday']); 
				$newDate = $invert[2]."-".$invert[1]."-".$invert[0];
			
			} else {
				$newDate = "";
			}*/
		
			$insert = array(
					'nombre' 			=> $_POST['usuario'],
					'email' 			=> $_POST['email'],
					'password' 			=> $password,
					'activate'			=> 1,
					'sexo' 				=> "",
					'fecha_nacimiento' 		=> "",
					'ciudad' 			=> "",
					'direccion' 			=> "",
					'telefono' 			=> "",
					'foto' 				=> "/images/persona-default.png",
					'show_email' 			=> 0,
					'rec_nov' 			=> 0,
					'rec_not' 			=> 0,
					'n_perros' 			=> 0,
					'estado' 			=> 0,
					'registro' 			=> $_POST['fecha'],
					'env_not' 			=> 0,
					'remider' 			=> 0,
					'adopt_not' 			=> "");
				$data = $this->app_model->RegistrarUsuarioApp($insert);
				$message = array('success' => true, 'message' => 'usuario registrado.', 'id' => $data);
			} else {
				$message = array('success' => false, 'message' => 'Correo existente. Por favor escriba otro.', 'id' => $data[0]->id);
			}
		echo json_encode($message);
	}
	
	public function subirPerro(){
	
		$idEstado = 0;
		$idCiudad = 0;
	
		$resultEstado = $this->app_model->idEstado($_REQUEST['estado']);
		
		if(count($resultEstado) > 0){
			$idEstado= $resultEstado[0]->idestados;
			
			$resultMunicipio = $this->app_model->idMunicipio($idEstado);
			
			foreach($resultMunicipio as $item){
				if($item->municipio== $_REQUEST['ciudad']){
					$idCiudad  = $item->idmunicipios;
				}
			}
		}
		$insert = array(
				'propietario' 			=> $_REQUEST['propietario'],
				'nombre' 			=> $_REQUEST['nombrePerro'],
				'pedigree' 			=> "",
				'sexo'				=> "n",
				'fecha_nacimiento' 		=> "",
				'ciudad' 			=> $idCiudad,
				'celo' 				=> "",
				'caracteristicas' 		=> "",
				'comentario' 			=> "",
				'foto' 				=> "Y",
				'raza' 				=> 337,
				'video' 			=> "",
				'estado' 			=> $idEstado,
				'video2' 			=> "",
				'n_fotos' 			=> 0,
				'objetivo' 			=> 5,
				'direccion' 			=> $_REQUEST['direccion'],
				'amigable' 			=> "",
				'habilidad' 			=> "",
				'activo' 			=> "",
				'inteligencia' 			=> "",
				'registro' 			=> $_REQUEST['fecha'],
				'lat' 				=> $_REQUEST['lat'],
				'lon' 				=> $_REQUEST['long'],
				'perdido_murio' 		=> "");
		$data = $this->app_model->RegistrarPerroApp($insert);
		
		$ruta = "/home/aperron/public_html/perros_perfil/";
		$nombre_imagen = "perros_perfil" . $data . ".jpg";
		move_uploaded_file($_FILES["file"]["tmp_name"], $ruta.$nombre_imagen);
				
		
		echo json_encode($data);
		}
	

}