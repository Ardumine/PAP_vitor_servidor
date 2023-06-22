

//cmd  tsc -w
var UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";

var UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

var UART_RX_CHARACTERISTIC_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

let uBitDevice;
let rxCharacteristic;
let ws_pc : WebSocket;
let conectado = false;



Update_progresso(0);

//connectButton = createButton("button");
var elem_logs = <HTMLButtonElement>document.getElementById("logs");


var btn_cnt = <HTMLButtonElement>document.getElementById("btn_cnt");
btn_cnt.innerText = "Iniciar";


var btn_disc   = <HTMLButtonElement>document.getElementById("btn_disc");
btn_disc.innerText = "Disc";


var btn_ping = <HTMLButtonElement>document.getElementById("btn_ping");
btn_ping.innerText = "Ping";


setInterval(Update, 500);

function Update_progresso(percentage) {
    var elemento_prog = document.getElementById("progresso");
    var width = Math.floor(percentage * 100);
    elemento_prog.style.width = width + '%';
    document.getElementById("label_prg").innerHTML = width * 1 + '%';
  }
  
  
  
  function Log_user(txt) {
  
    console.log(txt);
    elem_logs.innerHTML += "<div>" + String(txt) + "</div>";
  
  }

Conectar_ws();
function Conectar_ws() {
    try{
        ws_pc = new WebSocket("ws://localhost:8090/ws_mc");
        
        Log_user("A conectar ws...");
        ws_pc.onopen = function (event) {
          Log_user("WS conectado!");
        };
        ws_pc.onerror = function(event){
            Log_user("Erro WS!");

        }
        ws_pc.onmessage = function (event) {
          let dados_rec = String(event.data);
          if (dados_rec.startsWith("p")) {//é para a pag web
            let json = JSON.parse(dados_rec.replace("p{", "{"));
            let tipo = json["tipo"];
      
            if (tipo == "stat") {
              mandar_estado_con();
            }
            if (tipo == "cone") {
      
              Btn_conectar_click();
            }
      
          }
          else {
            Mandar_p_microbit(dados_rec);
          }
        };
    }catch{
        Log_user("Erro WS!");

    }
 
}



function Update() {

  btn_disc.disabled = !conectado;
  btn_ping.disabled = !conectado;

}




function mandar_estado_con() {
  ws_pc.send("p" + JSON.stringify(
    {
      "conectado": conectado
    }
  ));
}
async function Btn_conectar_click() {
  try {


    Log_user("A pedir BLE...");
    uBitDevice = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [UART_SERVICE_UUID]
    });
    Update_progresso(1 / 7);




    Log_user("A conetar ao GATT...");
    const server = await uBitDevice.gatt.connect();
    Update_progresso(2 / 7);



    Log_user("A obter serviço");
    const service = await server.getPrimaryService(UART_SERVICE_UUID);
    Update_progresso(3 / 7);



    Log_user("A obter char TX...");
    const txCharacteristic = await service.getCharacteristic(
      UART_TX_CHARACTERISTIC_UUID
    );
    Update_progresso(4 / 7);


    Log_user("A ativar notificação TX...");
    txCharacteristic.startNotifications();
    Update_progresso(5 / 7);


    Log_user("A ativar trigger TX...");
    txCharacteristic.addEventListener(
      "characteristicvaluechanged",
      onTxCharacteristicValueChanged
    );
    Update_progresso(6 / 7);
 

    Log_user("A obter char RX...");
    rxCharacteristic = await service.getCharacteristic(
      UART_RX_CHARACTERISTIC_UUID
    );
    Update_progresso(7 / 7);


    (() => {
        btn_disc.disabled = false;
        btn_ping.disabled = false;
        btn_cnt.disabled = true;
    })();
    
    navigator.vibrate(1);
    Log_user("OK!");

    conectado = true;
    mandar_estado_con();

        
  } catch (error) {
    Log_user(error);
  }
}

