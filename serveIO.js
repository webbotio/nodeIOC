// Utilizza la libreria 'wiringpi-node'

var wpi=require('wiringpi-node');
wpi.setup('wpi');

// Controllare se la seguente istruzione permette di accedere direttamente alla numerazione BCM
// wpi.setup('gpio');

var low = 0;
var high = 1;

var tempoDiUnPasso = 500;         // Il tempo per fare un passo e' di 500 ms
var tempoRotazione90gradi = 2800;  // Tempo in ms affinche' il robot giri a destra o a sinistra di 90 gradi

var pin1Motore1 = 7;   // BCM = 4
var pin2Motore1 = 0;   // BCM = 17

var pin1Motore2 = 2;   // BCM = 27
var pin2Motore2 = 3;   // BCM = 22

// Sensore di distanza HC-SR04 (Ultrasonic Sensor)

var trigger1 = 4;      // BCM = 23
var echo1 = 5;         // BCM = 24


var pinServo = 1;      // BCM = 18
var pinServoSoft = 6;  // BCM = 25

var pinLed1Red = 27;   // BCM = 16
var pinLed1Green = 28; // BCM = 20
var pinLed1Blue = 29;  // BCM = 21

// Sensore di colore TCS3200

var pinS0 = 21;        // BCM = 05   Output frequency scaling selection
var pinS1 = 22;        // BCM = 06   Output frequency scaling selection
var pinS2 = 23;        // BCM = 13   Photodiode type selection
var pinS3 = 24;        // BCM = 19   Photodiode type selection
var pinOut = 25;       // BCM = 26   Output frequency

wpi.pinMode(pin1Motore1,wpi.OUTPUT);
wpi.pinMode(pin2Motore1,wpi.OUTPUT);
wpi.pinMode(pin1Motore2,wpi.OUTPUT);
wpi.pinMode(pin2Motore2,wpi.OUTPUT);

wpi.pinMode(trigger1,wpi.OUTPUT);
wpi.digitalWrite(trigger1,low);
wpi.pinMode(echo1,wpi.INPUT);


wpi.pinMode(pinLed1Red,wpi.OUTPUT);
wpi.pinMode(pinLed1Green,wpi.OUTPUT);
wpi.pinMode(pinLed1Blue,wpi.OUTPUT);

wpi.pinMode(pinServo,wpi.PWM_OUTPUT);
wpi.pwmSetMode(wpi.PWM_MODE_MS);  //  Modalita' mark:space, l'altra modalita' e' "balanced" (wpi.PWM_MODE_BAL)
wpi.pwmSetClock(384);             //  Incrementa il contatore del PWM una volta ogni 384 periodi di clock
wpi.pwmSetRange(1000);            //  Range del PWM (0-1000), il contatore del PWM va da 0 a 1000

// La frequenza del clock di RaspBerry e' 19,2 MHz
// Il contatore ritorna a 0 dopo 384000 periodi di clock cioe' dopo 20 ms
// Quindi la frequenza del PWM e' di 50 Hz

wpi.pinMode(pinS0,wpi.OUTPUT);
wpi.pinMode(pinS1,wpi.OUTPUT);
wpi.pinMode(pinS2,wpi.OUTPUT);
wpi.pinMode(pinS3,wpi.OUTPUT);
wpi.pinMode(pinOut,wpi.INPUT);
wpi.digitalWrite(pinS0,high);     //  Setting frequency scaling to 20%
wpi.digitalWrite(pinS1,low);      //  Setting frequency scaling to 20%


// esegue il numero di passi n nella direzione dir
function doSteps(n, dir) {
    var tempoNPassi;
    console.log("Faccio " + n + " passo/i nella direzione '" + dir + "'");
    engineOn(dir);
    tempoNPassi = tempoDiUnPasso*n;
    wpi.delay(tempoNPassi);
    engineOff();
}


// accende i motori nella direzione dir
function engineOn(dir) {
    var valor1, valor2;
    console.log("Accendo i motori nella direzione '" + dir + "'");
    if (dir=='avanti') {
        valor1 = low;
        valor2 = high;
    }
    if (dir=='indietro') {
        valor1 = high;
        valor2 = low;
    }
    if ((dir=='avanti')||(dir=='indietro')) {
        wpi.digitalWrite(pin1Motore1,valor1);
        wpi.digitalWrite(pin2Motore1,valor2);
        wpi.digitalWrite(pin1Motore2,valor1);
        wpi.digitalWrite(pin2Motore2,valor2);
    }
}


