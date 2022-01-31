
const attackValue = 10;
const strongAttackValue = 17;
const monsterAttackValue = 14;
const healValue = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let battleLog = [];

function getMaxLifeValues(){
    const enteredValue = prompt('maximum life for you and the monster', '100');

    const parsedValue = parseInt(enteredValue);
    if (isNaN(parsedValue) || parsedValue <= 0){
        throw {message: 'Invalid user input, not a number'};
    }
    return parsedValue;
}

let chosenMaxLife;

try{
    chosenMaxLife = getMaxLifeValues();
} catch (error) {
    console.log(error);
    chosenMaxLife = 100;
    alert('you entered something wrong');
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(ev, val, monsterHealth, playerHealth){
    let logEntry;
    if(ev === LOG_EVENT_PLAYER_ATTACK){
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth,
        };
    }
    if(ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
        logEntry = {
            event: ev,
            value: val,
            target: 'MONSTER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth,
        };
    }
    if(ev === LOG_EVENT_MONSTER_ATTACK){
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth,
        };
    }
    if(ev === LOG_EVENT_PLAYER_HEAL){
        logEntry = {
            event: ev,
            value: val,
            target: 'PLAYER',
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth,
        };
    }
    if(ev === LOG_EVENT_GAME_OVER){
        logEntry = {
            event: ev,
            value: val,
            finalMonsterHealth: monsterHealth,
            finalPlayerHealth: playerHealth,
        };
    }
    battleLog.push(logEntry);
}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
}

function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(monsterAttackValue);
    currentPlayerHealth -= playerDamage;
    writeToLog(
        LOG_EVENT_MONSTER_ATTACK,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth,
    );

    if (currentPlayerHealth <=0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert ('would have been dead but bonus life helped you!');
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert('you won!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'Player Won!',
            currentMonsterHealth,
            currentPlayerHealth,
        );
        reset();
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert('you lost!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'Monster Won!',
            currentMonsterHealth,
            currentPlayerHealth,
        );
        reset();
    } else if(currentPlayerHealth <=0 && currentMonsterHealth <=0){
        alert('you have a draw!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A Draw!',
            currentMonsterHealth,
            currentPlayerHealth,
        );
        reset();
    }
}

function attackMonster(mode){
    let maxDamage;
    let logEvent;
    if (mode === MODE_ATTACK){
        maxDamage = attackValue;
        logEvent = LOG_EVENT_PLAYER_ATTACK;
    } else if(mode === MODE_STRONG_ATTACK) {
        maxDamage = strongAttackValue;
        logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    }
    
    const damage= dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;    
    writeToLog(
        logEvent,
        damage,
        currentMonsterHealth,
        currentPlayerHealth,
    );
    endRound()
}

function attackHandler(){
    attackMonster('ATTACK');
}

function strongAttckHandler(){
    attackMonster('STRONG_ATTACK');
}

function healPlayerHandler(){
    let healingValue;
    if (currentPlayerHealth >= chosenMaxLife - healValue){
        alert('can not heal higher than max health');
        healingValue = chosenMaxLife - currentPlayerHealth;
    } else{
        healingValue = healValue;
    }
    increasePlayerHealth(healingValue);
    currentPlayerHealth += healingValue;    
    writeToLog(
        LOG_EVENT_PLAYER_HEAL,
        healValue,
        currentMonsterHealth,
        currentPlayerHealth,
    );
    endRound();
}

function printLogHandler(){



    let i = 0
    for(const logEntry of battleLog){
        console.log(`#${i}`);
        for(const key in logEntry){
            console.log(`${key} => ${logEntry[key]}`);
        }
        i++
    }
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttckHandler);
healBtn.addEventListener('click', healPlayerHandler)
logBtn.addEventListener('click', printLogHandler)