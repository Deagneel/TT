import request from 'supertest';
import app from './server.js';

describe('API REST Tests', function() {

    let agent;

    before(function(done) {
        agent = request.agent(app); // Definir 'agent' aquí

        // Realizar una operación de inicio de sesión para establecer la sesión
        agent
            .post('/login') // Asegúrate de que este es tu endpoint de autenticación
            .send({ correo: 'jrodriguezcoronado1@gmail.com', contrasena: 'JesusRC1' }) // Usa credenciales válidas
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
            // Asegúrate de que la ruta al archivo de prueba sea correcta
            request(app)
                .post('/upload')
                .attach('image', 'public/images/IPN.png') // Ajusta esta ruta
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
            const idEscuela = 1; // Reemplaza con un id de escuela válido para la prueba
            request(app)
                .get(`/escuela/${idEscuela}`)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('GET /infoinmuebles/:id_inmueble', function() {
        it('debería devolver información de un inmueble específico', function(done) {
            const idInmueble = 1; // Reemplaza con un id de inmueble válido para la prueba
            request(app)
                .get(`/infoinmuebles/${idInmueble}`)
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe('PUT /newName/:id', function() {
        it('debería actualizar el nombre del usuario', function(done) {
            const userId = 1; // Reemplaza con un ID de usuario válido para la prueba
            const nuevoNombre = 'Nuevo Nombre'; // Reemplaza con un nuevo nombre para la prueba

            request(app)
                .put(`/newName/${userId}`)
                .send({ nombre: nuevoNombre })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    // Asegúrate de que la respuesta contenga el mensaje esperado
                    if (res.body.mensaje !== 'Nombre de usuario actualizado exitosamente.') {
                        return done(new Error("Respuesta inesperada del servidor"));
                    }
                    done();
                });
        });
    });

    // Prueba para actualizar el primer apellido
    describe('PUT /newApe/:id', function() {
        it('debería actualizar el primer apellido del usuario', function(done) {
            request(app)
                .put('/newApe/1') // Asume un ID de usuario válido
                .send({ primer_apellido: 'ApellidoNuevo' })
                .expect(200, done); // Asegúrate de que esto coincide con tu lógica de respuesta
        });
    });

    // Prueba para actualizar el segundo apellido
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

    // Prueba para actualizar el comprobante de inscripción del usuario
describe('PUT /newComprobante/:id', function() {
    it('debería actualizar el comprobante de inscripción del usuario', function(done) {
        const userId = 1;
        const nuevoComprobante = 'image_1702111982531.pdf';

        request(app)
            .put(`/newComprobante/${userId}`)
            .send({ comprobante_inscripcion: nuevoComprobante }) // Ajusta el campo según tu lógica
            .expect(200, done);
    });
});

// Prueba para actualizar el comprobante de domicilio del usuario
describe('PUT /newComprobanteD/:id', function() {
    it('debería actualizar el comprobante de domicilio del usuario', function(done) {
        const userId = 1;
        const nuevoComprobante = 'image_1702111982531.pdf';

        request(app)
            .put(`/newComprobanteD/${userId}`)
            .send({ comprobante_domicilio: nuevoComprobante }) // Ajusta el campo según tu lógica
            .expect(200, done);
    });
});


});