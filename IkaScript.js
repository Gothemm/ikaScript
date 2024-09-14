let datos,
  ciudad,
  atacantes,
  defensores,
  tropas = { atacantes: null, defensores: null };

/*$(document).ajaxSend(function(event, request, settings){
  console.log(event);
  console.log(request);
  console.log(settings);
});*/

$.ajax({
  type: 'GET',
  async: false,
  url: 'battleTerrestre.html',
  data: undefined,
  beforeSend: function (xhr) {
    xhr.overrideMimeType("text/html; charset=UTF-8");
  },
  success: function (data, status) {
    datos = data;
  },
  error: function (xhr, status, error) {
    console.log(error);
  }
});

String.prototype.BNS = function () { return this.replace(/[\n\r\t]/g, "").replace(/^s+|s+$/g, "").replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""); };

function forEach(array, action) {
  for (let i = 0; i < array.length; i++)
    action(array[i]);
}

function removeChar(text) {
  let replacements = [/^\[/, /\]$/];

  forEach(replacements, function (repl) {
    text = text.replace(repl, "");
  });

  return text;
}

function getParticipantes(selector) {
  let participantes = {};

  function getPart(index) {
    //console.log("[" + index + "]: " + $(this).text());
    let groupAlly = $(this).text().match(/\[(.+)\]/g),
      name = groupAlly ? $(this).text().replace(groupAlly[groupAlly.length - 1], "") : $(this).text(),
      alliance = removeChar(groupAlly ? groupAlly[groupAlly.length - 1] : "NoAlianza");

    if (participantes[alliance] == null)
      participantes[alliance] = [];

    participantes[alliance].push(name.BNS());
  }

  $(datos).find(selector).each(getPart);

  return participantes;
}

atacantes = getParticipantes("div#troopsReport div.attacker span > a");
defensores = getParticipantes("div#troopsReport div.defender span > a");
ciudad = $(datos).find("div#troopsReport h3.header")[0].firstChild.textContent.BNS().replace("Batalla en", "Batalla terrestre en").replace("Batalla maritima", "Batalla marítima");

console.log(atacantes);
console.log(defensores);
console.log(ciudad);

let vencedores = $(datos).find("div#troopsReport div.result div.winners").text().BNS();
if (vencedores.split(",").length > 1)
  vencedores = vencedores.replace(/^Ganador:/, "Ganadores:");

let perdedores = $(datos).find("div#troopsReport div.result div.losers").text().BNS();
if (perdedores.split(",").length > 1)
  perdedores = perdedores.replace(/^Perdedor:/, "Perdedores:");

//let loot = $(datos).find("div#troopsReport div.result").text();

console.log(vencedores);
console.log(perdedores);
//console.log("Loot: " + loot);

function getUnidades() {
  let unidadesAtacantes = [],
    unidadesDefensores = [],
    count = 0;

  function initUnid(ind, obj) {
    unidadesAtacantes.push({ unidad: $(obj).text().BNS(), perdidas: 0, restantes: 0 });
    unidadesDefensores.push({ unidad: $(obj).text().BNS(), perdidas: 0, restantes: 0 });
  }

  function getUnid(pos, cont) {
    switch (cont != null) {
      case ($(cont).find(".army, .fleet").length > 0):
        count = unidadesAtacantes.length || unidadesDefensores.length;
        $(cont).find(".army, .fleet").each(initUnid);
        break;
      case ($(cont).find(".attackerLine").length > 0):
        //console.log(".attackerLine Count: " + count);
        //console.log(".attackerLine " + $(cont).find(".attackerLine").text());
        $(cont).find(".numbers, .center").each(function (i, obj) {
          unidadesAtacantes[(count + i)].restantes += parseInt($(obj).text().replace(/[\(\)\,]/g, ""));
          //console.log("Numbers Count: " + (count + i) + " : " + $(obj).text());
        });
        $(cont).find(".numbers2, .center").each(function (i, obj) {
          unidadesAtacantes[(count + i)].perdidas += parseInt($(obj).text().replace(/[\(\)\,]/g, ""));
          //console.log("Numbers2 Count: " + (count + i) + " : " + $(obj).text());
        });
        break;
      case ($(cont).find(".defenderLine").length > 0):
        //console.log(".defenderLine Count: " + count);
        //console.log(".defenderLine " + $(cont).find(".defenderLine").text());
        $(cont).find(".numbers, .center").each(function (i, obj) {
          unidadesDefensores[(count + i)].restantes += parseInt($(obj).text().replace(/[\(\)\,]/g, ""));
          //console.log("Numbers Count: " + (count + i) + " : " + $(obj).text());
        });
        $(cont).find(".numbers2, .center").each(function (i, obj) {
          unidadesDefensores[(count + i)].perdidas += parseInt($(obj).text().replace(/[\(\)\,]/g, ""));
          //console.log("Numbers2 Count: " + (count + i) + " : " + $(obj).text());
        });
        break;
    }
  }

  $(datos).find("div#troopsReport .militaryList tr").each(getUnid);
  console.log(unidadesAtacantes);
  console.log(unidadesDefensores);
}

tropas = getUnidades();
