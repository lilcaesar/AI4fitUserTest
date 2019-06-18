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
    //r_distance: [19331.864616222036, 50.36548501253127, 42993.1843163427],
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

function normalize(x, mean, min, max) {
    return (x - mean) / (max - min)
}


function offset(el) {
    var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
}


// gestione info voti
function modifyOffset() {
    var el, newPoint, newPlace, offset, siblings, k;
    width = this.offsetWidth;
    //console.log(this)
    newPoint = (this.value - this.getAttribute("min")) / (this.getAttribute("max") - this.getAttribute("min"));
    offset = -1;
    if (newPoint < 0) {
        newPlace = 0;
    } else if (newPoint > 1) {
        newPlace = width;
    } else {
        newPlace = width * newPoint + offset;
        offset -= newPoint;
    }
    siblings = this.parentNode.childNodes;
    //console.log(siblings[1].nodeName);
    for (var i = 0; i < siblings.length; i++) {
        sibling = siblings[i];
        if (sibling.id === this.id) {
            k = true;
        }
        if ((k === true) && (sibling.nodeName === "P")) {
            outputTag = sibling;
        }
    }

    outputTag.style.left = newPlace + "px";
    outputTag.style.marginLeft = (offset*6) + "%";
    //outputTag.innerHTML = this.value;
}


function modifyInputs() {

    //var inputs = document.getElementsByTagName("input");

    let inputs = [];

    for (let j = 0; j < workoutKeys.length; j++) {
        let left_limit = workoutKeys[j] + "_limit_sx";
        let left_elem = document.getElementById(left_limit);
        if (left_elem !== null)
            inputs.push(left_elem);

        let right_limit = workoutKeys[j] + "_limit_dx";
        let right_elem = document.getElementById(right_limit);
        if (right_elem !== null)
            inputs.push(right_elem);

    }

    //console.log(inputs);

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].getAttribute("type") === "range") {
            inputs[i].onchange = modifyOffset;

            // the following taken from http://stackoverflow.com/questions/2856513/trigger-onchange-event-manually
            if ("fireEvent" in inputs[i]) {
                inputs[i].fireEvent("onchange");
            } else {
                var evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                inputs[i].dispatchEvent(evt);
            }
        }
    }
}

//modifyInputs();


var numFeatures;

