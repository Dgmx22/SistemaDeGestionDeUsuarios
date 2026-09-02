from pydantic import BaseModel

class PuestoBase(BaseModel):
    nombre_puesto: str
    salario: float

class PuestoCreate(PuestoBase):
    pass

class Puesto(PuestoBase):
    id: int

    class Config:
        from_attributes = True


class EmpleadoBase(BaseModel):
    numero_empleado: str
    nombre: str
    apellido_paterno: str
    apellido_materno: str
    telefono: str
    correo: str
    direccion: str
    puesto_id: int

class EmpleadoCreate(EmpleadoBase):
    pass

class Empleado(EmpleadoBase):
    id: int
    foto_url: str | None = None
    puesto: Puesto 

    class Config:
        from_attributes = True

class UsuarioCreate(BaseModel):
    nombre_usuario: str
    password: str

class UsuarioLogin(BaseModel):
    nombre_usuario: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class EmpleadosPaginados(BaseModel):
    total: int
    pagina: int
    total_paginas: int
    resultados: list[Empleado]