<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
Class app_model extends CI_MODEL
{
 
    public function __construct(){
        parent::__construct();
    }
 
    public function loginApp($email,$password){
		$this->db->select ('usuarios.id');
        $this->db->from('usuarios');
        $this->db->where('usuarios.email = ', $email);
        $this->db->where('usuarios.password = ',$password);
		$this->db->where('usuarios.activate = 1');
        return  $this->db->get()->result();	
	}
	
	public function comprobarCorreo($email){
		$this->db->select ('usuarios.id,usuarios.email');
        $this->db->from('usuarios');
        $this->db->where('usuarios.email = ', $email);
        return  $this->db->get()->result();	
	}
	
	public function mostrarGaleria($id,$numfotos,$numMaxfotos){
		$this->db->select ('perros.id,perros.nombre,perros.direccion,perros.estado,perros.ciudad');
		$this->db->select ('estados.estado, municipios.municipio');
        	$this->db->from('perros');
        	$this->db->join('estados', 'perros.estado = estados.idestados','left');
        	$this->db->join('municipios', 'perros.ciudad = municipios.idmunicipios', 'left');
		$this->db->where('perros.propietario =',$id);
		$this->db->limit($numMaxfotos,$numfotos);
		$this->db->order_by("id", "desc"); 
        	return  $this->db->get()->result();	
	}
	
	public function mostrarGaleriaPerros($numfotos,$numMaxfotos,$tipo,$idLocalizacion){
		$this->db->select ('perros.id,perros.nombre,perros.direccion,perros.estado,perros.ciudad, perros.objetivo');
		$this->db->select ('estados.estado, municipios.municipio');
        	$this->db->from('perros');
        	$this->db->join('estados', 'perros.estado = estados.idestados','left');
        	$this->db->join('municipios', 'perros.ciudad = municipios.idmunicipios','left');
        	if($tipo == "ciudad"){
			$this->db->where('perros.ciudad = ', $idLocalizacion);
		} else if($tipo == "estado"){
			$this->db->where('perros.estado = ', $idLocalizacion);
		}
		$this->db->where('(perros.objetivo = 5 or perros.objetivo = 1)');
		$this->db->limit($numMaxfotos,$numfotos);
		$this->db->order_by("id", "desc");
        	return  $this->db->get()->result();	
	}
	
	public function idEstado($estado){
		$this->db->select ('idestados');
        	$this->db->from('estados');
		$this->db->where('estado = ', $estado);
        	return  $this->db->get()->result();
	}
	
	public function idMunicipio($idEstado){
		$this->db->select ('idmunicipios, municipio');
        	$this->db->from('municipios');
		$this->db->where('idestado = ', $idEstado);
        	return  $this->db->get()->result();
	}
	
	/*public function idCiudad($idMunicipio){
		$this->db->select ('idlocalidades,localidad');
        	$this->db->from('localidades');
		$this->db->where('idMunicipio = ', $idMunicipio);
        	return  $this->db->get()->result();
	}*/
	
	/*public function idCiudad($idMunicipio){
		$this->db->select ('idlocalidades,localidad');
        	$this->db->from('localidades');
		$this->db->where('idMunicipio = ', 1808);
        	return  $this->db->get()->result();
	}*/
	
	public function RegistrarUsuarioApp($data){
		$this->db->insert('usuarios', $data);
		return $this->db->insert_id(); 
	}
	
	public function RegistrarPerroApp($data){
		$this->db->insert('perros', $data);
		return $this->db->insert_id();
	}
	
	public function registrarFotoPerro($data){
		$this->db->insert('fotos', $data);
	}
	
}
//end model