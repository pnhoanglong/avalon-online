
var OBERON_POS = 9
var SERVANT = "Arthur's Servant"
// Constants
var ROLES = [
    'Merlin', //0
    'Percival', //1
    'Mordred', //2
    'Morgana', //3
    'Assassin', //4
    SERVANT, //5
    SERVANT, //6
    SERVANT, //7
    SERVANT, //8
    'Oberon' //9
]
var roleAssignedPlayers = [""]

/**
 * MERLIN
 */
function createMerlinInstructions() {
    var pos = 0
    return roleAssignedPlayers[pos].concat(" is ", ROLES[pos], ". ", createAllDevilInstructions(true))
}


/**
 * PERCIVAL
 */
function createPercivalInstructions() {
    var pos = 1
    var objects = [roleAssignedPlayers[0],roleAssignedPlayers[3]]
    objects.sort()
    return roleAssignedPlayers[pos].concat(" is ", ROLES[pos], ". Merlin and Morgana are ", objects.toString())
}

/**
 * DEVILS
 */
function createOneDevilInstructions(pos) {
    return roleAssignedPlayers[pos].concat(" is ",ROLES[pos], ". ", createAllDevilInstructions(false))
}

function createAllDevilInstructions(forMerlin) {
    var devils = [roleAssignedPlayers[3],roleAssignedPlayers[4]]

    if(!forMerlin) {
        devils.push(roleAssignedPlayers[2])
    }
    
    if (roleAssignedPlayers.length > OBERON_POS && forMerlin){
        devils.push(roleAssignedPlayers[OBERON_POS])
    }
    devils.sort()
    return "Evils are: ".concat(devils.toString())
}

/**
 * HUMANs and OBERON 
 * @param {*} pos 
 */
function createSinglePlayerInstructions(pos) {
    return roleAssignedPlayers[pos].concat(" is ",ROLES[pos])
}


function assignRole(players) {
    var num = players.length
    var result = new Array(num)

    //Assign role
    for (let player of players) {
        var role = -1
        do{
            var role = Math.floor(Math.random() * num)
        } while(typeof result[role] !== 'undefined')
        //console.log(" %s ->%d:  %s", player, role, ROLES[role])
        result[role] = player
    };
    return result
}

exports.startGame  = function startGame(players){
        var playerCount = players.length

        if(playerCount < 7 || playerCount > 10) {
            return "Players count must be (7<= N <=10), current count = " + playerCount
        }

        roleAssignedPlayers = assignRole(players)
    
        // Create instruction
        var instructions = {}
        instructions[roleAssignedPlayers[0]] = createMerlinInstructions()
        instructions[roleAssignedPlayers[1]] = createPercivalInstructions()
    
        // Devils
        instructions[roleAssignedPlayers[2]] = createOneDevilInstructions(2)
        instructions[roleAssignedPlayers[3]] = createOneDevilInstructions(3)
        instructions[roleAssignedPlayers[4]] = createOneDevilInstructions(4)
    
        // Humans
        for (let i = 5; i< playerCount; i++) {
            instructions[roleAssignedPlayers[i]] = createSinglePlayerInstructions(i)
        }
    
        // Oberon
        if (roleAssignedPlayers.length > OBERON_POS){
            instructions[roleAssignedPlayers[OBERON_POS]] = createSinglePlayerInstructions(OBERON_POS)
        }
    
        return JSON.stringify(instructions)   
}


exports.chooseKing  = function chooseKing(players){
    // Chooes the king
  var kingPos = Math.floor(Math.random() * players.length)
  return  players[kingPos]
}