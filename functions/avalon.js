
var OBERON_POS = 9
// Constants
var ROLES = [
    'Merlin', //0
    'Percival', //1
    'Mordred', //2
    'Morgana', //3
    'Assassin', //4
    'Người ngu muội', //5
    'Người bình thường', //6
    'Trung thần', //7
    'Thần dân', //8
    'Oberon' //9
]
var roleAssignedPlayers = [""]

/**
 * MERLIN
 */
function createMerlinInstructions() {
    var pos = 0
    return roleAssignedPlayers[pos].concat(" là ", ROLES[pos], ". ", createAllDevilInstructions(true))
}


/**
 * PERCIVAL
 */
function createPercivalInstructions() {
    var pos = 1
    var objects = [roleAssignedPlayers[0],roleAssignedPlayers[3]]
    objects.sort()
    return roleAssignedPlayers[pos].concat(" là ", ROLES[pos], ". Merlin và Morgana là ", objects.toString())
}

/**
 * DEVILS
 */
function createOneDevilInstructions(pos) {
    return roleAssignedPlayers[pos].concat(" là ",ROLES[pos], ". ", createAllDevilInstructions(false))
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
    return "Quỷ là: ".concat(devils.toString())
}

/**
 * HUMANs and OBERON 
 * @param {*} pos 
 */
function createSinglePlayerInstructions(pos) {
    return roleAssignedPlayers[pos].concat(" là ",ROLES[pos])
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
            return "Số người chơi từ 7 -> 10, hiện giờ là  " + playerCount 
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