// accende i motori in modo che il robot giri a destra o a sinistra di 90 gradi
function gira(dir) {
    console.log("Giro a '" + dir + "' di 90 gradi");
    if (dir=='destra') {
        valor1 = low;
        valor2 = high;
    }
    if (dir=='sinistra') {
        valor1 = high;
        valor2 = low;
    }
    if ((dir=='destra')||(dir=='sinistra')) {
        wpi.digitalWrite(pin1Motore1,valor1);
        wpi.digitalWrite(pin2Motore1,valor2);
        wpi.digitalWrite(pin1Motore2,valor2);
        wpi.digitalWrite(pin2Motore2,valor1);
    }
    wpi.delay(tempoRotazione90gradi);
    engineOff();
}


// accende i motori in modo che il robot giri a destra o a sinistra di 90 gradi
function giraTempo(dir,tempo) {
    console.log("Giro a '" + dir + "' per " + tempo + " ms");
    if (dir=='destra') {
        valor1 = low;
        valor2 = high;
    }
    if (dir=='sinistra') {
        valor1 = high;
        valor2 = low;
    }
    if ((dir=='destra')||(dir=='sinistra')) {
        wpi.digitalWrite(pin1Motore1,valor1);
        wpi.digitalWrite(pin2Motore1,valor2);
        wpi.digitalWrite(pin1Motore2,valor2);
        wpi.digitalWrite(pin2Motore2,valor1);
    }
    wpi.delay(tempo);
    engineOff();
}


// accende i motori nella direzione dir per un tempo pari a time con una velocita' inferiore a quella massima
function engineOnPWM(dir,time,percentage) {
    var duty = percentage;
    console.log("Accendo i motori nella direzione '" + dir + "' per " + time + " ms con il " + percentage + "% della velocita' massima");
    if (dir=='avanti') {
        wpi.digitalWrite(pin1Motore1,low);
        wpi.digitalWrite(pin1Motore2,low);
        PWM2(pin2Motore1,pin2Motore2,time,20,duty);
    }
    if (dir=='indietro') {
        wpi.digitalWrite(pin2Motore1,low);
        wpi.digitalWrite(pin2Motore2,low);
        PWM2(pin1Motore1,pin1Motore2,time,20,duty);
    }
}


// aspetta n millisecondi
function delay(n) {
    console.log('Aspetto ' + n + ' millisecondi');
    wpi.delay(n);
}


// aspetta il tempo in ms indicato da una variabile
function delayVariable(tempo) {
    console.log('Aspetto ' + tempo + ' millisecondi');
    wpi.delay(tempo);
}


// spegne i motori
function engineOff() {
    console.log('Spengo i motori');
    wpi.digitalWrite(pin1Motore1,low);
    wpi.digitalWrite(pin2Motore1,low);
    wpi.digitalWrite(pin1Motore2,low);
    wpi.digitalWrite(pin2Motore2,low);
}


// accendi il led N con il colore specificato
function accendiLed(n,col) {
    console.log('Accendo il led ' + n + ' con il colore ' + col);
    if (n==1) {
        wpi.digitalWrite(pinLed1Red,low);
        wpi.digitalWrite(pinLed1Green,low);
        wpi.digitalWrite(pinLed1Blue,low);
        switch (col)
        {
           case '#ff0000': wpi.digitalWrite(pinLed1Red,high);
                           break;
           case '#00ff00': wpi.digitalWrite(pinLed1Green,high);
                           break;
           case '#0000ff': wpi.digitalWrite(pinLed1Blue,high);
                           break;
           case '#ffff00': wpi.digitalWrite(pinLed1Red,high);
                           wpi.digitalWrite(pinLed1Green,high);
                           break;
           case '#ff00ff': wpi.digitalWrite(pinLed1Red,high);
                           wpi.digitalWrite(pinLed1Blue,high);
                           break;
           case '#00ffff': wpi.digitalWrite(pinLed1Green,high);
                           wpi.digitalWrite(pinLed1Blue,high);
                           break;
           case '#ffffff': wpi.digitalWrite(pinLed1Red,high);
                           wpi.digitalWrite(pinLed1Green,high);
                           wpi.digitalWrite(pinLed1Blue,high);
                           break;
           default: console.log('\nColore non conosciuto');
       }
    }
}


