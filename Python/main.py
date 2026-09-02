import os
import shutil
import uuid
from typing import Optional
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import math
import models
import schemas
import auth
from database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API de Gestión de RRHH")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.post("/registro", response_model=schemas.Token)
def registro(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    existente = db.query(models.Usuario).filter(models.Usuario.nombre_usuario == usuario.nombre_usuario).first()
    if existente:
        raise HTTPException(status_code=400, detail="Ese nombre de usuario ya existe")

    nuevo_usuario = models.Usuario(
        nombre_usuario=usuario.nombre_usuario,
        password_hash=auth.hash_password(usuario.password),
    )
    db.add(nuevo_usuario)
    db.commit()

    token = auth.crear_token({"sub": nuevo_usuario.nombre_usuario})
    return {"access_token": token}


@app.post("/login", response_model=schemas.Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    usuario = db.query(models.Usuario).filter(models.Usuario.nombre_usuario == form.username).first()
    if not usuario or not auth.verificar_password(form.password, usuario.password_hash):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    token = auth.crear_token({"sub": usuario.nombre_usuario})
    return {"access_token": token}



@app.post("/puestos", response_model=schemas.Puesto)
def crear_puesto(
    puesto: schemas.PuestoCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual),
):
    nuevo = models.Puesto(**puesto.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.get("/puestos", response_model=list[schemas.Puesto])
def listar_puestos(db: Session = Depends(get_db)):
    return db.query(models.Puesto).all()



@app.post("/empleados", response_model=schemas.Empleado)
def crear_empleado(
    empleado: schemas.EmpleadoCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual),
):
    puesto = db.query(models.Puesto).filter(models.Puesto.id == empleado.puesto_id).first()
    if not puesto:
        raise HTTPException(status_code=404, detail="El puesto indicado no existe")

    nuevo = models.Empleado(**empleado.model_dump())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo


@app.get("/empleados", response_model=schemas.EmpleadosPaginados)
def listar_empleados(
    pagina: int = 1,
    limite: int = 20,
    numero_empleado: Optional[str] = None,
    puesto_id: Optional[int] = None,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual),
):
    consulta = db.query(models.Empleado)

    if numero_empleado:
        consulta = consulta.filter(models.Empleado.numero_empleado.ilike(f"%{numero_empleado}%"))

    if puesto_id:
        consulta = consulta.filter(models.Empleado.puesto_id == puesto_id)

    total = consulta.count()
    total_paginas = math.ceil(total / limite) if total > 0 else 1

    resultados = consulta.offset((pagina - 1) * limite).limit(limite).all()

    return {
        "total": total,
        "pagina": pagina,
        "total_paginas": total_paginas,
        "resultados": resultados,
    }


@app.get("/empleados/{empleado_id}", response_model=schemas.Empleado)
def ver_empleado(
    empleado_id: int,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual),
):
    empleado = db.query(models.Empleado).filter(models.Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado


@app.put("/empleados/{empleado_id}", response_model=schemas.Empleado)
def actualizar_empleado(
    empleado_id: int,
    datos: schemas.EmpleadoCreate,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual),
):
    empleado = db.query(models.Empleado).filter(models.Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    for campo, valor in datos.model_dump().items():
        setattr(empleado, campo, valor)

    db.commit()
    db.refresh(empleado)
    return empleado


@app.delete("/empleados/{empleado_id}")
def eliminar_empleado(
    empleado_id: int,
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual),
):
    empleado = db.query(models.Empleado).filter(models.Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    db.delete(empleado)
    db.commit()
    return {"mensaje": "Empleado eliminado correctamente"}


@app.post("/empleados/{empleado_id}/foto", response_model=schemas.Empleado)
def subir_foto_empleado(
    empleado_id: int,
    foto: UploadFile = File(...),
    db: Session = Depends(get_db),
    usuario_actual: models.Usuario = Depends(auth.obtener_usuario_actual),
):
    empleado = db.query(models.Empleado).filter(models.Empleado.id == empleado_id).first()
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    extension = foto.filename.split(".")[-1]
    nombre_archivo = f"{uuid.uuid4()}.{extension}"
    ruta_destino = os.path.join("uploads", nombre_archivo)

    with open(ruta_destino, "wb") as buffer:
        shutil.copyfileobj(foto.file, buffer)

    empleado.foto_url = f"/uploads/{nombre_archivo}"
    db.commit()
    db.refresh(empleado)
    return empleado