function draw_limits(fts) {

    let feature_number = numFeatures; // da reperire
    // aggiorno e rimuovo i vecchi limiti
    for (let i = 0; i < feature_number; i++) {
        let id_sx = "#limit_sx_" + i;
        let id_dx = "#limit_dx_" + i;
        if ($(id_sx).length) {
            $(id_sx).remove();
        }
        if ($(id_dx).length) {
            $(id_dx).remove();
        }

    }

    for (let k = 0; k < feature_number; k++) {
        //console.log(fts[workoutKeys[k]]);
        // creo div slider
        var div_slider_sx = document.createElement("div");
        div_slider_sx.id = "limit_sx_" + k;
        div_slider_sx.className = "range-lim range-info";

        var div_slider_dx = document.createElement("div");
        div_slider_dx.id = "limit_dx_" + k;
        div_slider_dx.className = "range-lim range-warning";

        // se ho l'estremo sx
        if (fts[workoutKeys[k]][0][0] !== -1) {
            // creo slider
            var input_slider = document.createElement("input");
            input_slider.id = workoutKeys[k] + "_limit_sx";
            input_slider.type = "range";
            input_slider.name = "range";

            /*** ***/
            // valori min e max anche suglki input nascosti
            //var featureValue;
            if (workoutKeys[k] === "d_distance" || workoutKeys[k] === "d_time" || workoutKeys[k] === "d_pace_mean" ||
                workoutKeys[k] === "d_pace_std" || workoutKeys[k] === "d_pace_var" ||
                workoutKeys[k] === "p_welldone" || workoutKeys[k] === "p_walking" || workoutKeys[k] === "p_running" ||
                workoutKeys[k] === "p_unknown" || workoutKeys[k] === "p_has_objective") {
                input_slider.min = (norm_values[workoutKeys[k]][1] * 100.0).toFixed(2);
                input_slider.max = (norm_values[workoutKeys[k]][2] * 100.0).toFixed(2);
                input_slider.step = 0.001;
                //featureValue = workout[workoutKeys[k]] * 100.0;
            } else {
                if (workoutKeys[k] === "bmi" || workoutKeys[k] === "weight_situation" || workoutKeys[k] === "gender") {
                    input_slider.min = 1;
                    input_slider.max = 5;
                    //featureValue = workout[workoutKeys[k]];
                } else {
                    //featureValue = fts[workoutKeys[k]][0][0];;
                    input_slider.min = norm_values[workoutKeys[k]][1].toFixed(2);
                    input_slider.max = norm_values[workoutKeys[k]][2].toFixed(2);
                    if (workoutKeys[k] === "r_speed" || workoutKeys[k] === "r_distance" || workoutKeys[k] === "r_pace" || workoutKeys[k] === "bmi") {
                        input_slider.step = 0.01;
                    }
                }
            }

            /*** ***/

            let featureValue = fts[workoutKeys[k]][0][0];
            input_slider.setAttribute("value", featureValue);
            var output_slider = document.createElement("output");
            output_slider.id = input_slider.id + "_out";
            // float limit
            //output_slider.innerHTML = featureValue.toFixed(2);
            let curr_value = document.getElementById("outrange"+k);
            output_slider.innerHTML = curr_value.innerHTML;
            document.getElementById("range" + k).setAttribute("onchange", "outrange" + k + ".value=value; " + output_slider.id + ".value=value");
            let container = document.getElementById(workoutKeys[k]);


            div_slider_sx.append(input_slider);
            //div_slider_sx.append(input_slider_text);
            div_slider_sx.append(output_slider);
            container.append(div_slider_sx);
            div_slider_sx.classList.add("disable-div");
            document.getElementById(output_slider.id).style.visibility = "hidden";

            // aggiunta mark sotto input
            /*input_slider.setAttribute('data-toggle', 'tooltip');
            input_slider.setAttribute('data-placement', 'bottom');
            input_slider.setAttribute('title', fts[workoutKeys[k]][0][1]);
            let slider_id = "#" + input_slider.id;
            $(slider_id).css({'pointer-events': 'none'}).tooltip('show');*/

            let out_info = document.createElement("p");
            out_info.id = output_slider.id + "_info";
            out_info.className = "mark-info-sx";
            out_info.innerHTML = fts[workoutKeys[k]][0][1];
            div_slider_sx.append(out_info);
        }

        // se ho l'estremo dx
        if (fts[workoutKeys[k]][1][0] !== -1) {
            // creo slider
            var input_slider = document.createElement("input");
            input_slider.id = workoutKeys[k] + "_limit_dx";
            input_slider.type = "range";
            input_slider.name = "range";

            /*** ***/
            // valori min e max anche suglki input nascosti
            //var featureValue;
            if (workoutKeys[k] === "d_distance" || workoutKeys[k] === "d_time" || workoutKeys[k] === "d_pace_mean" ||
                workoutKeys[k] === "d_pace_std" || workoutKeys[k] === "d_pace_var" ||
                workoutKeys[k] === "p_welldone" || workoutKeys[k] === "p_walking" || workoutKeys[k] === "p_running" ||
                workoutKeys[k] === "p_unknown" || workoutKeys[k] === "p_has_objective") {
                input_slider.min = (norm_values[workoutKeys[k]][1] * 100.0).toFixed(2);
                input_slider.max = (norm_values[workoutKeys[k]][2] * 100.0).toFixed(2);
                input_slider.step = 0.001;
                //featureValue = workout[workoutKeys[k]] * 100.0;
            } else {
                if (workoutKeys[k] === "bmi" || workoutKeys[k] === "weight_situation" || workoutKeys[k] === "gender") {
                    input_slider.min = 1;
                    input_slider.max = 5;
                    //featureValue = workout[workoutKeys[k]];
                } else {
                    //featureValue = fts[workoutKeys[k]][0][0];;
                    input_slider.min = norm_values[workoutKeys[k]][1].toFixed(2);
                    input_slider.max = norm_values[workoutKeys[k]][2].toFixed(2);
                    if (workoutKeys[k] === "r_speed" || workoutKeys[k] === "r_distance" || workoutKeys[k] === "r_pace" || workoutKeys[k] === "bmi") {
                        input_slider.step = 0.01;
                    }
                }
            }

            /*** ***/



            let featureValue = fts[workoutKeys[k]][1][0];
            input_slider.setAttribute("value", featureValue);
            var output_slider = document.createElement("output");
            output_slider.id = input_slider.id + "_out";

            // float limit
            //output_slider.innerHTML = featureValue.toFixed(2);
            let curr_value = document.getElementById("outrange"+k);
            output_slider.innerHTML = curr_value.innerHTML;
            document.getElementById("range" + k).setAttribute("onchange", "outrange" + k + ".value=value; " + output_slider.id + ".value=value");
            let container = document.getElementById(workoutKeys[k]);

            div_slider_dx.append(input_slider);
            div_slider_dx.append(output_slider);
            container.append(div_slider_dx);
            div_slider_dx.classList.add("disable-div");
            document.getElementById(output_slider.id).style.visibility = "hidden";

            // aggiunta voto
            // aggiunta mark sotto input
            /*input_slider.setAttribute('data-toggle', 'tooltip');
            input_slider.setAttribute('data-placement', 'bottom');
            input_slider.setAttribute('title', fts[workoutKeys[k]][1][1]);
            let slider_id = "#" + input_slider.id;
            $(slider_id).css({'pointer-events': 'none'}).tooltip('show');*/
            let out_info = document.createElement("p");
            out_info.id = output_slider.id + "_info";
            out_info.className = "mark-info-dx";
            out_info.innerHTML = fts[workoutKeys[k]][1][1];
            div_slider_dx.append(out_info);
        }

        if (fts[workoutKeys[k]][0][0] === -1 && fts[workoutKeys[k]][1][0] === -1) {
            let featureValue = fts[workoutKeys[k]][1][0];
            var output_slider = document.createElement("output");
            output_slider.id = "extra_out_"+workoutKeys[k];

            // float limit
            output_slider.innerHTML = featureValue.toFixed(2);
            document.getElementById("range" + k).setAttribute("onchange", "outrange" + k + ".value=value; " + output_slider.id + ".value=value");
            let container = document.getElementById(workoutKeys[k]);

            div_slider_dx.append(output_slider);
            div_slider_dx.id = "extra_" + k;
            container.append(div_slider_dx);
            div_slider_dx.classList.add("disable-div");
            document.getElementById(output_slider.id).style.visibility = "hidden";
            div_slider_dx.style.visibility = "hidden";
        }

        if (fts[workoutKeys[k]][0][0] !== -1 && fts[workoutKeys[k]][1][0] !== -1) {
            // per averli alla stessa altezza
            //document.getElementById(input_slider.id).style.marginTop = '-55.5px';
            document.getElementById(div_slider_dx.id).style.marginTop = '-33.5px';
        }
    }

    /*
    let a = document.createElement("p");
    a.id = "testo";
    a.className = "connected";
    a.innerHTML = '5';
    let s = document.getElementById('model_type');
    s.append(a);

    $('#testo').positionOn($('#limit_dx_0'))*/

}

