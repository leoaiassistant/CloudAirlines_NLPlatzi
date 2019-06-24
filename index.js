'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const video = 'https://www.youtube.com/watch?v=U9hq83ryFj0';
const wedo = 'https://media.giphy.com/media/t8LaaaPNOYVJfImLNu/giphy.gif';
const buceo = 'https://media.giphy.com/media/3oEhmGYdZDCsGANSUw/giphy.gif';
const welcome = 'https://media3.giphy.com/media/9Y5dai0r8F9xb5FCrw/giphy.gif?cid=3640f6095c96e7c87a56424a41e5d14f';
const welcome2 = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCI7tShlyVeubGtVbh6XTCPNfZVlXFFYOEO55zskrSjLzwEKUQ';
const infomk = 'https://media3.giphy.com/media/atZII8NmbPGw0/giphy.gif?cid=790b76115ce5b0944366663159488200&rid=giphy.gif';

const admin = require('firebase-admin');
var firebaseConfig = {
  apiKey: "Ingrese su ID",
    authDomain: "Ingrese su ID",
    databaseURL: "Ingrese su ID",
    projectId: "Ingrese su ID",
    storageBucket: "Ingrese su ID",
    messagingSenderId: "Ingrese su ID"
  };
admin.initializeApp(firebaseConfig);
var database = admin.database();

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
function welcome(agent) {
    agent.add(`Bienvenid@ te saluda Ted 🤖, la asistente virtual para reservar vuelos.`);
    agent.add(new Card({
        title: `Platzi NLP `,
        imageUrl: welcome2,
        text: `Muy pronto disponible para Google Assistant & Web`,
        buttonText: 'Ver Video', 
        buttonUrl: video
      })
    );
    agent.add(`Selecciona el tema que más te interesa y en el que fui entrenado:`);
 agent.add(new Suggestion(`Ver Vuelos ✈️`));   
 agent.add(new Suggestion(`Comprar Ticket  💳`));
	agent.add(new Suggestion(`Precios`));
    agent.add(new Suggestion(`Reservaciones`));
   
  }
function fallback(agent) {
    agent.add(`Recuerda que fui entrenada en:`);
  agent.add(new Suggestion(`Reservaciones vuelos ✈️`));   
 agent.add(new Suggestion(`Mis reservaciones`));
  
  }
  
function info(agent) { 
 agent.add(`Excelente decisión, en Pura Vida Airliness le podemos asesorar con:`);
 agent.add(new Suggestion(`Comprar Vuelos 🚀`));   
 agent.add(new Suggestion(`Reservar Vuelos 💻`));

}

function mk(agent) {
    agent.add(`En los cursos de mercadeo digital de Platzi podrás transformar tu carreras:`);
    agent.add(new Card({
        title: `Marketing Demo `,
        imageUrl: infomk,
        text: `Aprenderás ténicas de análisis avanzado de datos y más`,
        buttonText: 'Ver Video', 
        buttonUrl: video
      })
    );
    agent.add(`Ya te decidiste?`);
 agent.add(new Suggestion(`Matricular curso 💻`));
	agent.add(new Suggestion(`Pagar 💳`));
   
  }

function matricula(agent) {
let name = agent.parameters.name;
let cursosplatzi = agent.parameters.cursosplatzi;
    return database.ref('users')
       .push({
            phoneNumber: agent.parameters.phoneNumber,
            email: agent.parameters.email,
            cursosplatzi: agent.parameters.cursosplatzi,
			name: agent.parameters.name,
          })
      .then(()=> {
	    agent.add(`Excelente ${name} su reservación ${cursosplatzi} fue realizada con éxito ✅`);
    });
  }
  
 

  let intentMap = new Map();
intentMap.set('Default Welcome Intent', welcome);
intentMap.set('Default Fallback Intent', fallback);
intentMap.set('info.cursos', info);
intentMap.set('info.cursos.mk', mk);
intentMap.set('matricular.curso', matricula);
  
  agent.handleRequest(intentMap);
});