function Btn_dis_click() {
  if (!uBitDevice) {
    return;
  }

  if (uBitDevice.gatt.connected) {
    uBitDevice.gatt.disconnect();
    conectado = false;
    mandar_estado_con();

    console.log("Disconnected");
  }
}

async function Btn_ping_click() {
  if (!rxCharacteristic) {
    return;
  }

  try {
    Mandar_p_microbit("e1234567890");
  } catch (error) {
    console.log(error);
  }

}
var wait = (ms) => {
  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}


let separador_ble = "|";
let separador_ble_fim = ">";
let separador_ble_inicio = "<";

let encoder = new TextEncoder();

async function Mand_mc_raw(dados) {

  await rxCharacteristic.writeValue(encoder.encode(dados));

  //while(!a);
  //.resolve().then(function (res) {console.log(res);a = true;});

  //console.log(dados);
}


enum Lugares
{
  Desconhecido,

  Zona_chefe,

  Mesa_1_Obter_pedido,
  Mesa_1_entrega,

  Mesa_2_Obter_pedido,
  Mesa_2_entrega,

  Mesa_3_Obter_pedido,
  Mesa_3_entrega,

  Andar
};
console.log(Lugares.Andar.toString());
async function Mandar_p_microbit(txt : string) {

  txt = separador_ble_inicio + txt + separador_ble_fim

 Log_user("");
 Log_user("A mandar...");
 Log_user(txt + "| " + String(txt.length));


  //console.log(txt.length * delay_msgs);


  let txt_mandar_sep = txt.split('');
  var index = 0;

  for (var start = 0; start < txt_mandar_sep.length; start++) {
    const letra = txt_mandar_sep[index];


    await Mand_mc_raw(letra + separador_ble);


    index++;

    Update_progresso(index / txt_mandar_sep.length);

    if (index >= txt_mandar_sep.length) {

    }


    //setTimeout(function () {
    //}, delay_msgs * start);
  }
  Log_user("OK");
  console.log("");
  console.log("");



  //rxCharacteristic.writeValue(encoder.encode("\n"));
  //wait(delay);

  // rxCharacteristic.writeValue(encoder.encode("\n"));

}
let ultimo_txt = "";

function Mandar_loopback(dados) {
  Mandar_p_microbit("l" + dados);
}

function obter_linhas() {
  Mandar_p_microbit(JSON.stringify({
    "t": "obt_l"
  }));
}

function obter_stats() {
  Mandar_p_microbit(JSON.stringify({
    "t": "st"
  }));
}
function set_linhas(linhas1, linhas2) {
  Mandar_p_microbit(JSON.stringify({
    "t": "set_l",
    "l1": linhas1,
    "l2": linhas2
  }));
}

function onTxCharacteristicValueChanged(event) {
  let receivedData  = [];
  let Dados_ignorar = [13, 10];// \r e \n
  //console.log("REC!");
  for (var i = 0; i < event.target.value.byteLength; i++) {
    var dado = event.target.value.getUint8(i);
    receivedData[i] = dado;
  }

  // if (!Dados_ignorar.includes(dado)) {

  //console.log(String(dado) + " " + String.fromCharCode(dado))
  // }
  //console.log(receivedData);
  let receivedString = String.fromCharCode.apply(null, receivedData);

  ultimo_txt += receivedString;

  if (receivedData[0] == 10) {//Se tem LN
    Log_user("");
    ultimo_txt = ultimo_txt.replace(String.fromCharCode(10), "").replace(String.fromCharCode(13), "")
    Log_user("Rec: '" + ultimo_txt + "' (" + String(ultimo_txt.length) + ")");
    let json_rec = JSON.parse(ultimo_txt);

    if(json_rec["t"] == "st"){
        Log_user("Local crrt: " + Lugares[json_rec["lc"]] + " Lugar obj:" +  Lugares[json_rec["lo"]]);
    }
    ws_pc.send(ultimo_txt);

    


    ultimo_txt = "";

  }


}
export {};
