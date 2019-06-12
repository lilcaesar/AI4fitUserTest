from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from django.http import HttpResponse
from django.utils import six

from joblib import load

import pandas as pd
import sklearn

columns = ['o_distance', 'p_unknown', 'p_walking', 'p_running', 'r_time',
               'r_speed', 'r_distance', 'r_pace', 'o_pace', 'o_time',
               'p_welldone', 'weight_situation', 'age', 'height', 'weight',
               'gender', 'bmi', 'calories', 'p_has_objective', 'd_pace_std',
               'd_pace_mean', 'd_time', 'd_distance', 'd_pace_var']

@csrf_exempt
def evaluate(request):
    if request.method == 'POST':
        features = list(six.iterlists(request.POST))[0][1]
        features = list(map(float, features))
        singleFrame = pd.DataFrame(features, columns)

        model = load('AI4fitUserTest/static/ExtraTreesClassifier.joblib')
        #model = load('AI4fitUserTest/static/LogisticRegression.joblib')

        mark = model.predict(singleFrame.T)

        return HttpResponse(mark)

    return render(request, 'userTest.html')