var randomWorkouts = [];
for (var j = 0; j < 10; j++) {
    var n = Math.floor(Math.random() * 15);
    while (randomWorkouts.includes(n)) {
        n = Math.floor(Math.random() * 15);
    }
    randomWorkouts.push(n)
}

var workout;
var modelType;
var workoutKeys = Object.keys(workoutOrdinato);
var predictions = {};

function createFeatureList() {
    var featureList = [];
    for (var feature = 0; feature < 24; feature++) {
        var element = document.getElementById("outrange" + feature);
        var value;
        /*if (element !== null) {
            if (workoutKeys[feature] == "bmi" || workoutKeys[feature] == "weight_situation" || workoutKeys[feature] == "gender") {
                value = parseFloat(element.value)
            } else {
                if (workoutKeys[feature] == "d_distance" || workoutKeys[feature] == "d_time" || workoutKeys[feature] == "d_pace_mean" ||
                    workoutKeys[feature] == "d_pace_std" || workoutKeys[feature] == "d_pace_var" ||
                    workoutKeys[feature] == "p_welldone" || workoutKeys[feature] == "p_walking" || workoutKeys[feature] == "p_running" ||
                    workoutKeys[feature] == "p_unknown" || workoutKeys[feature] == "p_has_objective") {
                    value = normalize(parseFloat(element.value) / 100.0, norm_values[workoutKeys[feature]][0], norm_values[workoutKeys[feature]][1], norm_values[workoutKeys[feature]][2])
                } else {
                    value = normalize(parseFloat(element.value), norm_values[workoutKeys[feature]][0], norm_values[workoutKeys[feature]][1], norm_values[workoutKeys[feature]][2])
                }
            }
            featureList.push(value)
        } else {
            if (workoutKeys[feature] == "bmi" || workoutKeys[feature] == "weight_situation" || workoutKeys[feature] == "gender") {
                value = parseFloat(workout[workoutKeys[feature]])
            } else {
                value = normalize(parseFloat(workout[workoutKeys[feature]]), norm_values[workoutKeys[feature]][0], norm_values[workoutKeys[feature]][1], norm_values[workoutKeys[feature]][2])
            }
            featureList.push(value)
        }*/
        if (element !== null) {
            if (workoutKeys[feature] == "bmi" || workoutKeys[feature] == "weight_situation" || workoutKeys[feature] == "gender") {
                value = parseFloat(element.value)
            } else {
                if (workoutKeys[feature] == "d_distance" || workoutKeys[feature] == "d_time" || workoutKeys[feature] == "d_pace_mean" ||
                    workoutKeys[feature] == "d_pace_std" || workoutKeys[feature] == "d_pace_var" ||
                    workoutKeys[feature] == "p_welldone" || workoutKeys[feature] == "p_walking" || workoutKeys[feature] == "p_running" ||
                    workoutKeys[feature] == "p_unknown" || workoutKeys[feature] == "p_has_objective") {
                    value = parseFloat(element.value) / 100.0
                } else {
                    value = parseFloat(element.value)
                }
            }
            featureList.push(value)
        } else {
            if (workoutKeys[feature] == "bmi" || workoutKeys[feature] == "weight_situation" || workoutKeys[feature] == "gender") {
                value = parseFloat(workout[workoutKeys[feature]])
            } else {
                value = parseFloat(workout[workoutKeys[feature]])
            }
            featureList.push(value)
        }
    }
    return featureList
}