// restituisce il valore letto dal sensore di distanza id
function distSensor(id) {
    var pinTrigger, pinEcho, echoStart, echoEnd, echoDuration, distance;
    console.log("Leggo il sensore di distanza '" + id + "'");
    if (id=='avanti') {
        pinTrigger = trigger1;
        pinEcho = echo1;
    }
    if (id=='rotante') {
        pinTrigger = trigger1;
        pinEcho = echo1;
    }
    wpi.digitalWrite(pinTrigger,high);
    wpi.delayMicroseconds(10);
    wpi.digitalWrite(pinTrigger,low);
    while (wpi.digitalRead(pinEcho)==low) {
        echoStart = wpi.micros();
    }
    while (wpi.digitalRead(pinEcho)==high) {
        echoEnd = wpi.micros();
    }
    echoDuration = echoEnd - echoStart;
    distance = Math.round(echoDuration*0.1715);    // distanza espressa in mm
    distance = distance/10;                        // distanza espressa in cm
    if ((distance>=2) && (distance<=400)) {
        valoreLetto = distance.toString() + " cm";
    } else {
        valoreLetto = "Distanza superiore a 4 metri o inferiore a 2 cm";
    }
    return valoreLetto;
}


function impulsoIn(pin,stato) {
    var begin,begin1,exit,start,end,duration;
    exit = false;
    begin = wpi.micros();
    while ((wpi.digitalRead(pin)==stato)&&(!exit)) {
        begin1 = wpi.micros();
        if ((begin1-begin)>1000) exit=true;
    }
    while ((wpi.digitalRead(pin)!=stato)&&(!exit)) {
        start = wpi.micros();
        if ((start-begin)>1000) exit=true;
    }
    while ((wpi.digitalRead(pin)==stato)&&(!exit)) {
        end = wpi.micros();
        if ((end-begin)>1000) exit=true;
    }
    if ((start)&&(end)) duration=end-start; else duration=-1;
    return duration;
}

// restituisce il valore letto dal sensore di colore id
function colorSensor(id) {
    var cPulse, rPulse, gPulse, bPulse, i, cPulseM, rPulseM, gPulseM, bPulseM;
    console.log('Leggo il sensore di colore ' + id);
    cPulse = new Array();
    rPulse = new Array();
    gPulse = new Array();
    bPulse = new Array();
    cPulseM = rPulseM = gPulseM = bPulseM = 0;
    i = 1;
    if (id==1) {
        do {
            wpi.digitalWrite(pinS2,high);   // Setting CLEAR (C) No Filter
            wpi.digitalWrite(pinS3,low);    // Setting CLEAR (C) No Filter
            do {
                cPulse[i] = impulsoIn(pinOut,low);
            } while ((cPulse[i]<0)||(cPulse[i]>300));
            cPulseM += cPulse[i];
            wpi.digitalWrite(pinS2,low);    // Setting RED (R) filtered photodiodes to be read
            wpi.digitalWrite(pinS3,low);    // Setting RED (R) filtered photodiodes to be read
            do {
                rPulse[i] = impulsoIn(pinOut,low);
            } while ((rPulse[i]<0)||(rPulse[i]>300));
            rPulseM += rPulse[i];
/*
            wpi.digitalWrite(pinS2,high);   // Setting GREEN (G) filtered photodiodes to be read
            wpi.digitalWrite(pinS3,high);   // Setting GREEN (G) filtered photodiodes to be read
            do {
                gPulse[i] = impulsoIn(pinOut,low);
            } while ((gPulse[i]<0)||(gPulse[i]>300));
            gPulseM += gPulse[i];
*/
            wpi.digitalWrite(pinS2,low);    // Setting BLUE (B) filtered photodiodes to be read
            wpi.digitalWrite(pinS3,high);   // Setting BLUE (B) filtered photodiodes to be read
            do {
                bPulse[i] = impulsoIn(pinOut,low);
            } while ((bPulse[i]<0)||(bPulse[i]>300));
            bPulseM += bPulse[i];
            i++;
        } while (i<=10);
        cPulseM = cPulseM/10;
        rPulseM = rPulseM/10;
//      gPulseM = gPulseM/10;
        bPulseM = bPulseM/10;
        console.log(cPulseM);
        console.log(rPulseM);
//      console.log(gPulseM);
        console.log(bPulseM+"\n");
        valoreLetto="";
        if ((Math.abs(rPulseM-56)<20)&&(Math.abs(bPulseM-46)<20)) valoreLetto="bianco";
        if ((Math.abs(rPulseM-147)<30)&&(Math.abs(bPulseM-146)<20)) valoreLetto="verde";
        if ((Math.abs(rPulseM-74)<20)&&(Math.abs(bPulseM-149)<20)) valoreLetto="rosso";
//      if ((Math.abs(rPulseM-220)<20)&&(Math.abs(bPulseM-216)<20)) valoreLetto="nero";
        if (valoreLetto=="") valoreLetto="nero";

/*
        if ((Math.abs(rPulseM-45)<20)&&(Math.abs(gPulseM-50)<20)&&(Math.abs(bPulseM-37)<20)) valoreLetto="bianco";
//      if ((Math.abs(rPulseM-20)<15)&&(Math.abs(gPulseM-25)<10)&&(Math.abs(bPulseM-19)<10)) valoreLetto="argento";
        if ((Math.abs(rPulseM-105)<30)&&(Math.abs(gPulseM-90)<20)&&(Math.abs(bPulseM-95)<20)) valoreLetto="verde";
        if ((Math.abs(rPulseM-58)<20)&&(Math.abs(gPulseM-125)<20)&&(Math.abs(bPulseM-90)<20)) valoreLetto="rosso";
        if ((Math.abs(rPulseM-165)<20)&&(Math.abs(gPulseM-188)<20)&&(Math.abs(bPulseM-135)<20)) valoreLetto="nero";
*/
    }
    return valoreLetto;
}


