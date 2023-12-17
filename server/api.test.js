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

});