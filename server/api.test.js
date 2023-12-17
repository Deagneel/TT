import request from 'supertest';
import app from './server.js';

let agent;

describe('API REST Tests', function() {

    before(function(done) {
        agent = request.agent(app);

        agent
            .post('/login')
            .send({ correo: 'jrodriguezcoronado1@gmail.com', contrasena: 'JesusRC1' })
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });

    describe('POST /login', function() {
        it('debería responder con json conteniendo un estado de login', function(done) {
            request(app)
                .post('/login')
                .send({correo: 'test@example.com', contrasena: '123456'})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /geocode', function() {
        it('debería devolver datos de geocodificación para una dirección', function(done) {
            request(app)
                .get('/geocode?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA')
                .expect(200, done);
        });
    });

    describe('POST /upload', function() {
        it('debería cargar un archivo y devolver la URL', function(done) {
            request(app)
                .post('/upload')
                .attach('image', 'public/images/IPN.png')
                .expect(200, done);
        });
    });

    describe('GET /perfil', function() {
    
        it('debería devolver información del perfil', function(done) {
            agent
                .get('/perfil')
                .expect(200, done);
        });
    });

    describe('GET /obtenerEscuelas', function() {
        it('debería devolver todas las escuelas', function(done) {
            request(app)
                .get('/obtenerEscuelas')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /escuela/:id_escuela', function() {
        it('debería devolver datos de una escuela específica', function(done) {
            const idEscuela = 1;
            request(app)
                .get(`/escuela/${idEscuela}`)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /infoinmuebles/:id_inmueble', function() {
        it('debería devolver información de un inmueble específico', function(done) {
            const idInmueble = 1;
            request(app)
                .get(`/infoinmuebles/${idInmueble}`)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /newName/:id', function() {
        it('debería actualizar el nombre del usuario', function(done) {
            const userId = 1;
            const nuevoNombre = 'Nuevo Nombre';

            request(app)
                .put(`/newName/${userId}`)
                .send({ nombre: nuevoNombre })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    if (res.body.mensaje !== 'Nombre de usuario actualizado exitosamente.') {
                        return done(new Error("Respuesta inesperada del servidor"));
                    }
                    done();
                });
        });
    });

    describe('PUT /newApe/:id', function() {
        it('debería actualizar el primer apellido del usuario', function(done) {
            request(app)
                .put('/newApe/1')
                .send({ primer_apellido: 'ApellidoNuevo' })
                .expect(200, done); 
        });
    });

    describe('PUT /newApe2/:id', function() {
        it('debería actualizar el segundo apellido del usuario', function(done) {
            request(app)
                .put('/newApe2/1')
                .send({ segundo_apellido: 'Apellido2Nuevo' })
                .expect(200, done);
        });
    });

    describe('PUT /newIne/:id', function() {
        it('debería actualizar la identificación oficial del usuario', function(done) {
            const userId = 1;
            const nuevaIdentificacion = 'INE1234567890';
            request(app)
                .put(`/newIne/${userId}`)
                .send({ correo: nuevaIdentificacion })
                .expect(200, done);
        });
    });

    describe('PUT /newCredencial/:id', function() {
        it('debería actualizar la credencial de estudiante del usuario', function(done) {
            const userId = 1;
            const nuevaCredencial = 'CRED1234567890';
            request(app)
                .put(`/newCredencial/${userId}`)
                .send({ correo: nuevaCredencial })
                .expect(200, done);
        });
    });

    describe('PUT /newComprobante/:id', function() {
        it('debería actualizar el comprobante de inscripción del usuario', function(done) {
            const userId = 1;
            const nuevoComprobante = 'image_1702111982531.pdf';

            request(app)
                .put(`/newComprobante/${userId}`)
                .send({ correo: nuevoComprobante })
                .expect(200, done);
        });
    });

    describe('PUT /newComprobanteD/:id', function() {
        it('debería actualizar el comprobante de domicilio del usuario', function(done) {
            const userId = 1;
            const nuevoComprobante = 'image_1702111982531.pdf';

            request(app)
                .put(`/newComprobanteD/${userId}`)
                .send({ correo: nuevoComprobante })
                .expect(200, done);
        });
    });

    describe('PUT /editarinmueble/:id_inmueble', function() {
        it('debería requerir autenticación para actualizar un inmueble', function(done) {
            const idInmueble = 1;
            const inmuebleData = {
                title: 'Nuevo Título',
                address: 'Nueva Dirección',
                asentamiento: 'Nuevo Asentamiento',
                cp: '12345',
                alcaldia: 'Nueva Alcaldía',
                latitud: '19.432608',
                longitud: '-99.133209',
                price: 2000,
                period: 'anual',
                numRooms: 4,
                regulations: 'No mascotas',
                caracteristicas: 'Amueblado',
                Tvivienda: 'casa',
                activo: 1,
                foto: 'urlFoto.jpg',
            };

            request(app)
                .put(`/editarinmueble/${idInmueble}`)
                .send(inmuebleData)
                .expect(401, done);
        });
    });

    describe('DELETE /eliminarUsuario/:idUsuario', function() {
        it('debería manejar la eliminación de un usuario no existente', function(done) {
          const idUsuarioInexistente = 999999;
          request(app)
            .delete(`/eliminarUsuario/${idUsuarioInexistente}`)
            .expect(404)
            .end((err, res) => {
              if (err) return done(err);
              done();
            });
        });
    });

    describe('GET /inmueblearrendatario', function() {
        it('debería obtener todos los inmuebles para arrendatarios', function(done) {
          request(app)
            .get('/inmueblearrendatario')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              done();
            });
        });
    });

    describe('GET /obtenerReporteesp/:id_reporte', function() {
        it('debería obtener un reporte específico', function(done) {
          const idReporte = 24;
          request(app)
            .get(`/obtenerReporteesp/${idReporte}`)
            .expect('Content-Type', /json/)
            .expect(200) 
            .end((err, res) => {
              if (err) return done(err);
              done();
            });
        });
    });

    describe('PUT /resolverReporte/:id_reporte/:id_usuario', function() {
        it('debería resolver y eliminar un reporte', function(done) {
          const idReporte = 1;
          const idUsuario = 1;
      
          request(app)
            .put(`/resolverReporte/${idReporte}/${idUsuario}`)
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              done();
            });
        });
      });

    describe('PUT /pausarInmueble/:id_inmueble', function() {
        it('debería cambiar el estado de un inmueble', function(done) {
            const idInmueble = 1;
            const estadoActivo = 0;

            request(app)
            .put(`/pausarInmueble/${idInmueble}`)
            .send({ activo: estadoActivo })
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('POST /generarReporte', function() {
        it('debería insertar un nuevo reporte y actualizar el contador de reportes del usuario', function(done) {
          const reporteData = {
            aff: 'Asunto del reporte',
            description: 'Descripción del reporte',
            date: new Date().toISOString().slice(0, 10),
            id_usuario: 1,
            id_inmueble: 1
          };
      
          request(app)
            .post('/generarReporte')
            .send(reporteData)
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              done();
            });
        });
      });

      describe('GET /obtenerReportes', function() {
        it('debería devolver todos los reportes', function(done) {
          request(app)
            .get('/obtenerReportes')
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });

    describe('GET /obtenerReportesPorUsuario/:parametroBusqueda', function() {
        it('debería devolver reportes relacionados con un usuario específico', function(done) {
          const parametroBusqueda = '1';
          request(app)
            .get(`/obtenerReportesPorUsuario/${parametroBusqueda}`)
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });

    describe('GET /obtenerReportesPorInmueble/:parametroBusqueda', function() {
        it('debería devolver reportes relacionados con un inmueble específico', function(done) {
          const parametroBusqueda = '1';
          request(app)
            .get(`/obtenerReportesPorInmueble/${parametroBusqueda}`)
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });
    
    describe('GET /obtenerNoReportesUsuario/:idUsuario', function() {
        it('debería devolver el número de reportes de un usuario específico', function(done) {
          const idUsuario = 1;
          request(app)
            .get(`/obtenerNoReportesUsuario/${idUsuario}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              done();
            });
        });
    });
      
    describe('GET /obtenerNombreUsuario/:idUsuario', function() {
        it('debería devolver el nombre completo de un usuario específico', function(done) {
          const idUsuario = 1;
          request(app)
            .get(`/obtenerNombreUsuario/${idUsuario}`)
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });
      
    describe('GET /obtenerTituloInmueble/:idInmueble', function() {
        it('debería devolver el título y estado de un inmueble específico', function(done) {
          const idInmueble = 1;
          request(app)
            .get(`/obtenerTituloInmueble/${idInmueble}`)
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });

    describe('GET /obtenerCorreoUsuario/:id_usuario', function() {
        it('debería devolver el correo de un usuario específico', function(done) {
          const id_usuario = 1;
          request(app)
            .get(`/obtenerCorreoUsuario/${id_usuario}`)
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });

    describe('GET /obtenerInmuebleInfo/:id_inmueble', function() {
        it('debería devolver información de un inmueble específico', function(done) {
          const id_inmueble = 1;
          request(app)
            .get(`/obtenerInmuebleInfo/${id_inmueble}`)
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });

  describe('POST /recuperar-contrasena', function() {
    it('debería devolver mensaje de éxito si el correo existe', function(done) {
      const correoExistente = 'jrodriguezcoronado1@gmail.com';
      request(app)
        .post('/recuperar-contrasena')
        .send({ correo: correoExistente })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          if (res.body.message !== 'Se ha enviado un correo para restablecer la contraseña') {
            return done(new Error("Respuesta inesperada del servidor"));
          }
          done();
        });
    });
  
    it('debería devolver un mensaje de error si el correo no existe', function(done) {
      const correoInexistente = 'correo@inexistente.com';
      request(app)
        .post('/recuperar-contrasena')
        .send({ correo: correoInexistente })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          if (res.body !== 'El correo proporcionado no está registrado') {
            return done(new Error("Respuesta inesperada del servidor"));
          }
          done();
        });
    });
  });

  it('debería responder con un mensaje de éxito al enviar correo', function(done) {
    const correoUsuario = 'jrodriguezcoronado1@gmail.com';
    const idUsuario = 123;
    const idInmueble = 456;
    const idSesion = 789;
    const tituloinmu = 'Título de prueba';

    request(app)
      .post('/enviarCorreoArrendador')
      .send({ 
        idUsuario, 
        idInmueble, 
        correoUsuario, 
        tituloinmu, 
        idSesion 
      })
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        if (res.body.message !== 'Correo enviado al arrendador') {
          return done(new Error("Respuesta inesperada del servidor"));
        }

        done();
      });
  });

  it('debería evaluar un inmueble y actualizar la información del usuario', function(done) {
    const testData = {
        id_inmueble: 1,
        condiciones: 8,
      servicios: 7,
      seguridad: 9,
      comportamiento: 10,
      id_usuario: 1
    };

    request(app)
      .post('/evaluarinmueble')
      .send(testData)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('debería devolver información de todos los inmuebles', function(done) {
    request(app)
      .get('/infoinmueblesmap')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        done();
      });
  });

  it('debería rentar un inmueble si el usuario está autenticado', function(done) {
    const idInmueble = 1;

    agent
      .post(`/rentar/${idInmueble}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('debería devolver un error si el usuario no está autenticado', function(done) {
    const idInmueble = 1;
    request(app)
      .post(`/rentar/${idInmueble}`)
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('debería devolver un error si el usuario no existe', function(done) {
    const idUsuarioInexistente = 99999;

    request(app)
      .get(`/obtenerUsuario/${idUsuarioInexistente}`)
      .expect(404)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  describe('GET /obtenerInmueble/:id_inmueble', function() {
    it('debería devolver información del inmueble si existe', function(done) {
      const idInmueble = 1;

      request(app)
        .get(`/obtenerInmueble/${idInmueble}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('PUT /actualizarEstado/:id_renta', function() {
    it('debería actualizar el estado de una renta', function(done) {
      const idRenta = 1;

      request(app)
        .put(`/actualizarEstado/${idRenta}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('PUT /restarHabitacion/:id_inmueble', function() {
    it('debería restar una habitación del inmueble', function(done) {
      const idInmueble = 1;

      request(app)
        .put(`/restarHabitacion/${idInmueble}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('DELETE /eliminarRentado/:id_renta', function() {
    it('debería eliminar una renta si existe', function(done) {
      const idRenta = 1;

      request(app)
        .delete(`/eliminarRentado/${idRenta}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /obtenerIdRenta/:id_inmueble', function() {
    it('debería obtener el id_renta asociado a un inmueble', function(done) {
      const idInmueble = 1;

      request(app)
        .get(`/obtenerIdRenta/${idInmueble}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('PUT /actualizarEstadoInmueble/:id_inmueble', function() {
    it('debería actualizar el estado del inmueble si cumple la condición', function(done) {
      const idInmueble = 1;

      request(app)
        .put(`/actualizarEstadoInmueble/${idInmueble}`)
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });

  describe('GET /obtenerCorreoUsuario/:id_usuario', function() {
    it('debería devolver el correo del usuario si el usuario existe', function(done) {
      const idUsuario = 1;
  
      request(app)
        .get(`/obtenerCorreoUsuario/${idUsuario}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('POST /enviarCorreoDocumentacion', function() {
    it('debería procesar la solicitud y responder adecuadamente', function(done) {
      const requestBody = {
        correoV: 'jrodriguezcoronado1@gmail.com',
        identificacion_oficial: 'image_1701406296903.pdf',
        comprobante_de_domicilio: 'image_1701406296903.pdf',
        credencial_de_estudiante: 'image_1701406296903.pdf',
        comprobante_de_inscripcion: 'image_1701406296903.pdf'
      };
  
      request(app)
        .post('/enviarCorreoDocumentacion')
        .send(requestBody)
        .expect('Content-Type', /json/)
        .expect(200) 
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

  it('debería devolver los documentos del usuario si el usuario existe', function(done) {
    const id_usuario = 1;
    request(app)
      .get(`/obtenerDocumentosUsuario/${id_usuario}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('debería devolver un mensaje de error si el usuario no existe', function(done) {
    const idUsuarioInexistente = 99999;

    request(app)
      .get(`/obtenerDocumentosUsuario/${idUsuarioInexistente}`)
      .expect('Content-Type', /json/)
      .expect(200) 
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  it('debería procesar la solicitud y responder adecuadamente', function(done) {
    const requestBody = {
      correoV: 'example@example.com',
      id_usuario: 1, 
      usuarioNombre: 'Nombre Usuario',
      inmuebleTitulo: 'Titulo Inmueble'
    };

    request(app)
      .post('/enviarCorreoReporte')
      .send(requestBody)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        
        done();
      });
  });

describe('POST /enviarCorreoResena', function() {
  it('debería procesar la solicitud y responder adecuadamente', function(done) {
    const requestBody = {
      correoT: 'example@example.com',
      id_inmueble: 1 
    };

    request(app)
      .post('/enviarCorreoResena')
      .send(requestBody)
      .expect('Content-Type', /json/)
      .expect(200) 
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

it('debería verificar el estado de rentados para el usuario autenticado', function(done) {
    agent
      .get('/verificarEstadoRentados')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

  describe('GET /validateCP', function() {
    it('debería devolver información asociada a un código postal válido', function(done) {
      const codigoPostalValido = '11410';
  
      request(app)
        .get(`/validateCP?cp=${codigoPostalValido}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  
    it('debería devolver un error si el código postal no existe', function(done) {
      const codigoPostalInexistente = '00000';
      request(app)
        .get(`/validateCP?cp=${codigoPostalInexistente}`)
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });
    });
  });

});