// dispone il sensore rotante di distanza verso la direzione dir
function guardaVerso(dir) {
    console.log("Guardo verso la direzione '" + dir + "'");
    if (dir=='destra') {                 // guardo a destra
       wpi.pwmWrite(pinServo,26);        // 0,5 ms high
    }
    if (dir=='sinistra') {               // guardo a sinistra
       wpi.pwmWrite(pinServo,94);        // 2,5 ms high
    }
    if (dir=='avanti') {                 // guardo avanti
       wpi.pwmWrite(pinServo,56);        // 1,5 ms high
    }
}


// dispone il sensore rotante di distanza verso la direzione dir (versione con il PWM software)
function guardaVerso1(dir) {
    console.log("Guardo verso la direzione '" + dir + "'");
    if (dir=='destra') {                   // guardo a destra
       PWM(pinServoSoft,1000,20,2.5);      // 0,5 ms high
    }
    if (dir=='sinistra') {                  // guardo a sinistra
       PWM(pinServoSoft,1000,20,12.5);      // 2,5 ms high
    }
    if (dir=='avanti') {                   // guardo avanti
       PWM(pinServoSoft,1000,20,7.5);      // 1,5 ms high
    }
}


// Realizza un PWM per un numero di ms pari a durata su un pin con periodo uguale a T ms e dutycycle uguale a d
function PWM(pin,durata,T,d) {
    var tempoHigh = T*d*10;
    var tempoLow = T*(100-d)*10;
    var durataMicro = durata*1000;
    var t0 = wpi.micros();
    var t = t0;
    while ((t-t0)<=durataMicro) {
        wpi.digitalWrite(pin,high);
        wpi.delayMicroseconds(tempoHigh);
        wpi.digitalWrite(pin,low);
        wpi.delayMicroseconds(tempoLow);
        t = wpi.micros();
    }
}


// Realizza un PWM per un numero di ms pari a durata su due pin con periodo uguale a T ms e dutycycle uguale a d
function PWM2(pin1,pin2,durata,T,d) {
    var tempoHigh = T*d;
    var tempoLow = T*(100-d);
    var durataMicro = durata*1000;
    var t0 = wpi.micros();
    var t = t0;
    while ((t-t0)<=durataMicro) {
        wpi.digitalWrite(pin1,high);
        wpi.digitalWrite(pin2,high);
        wpi.delayMicroseconds(Math.round(tempoHigh*0.8));
        wpi.digitalWrite(pin1,high);
        wpi.digitalWrite(pin2,low);
        wpi.delayMicroseconds(Math.round(tempoHigh*0.2));
        wpi.digitalWrite(pin1,low);
        wpi.digitalWrite(pin2,low);
        wpi.delayMicroseconds(tempoLow);
        t = wpi.micros();
    }
}


