export const avatarsObjects = [
    {
        "key": "womenGamer",
        "src": "src/assets/avatars/women-avatar-game.png"
    },
    {
        "key": "wolfHead",
        "src": "src/assets/avatars/wolf-head.png"
    },
    {
        "key": "tribalWarrior",
        "src": "src/assets/avatars/tribal-warrior.png"
    },
    {
        "key": "skullWarrior",
        "src": "src/assets/avatars/skull-warrior.png"
    },
    {
        "key": "owlReading",
        "src": "src/assets/avatars/owl-reading.png"
    },
    {
        "key": "monsterWarrior",
        "src": "src/assets/avatars/monster-warrior.png"
    },
    {
        "key": "cuteDevilMonster",
        "src": "src/assets/avatars/cute-devil-monster.png"
    },
    {
        "key": "cuteCat",
        "src": "src/assets/avatars/cute-cat.png"
    },
    {
        "key": "chick",
        "src": "src/assets/avatars/chick.png"
    },
    {
        "key": "cartoonKoala",
        "src": "src/assets/avatars/cartoon-koala.png"
    },
    {
        "key": "astronautSkull",
        "src": "src/assets/avatars/astronaut-skull.png"
    },
    {
        "key": "zeus",
        "src": "src/assets/avatars/zeus.png"
    }
];

export const getAvatarImage = (avatarId) => {
    return avatarsObjects.filter(avatar => avatar.key === avatarId)[0].src
}