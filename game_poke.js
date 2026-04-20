#!/usr/bin/env node
import inquirer from "inquirer";

const BASE_URL = "https://pokeapi.co/api/v2/";

async function getPokemonData(name) {
    try {
        const response = await fetch(`${BASE_URL}pokemon/${name.toLowerCase()}`);
        if (!response.ok) {
            console.log(`Erreur : Le Pokémon '${name}' n'existe pas.`);
            return null;
        }

        const data = await response.json();
        const allMoves = data.moves;

        const selectedMoves = [];
        const movesPool = allMoves.sort(() => 0.5 - Math.random()).slice(0, 5);

        for (let m of movesPool) {
            const moveRes = await fetch(m.move.url);
            const moveInfo = await moveRes.json();

            selectedMoves.push({
                name: moveInfo.name,
                power: moveInfo.power || 0,
                accuracy: moveInfo.accuracy || 100,
                pp: moveInfo.pp || 0
            });
        }

        return {
            name: data.name.toUpperCase(),
            moves: selectedMoves,
            hp: 300
        };
    } catch (error) {
        console.error("Erreur de connexion à l'API");
        return null;
    }
}

function calculateDamage(move, attackerName, defenderPP) {
    if (move.pp < defenderPP) {
        console.log(`-> ${attackerName} échoue ! PP trop faible (${move.pp}) face à l'ennemi.`);
        return 0;
    }

    const chance = Math.floor(Math.random() * 100) + 1;
    if (chance > move.accuracy) {
        console.log(`-> ${attackerName} a raté son attaque ${move.name} !`);
        return 0;
    }

    console.log(`-> ${attackerName} utilise ${move.name} et inflige ${move.power} dégâts.`);
    return move.power;
}

async function playGame() {
    console.log("--- MINI-JEU POKÉMON ---");

    const { playerChoice } = await inquirer.prompt([
        {
            type: "input",
            name: "playerChoice",
            message: "Choisissez votre Pokemon : "
        }
    ]);

    const playerPoke = await getPokemonData(playerChoice);
    if (!playerPoke) return;

    const botId = Math.floor(Math.random() * 151) + 1;
    const botPoke = await getPokemonData(botId.toString());

    console.log(`\nCOMBAT : ${playerPoke.name} vs ${botPoke.name}`);

    while (playerPoke.hp > 0 && botPoke.hp > 0) {
        console.log(`\n${playerPoke.name}: ${playerPoke.hp} HP | ${botPoke.name}: ${botPoke.hp} HP`);

        playerPoke.moves.forEach((m, i) => {
            console.log(`${i + 1}. ${m.name} [Pwr: ${m.power}, Acc: ${m.accuracy}, PP: ${m.pp}]`);
        });

        const { choice } = await inquirer.prompt([
            {
                type: "input",
                name: "choice",
                message: "Choisissez une attaque (1-5) : "
            }
        ]);

        const index = parseInt(choice) - 1;
        const move = playerPoke.moves[index];

        if (!move) {
            console.log("Choix invalide, vous passez votre tour !");
        } else {
            const enemyPP = botPoke.moves[0].pp;
            botPoke.hp -= calculateDamage(move, playerPoke.name, enemyPP);
        }

        if (botPoke.hp <= 0) break;

        const botMove = botPoke.moves[Math.floor(Math.random() * botPoke.moves.length)];
        const playerPP = playerPoke.moves[0].pp;
        playerPoke.hp -= calculateDamage(botMove, botPoke.name, playerPP);
    }

    console.log(playerPoke.hp > 0 ? "\nVICTOIRE !" : "\nDÉFAITE...");
}

playGame();