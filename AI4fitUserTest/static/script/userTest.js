//Valori da usare per normalizzare il dato prima di valutarlo col modello
var norm_values = {
    o_distance: [14397.797807903085, 0.0, 360000.0],
    o_time: [12197.15979232766, 0.0, 306000.0],
    o_pace: [4842.673781367176, 0.0, 292000.0],
    d_distance: [5.204578696471742, -7.664783423566668, 623.4751836316286],
    d_time: [9.775416433383006, -313.0950682261208, 661.2111999999998],
    d_pace_mean: [-0.11974895486871891, -270.928316178069, 0.9224168353544497],
    d_pace_std: [0.8155474911924301, 0.0, 1715.0849130916565],
    d_pace_var: [933.0957965108744, 0.0, 2941516.259114615],
    r_distance: [19331.864616222036, 50.36548501253127, 42993.1843163427],
    r_speed: [6.219522020650246, 0.00040852929759351334, 261.9957502588009],
    r_time: [10840.839752523778, 15.0, 638462.328],
    r_pace: [20578.58593479081, 1.3357104794362857, 16600276.82684693],
    p_running: [0.3655546677450891, 0.0, 0.9705882352941176],
    p_walking: [0.3327347733275077, 0.0, 0.9411764705882353],
    p_unknown: [0.1347660468354144, 0.010526315789473684, 0.5],
    p_welldone: [0.5668444509898433, 0.0, 1.0],
    p_has_objective: [0.8652339531645894, 0.5, 0.9894736842105263],
    age: [42.62244014998558, 17.0, 71.0],
    height: [168.08710700894144, 147.0, 198.0],
    weight: [68.91892125757134, 42.0, 130.0],
    calories: [356.7678107874243, 0.0, 1653.0]
};
//Formula per la normalizzazione
//self.data[column_name] = self.data[column_name].apply(lambda x: (x - mean_col) / (max_col - min_col))
var workout3 = {
    o_distance: -0.057846,
    p_unknown: -0.0541757,
    p_walking: 0.114791,
    p_running: -0.392162,
    r_time: 0.00832845,
    r_speed: -0.00843242,
    r_distance: 0.112499,
    r_pace: -0.00181375,
    o_pace: -0.0248329,
    o_time: 0.013441,
    p_welldone: 0.505893,
    weight_situation: 4,
    age: -0.0842126,
    height: -0.26717,
    weight: -0.286194,
    gender: 0,
    bmi: 19.9792,
    calories: -0.126402,
    p_has_objective: 0.0541757,
    d_pace_std: -0.000662894,
    d_pace_mean: 0.000461261,
    d_time: -0.0103111,
    d_distance: -0.0126414,
    d_pace_var: -0.000636324
};


function normalize(x, mean, min, max) {
    return (x-mean)/(max-min)
}

var workout = workout3;
var workoutKeys = Object.keys(workout);

function createFeatureList() {
    var featureList = [];
    for(var feature = 0; feature < 24; feature++){
        var element = document.getElementById("out-range"+feature);
        var value;
        if(element !== null){
            if(workoutKeys[feature] == "bmi" || workoutKeys[feature] == "weight_situation" || workoutKeys[feature] == "gender"){
                value = parseFloat(element.value)
            }else {
                value = normalize(parseFloat(element.value), norm_values[workoutKeys[feature]][0], norm_values[workoutKeys[feature]][1], norm_values[workoutKeys[feature]][2])
            }
            featureList.push(value)
        }else{
            if(workoutKeys[feature] == "bmi" || workoutKeys[feature] == "weight_situation" || workoutKeys[feature] == "gender"){
                value = parseFloat(workout[workoutKeys[feature]])
            }else{
                value = normalize(parseFloat(workout[workoutKeys[feature]]), norm_values[workoutKeys[feature]][0], norm_values[workoutKeys[feature]][1], norm_values[workoutKeys[feature]][2])
            }
            featureList.push(value)
        }
    }
    return featureList
}

$(document).ready(function () {
    $('#evaluate_button').on('click', function () {
        var featureList = createFeatureList();
        $.ajax({
            url: '',
            type: 'POST',
            data: {
                features: featureList
            },
            success: function (mark) {
                let element = document.getElementById("mark")
                element.innerHTML = mark
            },
            error: function () {
                console.log("Errore richiesta valutazione")
            }
        })
    })
});
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

function reverseNormalize(x, mean, min, max) {
    return ((max - min) * x) + mean;
}


