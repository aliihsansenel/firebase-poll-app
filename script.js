var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

var poll = document.getElementById('poll');

var pollList = document.querySelector("#poll ul");
var pollData = {};
var pollElements = [];
var pollElementLabels = [];

var isAnyOptionSelected = 0;
var lastSelectedOption = -1;

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyDF8gLQ4WO253jls_brE2tltj1FD9KlA1I",
    authDomain: "polls-db1a3.firebaseapp.com",
    databaseURL: "https://polls-db1a3-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "polls-db1a3",
    storageBucket: "polls-db1a3.appspot.com",
    messagingSenderId: "79023946688",
    appId: "1:79023946688:web:12e2d1133bab93c75c6625"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// // inserting
// db.ref('polls/' + 'test').set(
//     {
//         header: "Hangi dili daha çok kullanıyorsunuz?",
//         choices: [{
//             choice: "Javascript",
//             votes: 45
//         },
//         {
//             choice: "Java",
//             votes: 20
//         },
//         {
//             choice: "Python",
//             votes: 40
//         },
//         {
//             choice: "C#",
//             votes: 15
//         }],
//         totalVotes: 120
//     }
// );

// .then(function() {
//     console.log('Update Ran Successfully');
// });

//firebase selection
db.ref('polls/' + /*pollId*/'test').on('value', function (snapshot) {
    pollData = snapshot.val();
    // console.log(pollData);  
    formPoll();
});

//update db.ref('polls/' + 'test').update(/* buraya object yapısı*/)
//remove db.ref('polls/' + 'test').remove();


// pollData'yı ayarladıktan sonra bu çalışınca anketin içini dolduruyor.
function formPoll(){
    pollElements = [];
    pollElementLabels = [];
    isAnyOptionSelected = 0;
    lastSelectedOption = -1;

    document.querySelector('#poll .pollHeader').innerText = pollData.header;
    
    pollList.innerHTML = '';
    pollData.choices.forEach((element, index) => {
        let pollElement = document.createElement('li'); // seçeneklerden herbiri
        

        let percent = Math.round(element.votes * 100 / pollData.totalVotes);
    
        pollElement.innerHTML = 
        `<label for="opt-${index}">
            <input type="radio" name="r0" id="opt-${index}"><span>${element.choice}</span>
            <span class="percent">%${percent}</span><br>

            <div class="progressBar" style="--w:${percent};"></div>
        </label>`;

        pollElement.classList.add('option');
        let pollElementLabel = pollElement.children[0];
        // console.log(pollElementLabel);
        pollElementLabel.getElementsByTagName('input')[0].addEventListener('click', (e) => optionClickHandler(e.target));
        
        pollList.appendChild(pollElement);
        pollElements.push(pollElement);
        pollElementLabels.push(pollElementLabel);
    });


    
    width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width > 768) {
        console.log('width > 768');
        poll.classList.add('animation');
        poll.addEventListener("animationend", function name() {
            poll.classList.remove('animation');
        });
    }
    
    poll.classList.add('visible');
}
function optionClickHandler(input){
    const index = parseInt(input.getAttribute("id").split('opt-')[1]);

    if(lastSelectedOption === index){
        pollElements[index].classList.remove('checked');
        input.checked = false;
        isAnyOptionSelected = 0;
        lastSelectedOption = -1;
        pollElements.forEach((element, index) => {
            updateOptionContent(index);
        });
        return;
    }
    if(lastSelectedOption != -1){
        pollElements[lastSelectedOption].classList.remove('checked');
        updateOptionContent(lastSelectedOption);

    }else{
        isAnyOptionSelected = 1;
        pollElements.forEach((element, index) => {
            updateOptionContent(index);
        });
        poll.classList.add('voted');
    }
    lastSelectedOption = index;
    pollElements[index].classList.add('checked');
    updateSelectedOptionContent(index);

}

function updateOptionContent(index) {
    let pollChoiceData = pollData.choices[index];
    let pollElement = pollElements[index];
    let percent = Math.round(pollChoiceData.votes * 100 / (pollData.totalVotes + isAnyOptionSelected));

    pollElement.getElementsByClassName('percent')[0].innerText = '%' + percent;
    pollElement.getElementsByClassName('progressBar')[0].style.setProperty('--w', percent.toString());
    
    return pollElement;
    
}
function updateSelectedOptionContent(index) {
    let pollChoiceData = pollData.choices[index];
    let pollElement = pollElements[index];
    let percent = Math.round((pollChoiceData.votes + 1) * 100 / (pollData.totalVotes + isAnyOptionSelected));

    pollElement.getElementsByClassName('percent')[0].innerText = '%' + percent;
    pollElement.getElementsByClassName('progressBar')[0].style.setProperty('--w', percent.toString());
    
    return pollElement;
    
}

