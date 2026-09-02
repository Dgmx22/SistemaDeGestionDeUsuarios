from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nombre_usuario = Column(String, unique=True, index=True)
    password_hash = Column(String)


class Puesto(Base):
    __tablename__ = "puestos"

    id = Column(Integer, primary_key=True, index=True)
    nombre_puesto = Column(String, unique=True, index=True)
    salario = Column(Float)

    empleados = relationship("Empleado", back_populates="puesto")


class Empleado(Base):
    __tablename__ = "empleados"

    id = Column(Integer, primary_key=True, index=True)
    numero_empleado = Column(String, unique=True, index=True)
    nombre = Column(String)
    apellido_paterno = Column(String)
    apellido_materno = Column(String)
    telefono = Column(String)
    correo = Column(String)
    direccion = Column(String)
    foto_url = Column(String, nullable=True)

    puesto_id = Column(Integer, ForeignKey("puestos.id"))
    puesto = relationship("Puesto", back_populates="empleados")