var features_meaning = {
    r_speed: 'Media delle velocità di tutte le attività di un allenamento',
    calories: 'Calorie consumate in questo allenamento',
    r_distance: 'Somma delle distanze di tutte le attività di un allenamento',
    d_distance: 'Percentuale di distacco tra obiettivo corretto ed eseguito (distanza)',
    p_welldone: 'Percentuale di attività con distacco pari a 0 in quell\'allenamento',
    o_time: 'Obiettivo di tempo',
    r_time: 'Somma dei tempi di tutte le attività di un allenamento',
    p_walking: 'Percentuale di attività \'walking\' in quell\'allenamento',
    height: 'Altezza atleta',
    o_distance: 'Obiettivo di distanza',
    weight: 'Peso atleta',
    bmi: 'Bmi atlea',
    age: 'Età atleta',
    p_running: 'Percentuale di attività \'running\' in quell\'allenamento',
    r_pace: 'Media del passo di tutte le attività di un allenamento',
    p_unknown: 'Percentuale di attività \'unknown\' in quell\'allenamento',
    // inserire anche queste?
    p_has_objective: 0.833333,
    d_time: 0.00695535,
    d_pace_mean: 0.00115923,
    o_pace: 'Obiettivo di passo',
    d_pace_std: 0.0302507,
    weight_situation: 'Fascia di peso',
    gender: 1,
    d_pace_var: 0.000915104
};

var numFeatures = 12;

for (var i = 0; i < numFeatures; i++) {
    var col_border = document.createElement("div");
    col_border.id = workoutKeys[i];
    col_border.className = "col border-hi-feature";
    col_border.style.marginBottom = "10px";
    var p_feature = document.createElement("p");
    p_feature.className = "feature";
    p_feature.setAttribute("data-toggle", "tooltip");
    p_feature.title = features_meaning[workoutKeys[i]];
    p_feature.innerText = workoutKeys[i];
    var div_slider = document.createElement("div");
    var input_slider = document.createElement("input");
    input_slider.id = "range" + i;
    input_slider.type = "range";
    input_slider.name = "range";

    var featureValue;
    if (workoutKeys[i] == "d_distance" || workoutKeys[i] == "d_time" || workoutKeys[i] == "d_pace_mean" || workoutKeys[i] == "d_pace_std" || workoutKeys[i] == "d_pace_var") {
        input_slider.min = -100.0;
        input_slider.max = 100.0;
        input_slider.step = 0.001;
        featureValue = workout[workoutKeys[i]] * 100;
    } else if (workoutKeys[i] == "p_welldone" || workoutKeys[i] == "p_walking" || workoutKeys[i] == "p_running" || workoutKeys[i] == "p_unknown" || workoutKeys[i] == "p_has_objective") {
        input_slider.min = 0.0;
        input_slider.max = 100.0;
        input_slider.step = 0.001;
        featureValue = workout[workoutKeys[i]] * 100;
    } else {
        if (workoutKeys[i] == "bmi" || workoutKeys[i] == "weight_situation" || workoutKeys[i] == "gender") {
            featureValue = workout[workoutKeys[i]];
        } else {
            featureValue = reverseNormalize(workout[workoutKeys[i]], norm_values[workoutKeys[i]][0], norm_values[workoutKeys[i]][1], norm_values[workoutKeys[i]][2]);
            input_slider.min = featureValue / 2;
            input_slider.max = featureValue * 2;
            if (workoutKeys[i] == "r_speed" || workoutKeys[i] == "r_distance" || workoutKeys[i] == "r_pace" || workoutKeys[i] == "bmi") {
                input_slider.step = 0.001;
            }
        }
    }

    input_slider.setAttribute("value", featureValue);
    input_slider.setAttribute("onchange", "range" + i + ".value=value");
    var output_slider = document.createElement("output");
    output_slider.id = "out-range" + i;
    //output_slider.innerHTML = workout[workoutKeys[i]];
    output_slider.innerHTML = featureValue;

    var container;
    if (i % 2 == 0) {
        container = document.getElementById('f1');
        p_feature.setAttribute("data-placement", "left");
        div_slider.className = "range range-success";
    } else {
        container = document.getElementById('f2');
        p_feature.setAttribute("data-placement", "right");
        div_slider.className = "range range-primary";
    }

    div_slider.append(input_slider);
    div_slider.append(output_slider);

    col_border.append(p_feature);
    col_border.append(div_slider);

    container.append(col_border);
}