var counter = 0;
let polls = ['first', 'second', 'third','fourth'];
// Butona basıldığında 
document.getElementById('fetchPoll').addEventListener('click', function () {
    let pollToBeFetched = counter < polls.length - 1 ? counter++ : polls.length - 1;
    poll.classList.remove('visible');
    poll.classList.remove('voted');
    db.ref('polls/' + polls[pollToBeFetched]).on('value', function (snapshot) {
        pollData = snapshot.val();
        formPoll();
    });
});

function vote() {
    // en güncel anket verisini firebase'de güncelleyecek.
}

// function optionClickHandler(event, pollElement, pollElementLabel) {
//     let element = event.target;
//     if(pollElementLabel !== element){
//         // console.log('kebe');
//         // event.preventDefault();
//         pollElementLabel.click();
//         //event.preventDefault();
//         //event.stopPropagation();
//         return false;
//     }
//     // console.log('kontrol geçildi');
//     isAnyOptionSelected = 1;
//     Array.from(pollList.children).forEach((pollElement, index) => {
//         pollElement.classList.remove('checked')
//         updateOptionContent(pollElement, index);

//     });
//     // TODO hata burada buraya index bulma konacak label
//     let forString = pollElementLabel.getAttribute("for");
    
//     // console.log(parseInt(forString.split('opt-')[1]));
//     updateSelectedOptionContent(pollElement, parseInt(forString.split('opt-')[1]));
//     //sonra sadece seçilene checkhed yaz.
//     pollElement.classList.add('checked');
//     poll.classList.add('voted');
// }
// console.log(document.getElementById('fetchPoll'));



// function callPara() {
    
//     Array.from(document.querySelectorAll('input')).forEach(element => {
        
//         element.addEventListener('change', function () {
//             console.log(element.checked + element.getAttribute('id'));
//         });
//     });
// }

    // Sadece tıklanan seçeneğin kenarlığını değiştirmek için kod
    // Array.from(pollList.children).forEach(element => {
    //     element.onclick = function() {
            
    //         //Her linin checkedini kaldır
    //         Array.from(pollList.children).forEach(element => {
                
    //             element.classList.remove('checked');
    //         });
    //         //sonra sadece seçilene checkhed yaz.
    //         element.classList.add('checked');
    //         poll.classList.add('voted');
    //         console.log("sa");
    //     };
    // });
// window.onload = function(){
    
//     if (width > 768){
//         console.log('width > 768');
//         poll.classList.add('animation');
        
//     }
    
//     poll.classList.add('visible');
// };

// var progressBars = Array.from(document.querySelectorAll("li.progressBar::after"));

// console.log(Array.from(pollList.children).length);




// function downloadPoll(pollId = 'test') {
    
//     let xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function() {
//         if (this.readyState == 4 && this.status == 200) {

//             pollData = JSON.parse(this.responseText);
//             updatePoll();

//         }
//     };
//     xhttp.open("GET", `polls/${pollId}.json`, true);

//     xhttp.send();

// }

// setTimeout(function () {
//     poll.classList.remove('animation');
// }, 400);


    // xhttp.open("GET", "https://jsonbase.com/ihsan-polls/test", true);


    
// /* ALİ */
// window.addEventListener("click", e => {
    
//     firebase.database().ref().child("users").child("current-user").child("todos").push(
//         {
//             description: "descriptionS aliiiiii",
//             completed: false
//         }
//     ).then(
//         console.log("yüklendi!!")
//     )

//     // firebase.database().ref().child('polls/' + 'test').set(
//     //     {
//     //         Name: "aliyaro",
//     //         Surname: "babayaro"
//     //     }
//     // );
//     // .then(function() {
//     //     console.log('Update Ran Successfully');
//     // });

//     console.log(firebase.database());
// });


// TODO radio button'a change event listener eklenecek.
        //pollElementLabel.addEventListener("click", (e) => optionClickHandler(e, pollElement, pollElementLabel));