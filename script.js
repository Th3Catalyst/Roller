let money = 100;
let bet = 0;
let extraTimesL = [];
let running;
let total;
let bar;
let done;




function weightedRandom(list) {

    let totalProb = 0;
    for (let i = 0; i < list.length; i++) {
        totalProb += list[i].rarity;
    }
    let randomVal = Math.random() * totalProb;
    let cumulativeProb = 0;
    //console.log(totalProb);
    for (i = 0; i < list.length; i++) {
        cumulativeProb += list[i].rarity;
        //console.log("newProb: ", cumulativeProb)
        if (randomVal < cumulativeProb) {
        return list[i];
        };
    };
};

function checkFlag(flag, func) {
    if (!eval(flag)) {
        console.log(flag);
        setTimeout(() => {checkFlag(flag,func)},100);
    } else {
        console.log(func)
        func();
    }
};

let values = [
    {value: 0, rarity: 0.000001},
    {value: 0.00001, rarity: 0.1},
    {value: 0.0001, rarity: 0.2},
    {value: 0.001, rarity: 0.088887},
    {value: 0.05, rarity: 0.25},
    {value: 0.1, rarity:1},
    {value: 0.2, rarity: 2},
    {value: 0.5, rarity: 4},
    {value: 0.7, rarity: 10},
    {value: 0.8, rarity: 15},
    {value: 0.9, rarity: 20},
    {value: 1, rarity: 30},
    {value: 1.5, rarity: 10},
    {value: 2, rarity: 3},
    {value: 3, rarity: 2},
    {value: 4, rarity: 1},
    {value: 5, rarity: 0.75},
    {value: 6, rarity: 0.5},
    {value: 10, rarity: 0.1},
    {value: 20, rarity: 0.01},
    {value: 50, rarity: 0.001},
    {value: 100, rarity: 0.0001},
    {value: 200, rarity: 0.00001},
    {value: 500, rarity: 0.000001},
    {value: 1000, rarity: 0.000001},
    
];

let totalPercent = 0;
for (i=0;i<values.length;i++) {
    totalPercent += values[i].rarity;
};
console.log(totalPercent);

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



async function Roll(betVal = 0, div = "output1") {

    let mult;
    let prevVal;
    for (let i = 0; i < 50; i++) {
        let value;
        do {
            value = weightedRandom(values).value;
        } while (value == prevVal);
        prevVal = value;
        document.getElementById(div).innerHTML = betVal + " x " + value + " = " + ((betVal*value).toFixed(2));
        const outputElement = document.getElementById(div);
        outputElement.style.animation = "bounce 0.5s ease-in-out 1";
        //console.log("value: ", value);
        mult = value;
        await sleep(30 * ((0.15)*(i^2) + 2 + Math.random()));
        outputElement.style.animation = "none";
        void outputElement.offsetWidth; // access an element to force animation reset
    };
    document.body.style.animation = "fade 2s ease-in-out 0.5s 1";
    
    sleep(2900).then(() => {document.body.style.animation = "";});
    return mult;
};


document.getElementById("rollerB").addEventListener("click", () => {
    if (running) {return;};
    done = false;
    let bet = parseFloat(parseFloat(document.getElementById("moneyInput").value).toFixed(2));
    let times = parseInt(document.getElementById("timesInput").value);
    if (isNaN(times)) {
        alert("Please enter a valid number of times to roll");
        return;
    }
    if (isNaN(bet) || (bet < 0)) {
        alert("Please enter a valid number for the bet amount.");
        return;
    }
    if (money - bet*times < 0) {
        alert("You don't have enough money to place that bet!");
        return;
    } else if (!running) {
        console.log("bet: ", bet);
        money -= bet*times;
        money = parseFloat(money.toFixed(2));
        document.getElementById("moneyOutput").innerHTML = "Money: " + money;
    }
    
    running = true;
    for (let i = 0; i < extraTimesL.length; i++) {
        extraTimesL[i].remove();
    };
    console.log("running");
    if (times > 1) {
        for (let i = 2; i <= times; i++) {
            let output = document.createElement("div");
            output.className = "mult";
            output.id = "output" + i;
            let target = document.getElementById("output" + (i-1));
            document.body.insertBefore(output,target);
            extraTimesL.push(output)
        };
    };
    if (total && bar) {
        total.remove();
        bar.remove();
    };
    
    let totalRevenue = 0;
    for (let i = 0; i < times; i++) {
        let div = "output" + (i+1);
        Roll(bet,div).then(multiplier => {
            console.log("multiplier: ", multiplier);
            
            totalRevenue += bet * multiplier;
            done = true;
        });
    }
    
    let totalTime = 0;
    for (let i = 0; i < 50; i ++) {
        totalTime += 30 * ((0.15)*(i^2) + 2);
    };
    checkFlag("done", () => {
        let target = document.getElementById("chancesT");
        bar = document.createElement("hr");
        document.body.insertBefore(bar,target);
        bar.style.animation = "width 0.5s linear 0s 1";
        sleep(710 + 10*times).then(() => {
            totalRevenue = parseFloat(totalRevenue.toFixed(2));
            console.log(typeof(totalRevenue), " ", totalRevenue);
            money += totalRevenue;
            document.getElementById("moneyOutput").innerHTML = "Money: " + money.toFixed(2);
            total = document.createElement("div");
            total.className = "mult";
            total.innerHTML = (bet*times) + " x " + ((totalRevenue / (bet*times)).toFixed(4)) + " = " + totalRevenue;
            total.id = "total";
            
            bar.insertAdjacentElement("afterend",total);
            running = false;
        });
    });
    
    
    


});
let table = document.getElementById("chancesT");
for (let i = 0; i < values.length; i++) {
    let row = table.insertRow(i + 1);
    let multCell = row.insertCell(0);
    let chanceCell = row.insertCell(1);
    multCell.innerHTML = values[i].value + "x";
    chanceCell.innerHTML = values[i].rarity + "%";
};

// document.getElementById("test").addEventListener('click', () => {
//     fetch('https://script.google.com/macros/s/AKfycbzxw8ncQBjZGSQ5uwvU6rxOyspTw4f0UieApLrzNdA/dev?user=nam', {
//         method: 'POST',
//         redirect: "follow",
//         headers: {
//             'Content-Type': 'text/plain;charset=utf-8'
//         },
//     }).then(response => {
//         console.log('Request sent successfully');
//         window.location.assign(`/index.html`);
//     }).catch(error => {
//         console.error('Error:', error);
//     })
    
// })