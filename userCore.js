function IsReturningUser(username) {
    users = document.getElementsByTagName("li");
    for (var idx =0; idx < users.length; idx++) {
        if (username == users[idx].innerHTML) {
            return true;
        }
    }
    return false;
}


function CreateNewUser(username, list) {
    var item = document.createElement("li");
    item.innerHTML = String(username);
    item.id = String(username) + "_name"
    list.appendChild(item);

}

function createSignInItem(username, list) {
    var item = document.createElement("li");
    item.innerHTML = 1;
    item.id = String(username) + "_signins"
    list.appendChild(item);

}

function createDigitInfo(username, list,  digit) {
    var item = document.createElement("li");
    item.innerHTML = 0;
    item.id = String(username) + "_" + digit + "_attempts"
    list.appendChild(item);

    item = document.createElement("li");
    item.innerHTML = 0;
    item.id = String(username) + "_" + digit + "_accuracy"
    list.appendChild(item);
}

function addDigitAttempt(is_correct) {
    digit = currentDigit
    username = document.getElementById("username").value;
    ID = String(username) + "_" + digit + "_attempts";
    listItem = document.getElementById(ID);
    if (!listItem) {
        return
    }
    listItem.innerHTML = parseInt(listItem.innerHTML)  + 1;
    num_attempts = parseInt(listItem.innerHTML);

    ID = String(username) + "_" + digit + "_accuracy";
    listItem = document.getElementById(ID);
    curr_accuracy = parseFloat(listItem.innerHTML);
    listItem.innerHTML =  ((num_attempts-1)*curr_accuracy + (is_correct))/num_attempts;
}

function getPastDigitInfo(digit) {
    username = document.getElementById("username").value;
    return getPastDigitInfo(digit, username);
}

function getPastDigitInfo(digit, username) {
    is_correct = mean_prediction_accuracy > 0.6;
    ID = String(username) + "_" + digit + "_attempts";
    listItem = document.getElementById(ID);
    if (!listItem) {
        return [0,0]
    }
    num_attempts = parseInt(listItem.innerHTML);

    ID = String(username) + "_" + digit + "_accuracy";
    listItem = document.getElementById(ID);
    curr_accuracy = parseFloat(listItem.innerHTML);

    return [num_attempts, curr_accuracy]
}

function SignIn() {
    for (var idx = 0; idx < 10; idx++) {
        [num_attempts, accuracy] = getPastDigitInfo(idx);
        num_attempts_per_digit[idx] = num_attempts;
        mean_prediction_accuracies[idx] = accuracy;
    }

    username = document.getElementById("username").value;
    var list = document.getElementById("users");
    if (!IsReturningUser(username)) {
        CreateNewUser(username, list);
        createSignInItem(username, list);
        for (var idx =0; idx < 10; idx++) {
            createDigitInfo(username, list, idx);
        }
    } else {
        ID = String(username) + "_signins";
        listItem = document.getElementById(ID);
            listItem.innerHTML = parseInt(listItem.innerHTML)  + 1;
    }
    console.log(list.innerHTML);
    return false;
}

function orderUsers(a ,b) {
    [num_a, acc_a] = getPastDigitInfo(currentDigit, a);
    [num_b, acc_b] = getPastDigitInfo(currentDigit, b);
    return acc_a < acc_b;
}

function getUsersSorted() {
    users = [];
    usersHTML = document.getElementsByTagName("li");
    
    for (var idx =0; idx < usersHTML.length; idx++) {
        if (usersHTML[idx].id.includes("_name")) {
            users.push(usersHTML[idx].innerHTML)
        }
    }
    users.sort(orderUsers);
    return users;
}