function createSortedNormValues() {
    var sortedNormValues = [];
    workoutKeys.forEach(function (featureName) {
        if (norm_values[featureName] !== undefined) {
            sortedNormValues.push(norm_values[featureName]);
        } else {
            sortedNormValues.push([-1, -1, -1])
        }
    });
    return sortedNormValues;
}

$(document).ready(function () {
    $('#evaluate_button').on('click', function () {
        var featureList = createFeatureList();
        var sortedNormValues = createSortedNormValues();
        $.ajax({
            url: '',
            type: 'POST',
            data: {
                features: featureList,
                modelType: modelType,
                normValues: sortedNormValues
            },
            success: function (response) {
                //First is mark
                var data = JSON.parse(response);
                let element = document.getElementById("mark");
                element.innerHTML = data[0];
                for (var predictionFeature = 0; predictionFeature < 12; predictionFeature++) {
                    var predictionValues = [];
                    predictionValues.push([data[(predictionFeature * 4) + 1], data[(predictionFeature * 4) + 2]]);
                    predictionValues.push([data[(predictionFeature * 4) + 3], data[(predictionFeature * 4) + 4]]);
                    predictions[workoutKeys[predictionFeature]] = predictionValues;
                }

                draw_limits(predictions);
                modifyInputs();
            },
            error: function () {
                console.log("Errore richiesta valutazione")
            }
        })
    });

    document.getElementById("evaluate_button").click();
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


function generateHTML(workoutArrayIndex) {
    var currentMark = Math.trunc(randomWorkouts[workoutArrayIndex] / 3);
    var currentInstance = randomWorkouts[workoutArrayIndex] % 3;
    numFeatures = (Math.floor(Math.random() * 3) + 1) * 4;

    modelType = Math.floor(Math.random() * 3) + 1;
    workout = workouts[currentMark][currentInstance];
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
        if (workoutKeys[i] == "d_distance" || workoutKeys[i] == "d_time" || workoutKeys[i] == "d_pace_mean" ||
            workoutKeys[i] == "d_pace_std" || workoutKeys[i] == "d_pace_var" ||
            workoutKeys[i] == "p_welldone" || workoutKeys[i] == "p_walking" || workoutKeys[i] == "p_running" ||
            workoutKeys[i] == "p_unknown" || workoutKeys[i] == "p_has_objective") {
            input_slider.min = (norm_values[workoutKeys[i]][1] * 100.0).toFixed(2);
            input_slider.max = (norm_values[workoutKeys[i]][2] * 100.0).toFixed(2);
            input_slider.step = 0.001;
            featureValue = workout[workoutKeys[i]] * 100.0;
        } else {
            if (workoutKeys[i] == "bmi" || workoutKeys[i] == "weight_situation" || workoutKeys[i] == "gender") {
                input_slider.min = 1;
                input_slider.max = 5;
                featureValue = workout[workoutKeys[i]];
            } else {
                featureValue = workout[workoutKeys[i]];
                input_slider.min = norm_values[workoutKeys[i]][1].toFixed(2);
                input_slider.max = norm_values[workoutKeys[i]][2].toFixed(2);
                if (workoutKeys[i] == "r_speed" || workoutKeys[i] == "r_distance" || workoutKeys[i] == "r_pace" || workoutKeys[i] == "bmi") {
                    input_slider.step = 0.01;
                }
            }
        }


        var output_slider = document.createElement("output");
        output_slider.id = "outrange" + i;
        //output_slider.innerHTML = workout[workoutKeys[i]];
        // float limit
        output_slider.innerHTML = featureValue.toFixed(2);

        input_slider.setAttribute("value", featureValue);
        input_slider.setAttribute("onchange", "outrange" + i + ".value=value");

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
        var button = document.getElementById("next_button");

        document.getElementById("current_workout").innerHTML = "Workout " + parseInt((workoutArrayIndex % 5) + 1);
        document.getElementById("model_type").innerHTML = "Model " + modelType;
    }

    // primi 4 allenamenti
    if (workoutArrayIndex < 4) {
        button.onclick = function () {
            $("#f1").empty();
            $("#f2").empty();
            generateHTML(workoutArrayIndex + 1);
            document.getElementById("evaluate_button").click();
        };
    }
    // al quinto cambio il nome del bottone e aggi
    else if (workoutArrayIndex === 4) {
        button.innerHTML = 'Evaluation Phase';
        let col = document.getElementById("col1");

        document.getElementById("evaluate_button").click();
        button.onclick = function () {
            $("#f1").empty();
            $("#f2").empty();

            // rimuovo la vecchia visualizzazione del voto
            document.getElementById("mark").remove();

            // creo la struttura del nuovo bottone
            let eval_button = document.createElement("form");
            let eval_button_div = document.createElement("div");
            eval_button_div.className = "from-group";
            let button_input = document.createElement("input");
            button_input.id = "evaluation_form";
            button_input.setAttribute("type", "text");
            button_input.setAttribute("size", "1");
            button_input.setAttribute("maxlength", "1");
            button_input.setAttribute("type", "text");
            button_input.className = "form-control mark-text-zone";
            button_input.setAttribute("aria-describedby", "inputGroup-sizing-sm");
            button_input.setAttribute("oninput", "this.value=this.value.replace(/[^1-5]/g,'');");

            eval_button_div.appendChild(button_input);
            eval_button.appendChild(eval_button_div);
            // aggiungo il nuovo elemento al posto del precedente
            document.getElementById("mark_div").appendChild(eval_button);

            // rimuovo il pulsante per la valutazione
            document.getElementById("evaluate_button").remove();

            document.querySelector('#col2 p').innerHTML = 'Insert mark:';


            generateHTML(workoutArrayIndex + 1);

            // disabilito gli slider relativi alle feature
            col.classList.add("disable-div");
        };
        // finisco gli altri allenamenti
    } else if (workoutArrayIndex < 9) {
        //document.getElementById("evaluate_button").remove();
        button.innerHTML = 'Confirm mark';
        button.onclick = function () {
            if (document.getElementById("evaluation_form").value !== "") {
                $("#f1").empty();
                $("#f2").empty();
                generateHTML(workoutArrayIndex + 1);
                document.getElementById("evaluation_form").value = "";
            } else {
                alert("No mark inserted!");
            }
        };
        // termino la fase di valutazione... (da fare)
    } else {
        button.innerHTML = 'Terminate Evaluation';
        button.className = "btn btn-outline-success mb-2 wkbotton";
        button.onclick = function () {
            $("#f1").empty();
            $("#f2").empty();
            workoutArrayIndex = numFeatures;
        };
    }
}

generateHTML(0);
