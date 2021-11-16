let doorSelectedNumber = undefined
const gifts = ["goat", "goat", "goat"];
const doorSelectedText = document.getElementById("doorSelected");
const buttonNextStep = document.getElementById("nextRound");
const contentClock = document.getElementById("content__clock");
const modal = document.getElementById("modal")
const roundText = document.getElementById("round");
const minimalRandom = 0, maximumRandom = 2;
let round = 0, randomDoor = undefined;
const doorsOpen = []

const randomInt = (min = minimalRandom, max = maximumRandom) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const openDoor = (port) => {
    const container = document.getElementById(`${port}`)
    const self = container.classList;
    self.add("change__image--up")
    setTimeout(() => {
        container.src = `./assets/door_${gifts[port]}.png`;
        self.add("change__image--down")
        self.remove("change__image--up")
    }, 400)

}

const updateRound = (rnd = undefined) => {
    rnd ? round = rnd : round++;
    roundText.innerText = `${round}`
}

const init = () => {
    updateRound()
    for (let index = 0; index < 3; index++)
        document.getElementById(`${index}`).src = "./assets/door.png"
    gifts[randomInt()] = "car"
    buttonNextStep.disabled = true
}
init();

function blockDoors(op = true) {
    buttonNextStep.disabled = !op;
    op ? buttonNextStep.classList.remove("btn__blocked") : buttonNextStep.classList.add("btn__blocked");

    for (let index = 0; index < 3; index++)
        doorsOpen.includes(index) ? document.getElementById(`button#${index}`).disabled = true :
            index === doorSelectedNumber ? document.getElementById(`button#${index}`).disabled = false :
                document.getElementById(`button#${index}`).disabled = op
}

const selectDoor = (button) => {
    doorSelectedNumber = parseInt(button.value)
    doorSelectedText.innerText = `Você escolheu a porta: ${parseInt(doorSelectedNumber) + 1}`
    const el = document.getElementById('button');
    if (el.classList.contains("hide"))
        el.classList.remove("hide");
    blockDoors()
}

async function updateClock(clk) {
    let time = clk;
    const clock = document.getElementById("clock")
    clock.innerText = `00:0${time}`
    return await new Promise(resolve => {
        const interval = setInterval(() => {
            time--;
            clock.innerText = `00:0${time}`
            if (time === 0) {
                resolve("ready");
                clearInterval(interval);
            };
        }, 1000);
    });
}

function resetDoors() {
    blockDoors(false);
    const element = document.getElementById("button")
    element.classList.add("hide");
    doorSelectedText.innerText = "Clique em uma das portas para selecionar"
    console.log(doorsOpen)
}

function randomNewDoor() {
    let rand = randomInt()
    while (rand === doorSelectedNumber || gifts[rand] === "car")
        rand = randomInt()
    return rand;
}


async function nextRound() {
    if (buttonNextStep.disabled)
        return
    contentClock.classList.remove("hide");
    const msg = document.getElementById("menssagem");
    msg.innerText = "Estamos escolhendo uma porta para abrir!";
    const response = await updateClock(1);
    if (response === "ready") {
        randomDoor = randomNewDoor();
        doorsOpen.push(randomDoor)
        msg.innerText = `Vamos abrir a porta número: ${randomDoor + 1}`;
        const open = await updateClock(1);
        if (open === "ready") {
            openDoor(randomDoor);
            msg.innerText = `A porta número ${randomDoor + 1} foi aberta!`;
            updateRound();
            setTimeout(() => { contentClock.classList.add("hide") }, 2000)
            buttonNextStep.innerText = "O que eu ganhei?"
            setTimeout(()=>{openModal()},1000)
        }
    }
}

function openModal() {
    modal.classList.add("modal__toStart")
    setTimeout(() => { modal.classList.add("modal__show") }, 400)
    setTimeout(() => {
        modal.classList.remove("modal__hide")
        modal.classList.remove("modal__toEnd")
    }, 600)
}

function closeModal() {
    modal.classList.add("modal__hide")
    setTimeout(() => { modal.classList.add("modal__toEnd") }, 1000)
    setTimeout(() => {
        modal.classList.remove("modal__toStart")
        modal.classList.remove("modal__show")
    }, 600)
}