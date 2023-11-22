import womenAvatarGame from '../assets/avatars/women-avatar-game.png'
import wolfHead from '../assets/avatars/wolf-head.png'
import tribalWarrior from '../assets/avatars/tribal-warrior.png'
import skullWarrior from '../assets/avatars/skull-warrior.png'
import owlReading from '../assets/avatars/owl-reading.png'
import monsterWarrior from '../assets/avatars/monster-warrior.png'
import cuteDevilMonster from '../assets/avatars/cute-devil-monster.png'
import cuteCat from '../assets/avatars/cute-cat.png'
import chick from '../assets/avatars/chick.png'
import cartoonKoala from '../assets/avatars/cartoon-koala.png'
import astronautSkull from '../assets/avatars/astronaut-skull.png'
import zeus from '../assets/avatars/zeus.png'
import userProfileIcon from '../assets/avatars/user-profile-icon.png'

export const avatarsObjects = [
    {
        "key": "womenGamer",
        "img": womenAvatarGame
    },
    {
        "key": "wolfHead",
        "img": wolfHead
    },
    {
        "key": "tribalWarrior",
        "img": tribalWarrior
    },
    {
        "key": "skullWarrior",
        "img": skullWarrior
    },
    {
        "key": "owlReading",
        "img": owlReading
    },
    {
        "key": "monsterWarrior",
        "img": monsterWarrior
    },
    {
        "key": "cuteDevilMonster",
        "img": cuteDevilMonster
    },
    {
        "key": "cuteCat",
        "img": cuteCat
    },
    {
        "key": "chick",
        "img": chick
    },
    {
        "key": "cartoonKoala",
        "img": cartoonKoala
    },
    {
        "key": "astronautSkull",
        "img": astronautSkull
    },
    {
        "key": "zeus",
        "img": zeus
    },
    {
        "key": "defaultAvatar",
        "img": userProfileIcon
    }
];

export const getAvatarImage = (avatarId) => {
    const avatars = avatarsObjects.filter(avatar => avatar.key === avatarId)
    if (avatars && avatars.length > 0) {
        return avatars[0].img;
    }
    return userProfileIcon;
}