var http = require('http');
var url = require('url');
var fs = require('fs');
const querystring = require('querystring');

var server=http.createServer(function (req, res) {

    console.log('\nRequest...');

    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    var nomeFile = filename.substring(filename.lastIndexOf('/')+1);
    console.log("* host: "+ req.headers.host);
    console.log("* received request for: " + nomeFile);
    console.log("* pathname = " + q.pathname);
    console.log("* request method: " + req.method);

    if (req.method=="POST") {

        // Executing a script

        var body = '';

        req.on('data', function (data) {
            body += data;
        });

        req.on('end', function () {
            code = querystring.parse(body).script;
            if (code != undefined) {
                console.log("\nScript:\n" + code);
                console.log("\nRunning...");
                try {
                    eval(code);
                } catch (e) {
                    console.log('\nError message: '+e.message);
                }
                console.log("\nScript executed");
            }
        });

    } else {

        // Serving a web page

        fs.readFile(filename, function(err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                console.log("\nPage not found: "+filename);
                return res.end("404 Page not found: "+filename);
            } else {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                console.log("\nPage served: "+filename);
                return res.end();
            }
        });
    }

}).listen(8080);


var io = require('socket.io')(server);

io.on('connection', function(socket) {

    var nomeUtente;
    var filename;

    function opening(filename) {
        var contents=fs.readFileSync('./usersIO/users.txt').toString();
        var filename0=filename+'#';
        var filename1=filename+'*';
        if ((contents.indexOf(filename0)==-1)&&(contents.indexOf(filename1)==-1)) {
            contents=contents.replace(filename,filename0);
            fs.writeFileSync('./usersIO/users.txt',contents);
        }
    }

    function closure(filename,nomeUtente) {
        var contents=fs.readFileSync('./usersIO/users.txt').toString();
        var filename0=filename+'#';
        var filename1=filename+'*';
        if (contents.indexOf(filename1)!=-1) {
            socket.broadcast.emit('utenteConnesso',{testo:'Nessun utente &egrave; connesso al robot', utenteConnesso:''});
        }
        contents=contents.replace(filename0,filename);
        contents=contents.replace(filename1,filename);
        fs.writeFileSync('./usersIO/users.txt',contents);
    }

    socket.on('login', function(data){
        nomeUtente = data.nome;
        filename = data.file;
        console.log("\nL'utente "+nomeUtente+" ha fatto il login");
        opening(filename);
    });

    socket.on('connessioneRobot', function(data){
        nomeUtente = data.nome;
        console.log("\nL'utente "+nomeUtente+" si e' connesso al robot");
        var contents = fs.readFileSync('./usersIO/users.txt').toString();
        var filename0 = data.file + "#";
        var filename1 = data.file + "*";
        contents = contents.replace(filename0,filename1);
        fs.writeFileSync('./usersIO/users.txt',contents);
        io.sockets.emit('utenteConnesso',{testo:'Utente connesso al robot: ',utenteConnesso: nomeUtente});
    });

    socket.on('disconnessioneRobot', function(data){
        nomeUtente = data.nome;
        console.log("\nL'utente "+nomeUtente+" si e' disconnesso dal robot");
        var contents = fs.readFileSync('./usersIO/users.txt').toString();
        var filename0 = data.file + "#";
        var filename1 = data.file + "*";
        contents = contents.replace(filename1,filename0);
        fs.writeFileSync('./usersIO/users.txt',contents);
        io.sockets.emit('utenteConnesso',{testo:'Nessun utente &egrave; connesso al robot', utenteConnesso:''});
    });

    socket.on('logout', function (data) {
        nomeUtente = data.nome;
        filename = data.file;
        console.log("\nL'utente "+ nomeUtente +" ha fatto il logout");
        closure(filename,nomeUtente);
    });

});

var unload = require('unload');
unload.add(function() {
    var contents=fs.readFileSync('./usersIO/users.txt').toString();
    contents=contents.replace('#','');
    contents=contents.replace('*','');
    fs.writeFileSync('./usersIO/users.txt',contents);
    console.log('\x1b[1m\x1b[36m%s\x1b[0m','Server spento');
});
